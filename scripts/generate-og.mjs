// =============================================================================
// Renders the social share image (Open Graph / Twitter) to /public/og-image.png
// at 1200x630 from a source SVG. Run: `pnpm og`.
// =============================================================================
import sharp from 'sharp'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const source = join(root, 'assets', 'og-source.svg')
const out = join(root, 'public', 'og-image.png')

await sharp(source, { density: 200 })
  .resize(1200, 630, { fit: 'cover' })
  .png({ quality: 90, compressionLevel: 9 })
  .toFile(out)

console.log('✓ og-image.png (1200x630) generated')
