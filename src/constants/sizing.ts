import sizeChartPoster from '../assets/size-chart.png'

export { sizeChartPoster }

export const sizes = ['S', 'M', 'L', 'XL'] as const

/**
 * Transcribed from the REYN size chart poster. All values in inches.
 * If the poster is ever reissued, update both this table and the asset.
 */
export const measurements: { label: string; values: string[]; how: string }[] = [
  {
    label: 'Shoulder',
    values: ['20.5', '21.0', '21.5', '22.0'],
    how: 'Measure from one shoulder edge to the other.',
  },
  {
    label: 'Sleeve length',
    values: ['8.5', '9.0', '9.5', '10.0'],
    how: 'Measure from the shoulder seam to the end of the sleeve.',
  },
  {
    label: 'Chest',
    values: ['20.0', '21.0', '22.0', '23.0'],
    how: 'Measure around the fullest part of the chest, keeping the tape level.',
  },
  {
    label: 'Body length',
    values: ['28.5', '29.0', '29.5', '30.0'],
    how: 'Measure from the highest point of the shoulder to the bottom hem.',
  },
]

export const features = [
  'Oversized fit',
  'Drop shoulder',
  'Premium 240GSM fabric',
  'Heavyweight & durable',
  'Comfortable & breathable',
  'Unisex style',
]
