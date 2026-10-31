/**
 * Builds public/og-image.png: the REYN wordmark on the brand ground, at the
 * 1200x630 link previews expect.
 *
 * Written against node:zlib alone rather than an image library, because the
 * project has none and a share card is not worth a dependency. It decodes the
 * logo PNG, crops to the ink, area-averages it down and re-encodes.
 *
 * Run with: node scripts/og-image.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { deflateSync, inflateSync } from 'node:zlib'

const SOURCE = 'src/assets/reyn-logo-2.png'
const OUT = 'public/og-image.png'

const WIDTH = 1200
const HEIGHT = 630
/**
 * The two grounds the card can sit on, matching --ink and --paper in
 * index.css. Light is what the site opens on, so it is what a link preview
 * shows; flip THEME to 'dark' for the black card.
 */
const PALETTES = {
  light: { background: [250, 249, 246], ink: [18, 18, 22] },
  dark: { background: [8, 8, 10], ink: [255, 255, 255] },
}
const THEME = 'light'

const { background: BACKGROUND, ink: INK } = PALETTES[THEME]
/** Share of the card's width the wordmark spans. */
const MARK_WIDTH = 0.66

// --- PNG decode -------------------------------------------------------------

function readChunks(buffer) {
  if (buffer.readUInt32BE(0) !== 0x89504e47) throw new Error('not a PNG')
  const chunks = []
  let offset = 8
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset)
    const type = buffer.toString('ascii', offset + 4, offset + 8)
    chunks.push({ type, data: buffer.subarray(offset + 8, offset + 8 + length) })
    offset += 12 + length
  }
  return chunks
}

const paeth = (a, b, c) => {
  const p = a + b - c
  const pa = Math.abs(p - a)
  const pb = Math.abs(p - b)
  const pc = Math.abs(p - c)
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c
}

/** Returns { width, height, rgba } with filters undone. */
function decode(buffer) {
  const chunks = readChunks(buffer)
  const ihdr = chunks.find((c) => c.type === 'IHDR').data
  const width = ihdr.readUInt32BE(0)
  const height = ihdr.readUInt32BE(4)
  const bitDepth = ihdr[8]
  const colorType = ihdr[9]
  const interlace = ihdr[12]

  if (bitDepth !== 8) throw new Error(`unsupported bit depth ${bitDepth}`)
  if (interlace !== 0) throw new Error('interlaced PNGs are not supported')
  const channels = { 0: 1, 2: 3, 4: 2, 6: 4 }[colorType]
  if (!channels) throw new Error(`unsupported colour type ${colorType}`)

  const idat = Buffer.concat(chunks.filter((c) => c.type === 'IDAT').map((c) => c.data))
  const raw = inflateSync(idat)

  const stride = width * channels
  const out = Buffer.alloc(height * stride)

  for (let y = 0; y < height; y += 1) {
    const filter = raw[y * (stride + 1)]
    const line = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride)
    const cur = out.subarray(y * stride, (y + 1) * stride)
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null

    for (let i = 0; i < stride; i += 1) {
      const a = i >= channels ? cur[i - channels] : 0
      const b = prev ? prev[i] : 0
      const c = prev && i >= channels ? prev[i - channels] : 0
      let value = line[i]
      if (filter === 1) value += a
      else if (filter === 2) value += b
      else if (filter === 3) value += (a + b) >> 1
      else if (filter === 4) value += paeth(a, b, c)
      cur[i] = value & 0xff
    }
  }

  // Normalise to RGBA so the compositor only has one shape to handle.
  const rgba = Buffer.alloc(width * height * 4)
  for (let p = 0; p < width * height; p += 1) {
    const s = p * channels
    const d = p * 4
    if (channels === 4) {
      rgba[d] = out[s]; rgba[d + 1] = out[s + 1]; rgba[d + 2] = out[s + 2]; rgba[d + 3] = out[s + 3]
    } else if (channels === 3) {
      rgba[d] = out[s]; rgba[d + 1] = out[s + 1]; rgba[d + 2] = out[s + 2]; rgba[d + 3] = 255
    } else if (channels === 2) {
      rgba[d] = rgba[d + 1] = rgba[d + 2] = out[s]; rgba[d + 3] = out[s + 1]
    } else {
      rgba[d] = rgba[d + 1] = rgba[d + 2] = out[s]; rgba[d + 3] = 255
    }
  }
  return { width, height, rgba }
}

// --- PNG encode -------------------------------------------------------------

const CRC_TABLE = (() => {
  const table = new Int32Array(256)
  for (let n = 0; n < 256; n += 1) {
    let c = n
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c
  }
  return table
})()

function crc32(buffer) {
  let c = 0xffffffff
  for (let i = 0; i < buffer.length; i += 1) c = CRC_TABLE[(c ^ buffer[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([length, body, crc])
}

/** Encodes opaque 8-bit RGB. Filter 0 throughout: deflate does the work. */
function encodeRgb(width, height, rgb) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  const stride = width * 3
  const raw = Buffer.alloc(height * (stride + 1))
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0
    rgb.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// --- Compose ----------------------------------------------------------------

const logo = decode(readFileSync(SOURCE))

// Crop to the ink: the asset is mostly transparent margin, and its own
// proportions should not decide the card's.
let minX = logo.width, minY = logo.height, maxX = -1, maxY = -1
for (let y = 0; y < logo.height; y += 1) {
  for (let x = 0; x < logo.width; x += 1) {
    if (logo.rgba[(y * logo.width + x) * 4 + 3] > 8) {
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }
}
const cropW = maxX - minX + 1
const cropH = maxY - minY + 1

const markW = Math.round(WIDTH * MARK_WIDTH)
const markH = Math.round((markW * cropH) / cropW)
const originX = Math.round((WIDTH - markW) / 2)
const originY = Math.round((HEIGHT - markH) / 2)

const canvas = Buffer.alloc(WIDTH * HEIGHT * 3)
for (let p = 0; p < WIDTH * HEIGHT; p += 1) {
  canvas[p * 3] = BACKGROUND[0]
  canvas[p * 3 + 1] = BACKGROUND[1]
  canvas[p * 3 + 2] = BACKGROUND[2]
}

// Area-average each destination pixel over the source box it covers, so the
// 8x downscale does not alias the thin strokes to pieces.
const scaleX = cropW / markW
const scaleY = cropH / markH
for (let y = 0; y < markH; y += 1) {
  const sy0 = minY + Math.floor(y * scaleY)
  const sy1 = Math.min(maxY + 1, minY + Math.ceil((y + 1) * scaleY))
  for (let x = 0; x < markW; x += 1) {
    const sx0 = minX + Math.floor(x * scaleX)
    const sx1 = Math.min(maxX + 1, minX + Math.ceil((x + 1) * scaleX))
    let alpha = 0
    let n = 0
    for (let sy = sy0; sy < sy1; sy += 1) {
      for (let sx = sx0; sx < sx1; sx += 1) {
        alpha += logo.rgba[(sy * logo.width + sx) * 4 + 3]
        n += 1
      }
    }
    if (n === 0) continue
    const a = alpha / n / 255
    if (a <= 0) continue
    const d = ((originY + y) * WIDTH + (originX + x)) * 3
    for (let c = 0; c < 3; c += 1) {
      canvas[d + c] = Math.round(BACKGROUND[c] * (1 - a) + INK[c] * a)
    }
  }
}

writeFileSync(OUT, encodeRgb(WIDTH, HEIGHT, canvas))
console.log(`${OUT}: ${WIDTH}x${HEIGHT}, mark cropped from ${cropW}x${cropH} at ${minX},${minY}`)
