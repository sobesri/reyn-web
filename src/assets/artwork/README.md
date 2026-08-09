# Artwork gallery

Drop artwork images straight into this folder. The gallery picks them up
automatically, with no code changes needed.

Accepted: `.png` `.jpg` `.jpeg` `.webp` `.avif`

## Naming

The filename becomes the caption. A leading number controls the order and is
stripped from the title:

```
01-neon-rain.png      ->  "Neon Rain"       (shown first)
02-late_checkout.jpg  ->  "Late Checkout"
midnight-bus.webp     ->  "Midnight Bus"
```

## Captions and collections

To override a title or tag a piece with one of the six collections, add an
entry to `overrides` in `src/constants/artworks.ts`, keyed by filename:

```ts
const overrides: Record<string, ArtworkMeta> = {
  '01-neon-rain.png': { title: 'Neon Rain, 3am', collection: 'City' },
}
```

## A note on file size

These are shipped to every visitor. Export at roughly 1600px on the long edge
and run them through an image compressor. A 5MB print-res PNG will make the
page crawl on mobile data.

If the folder is empty the gallery section does not render at all, so the page
stays intact until you add the first piece.
