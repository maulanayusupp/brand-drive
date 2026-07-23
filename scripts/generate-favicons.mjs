// =============================================================================
// Generates the full favicon set (PNG/ICO), a web app manifest, and copies the
// SVG favicon into /public — from a single source SVG. Run: `pnpm favicons`.
// =============================================================================
import { favicons } from 'favicons'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const source = join(root, 'assets', 'favicon-source.svg')
const outDir = join(root, 'public')

const config = {
  path: '/',
  appName: 'Brand Drive',
  appShortName: 'Brand Drive',
  appDescription: 'Payment infrastructure for businesses that move fast.',
  background: '#070a12',
  theme_color: '#070a12',
  display: 'standalone',
  start_url: '/',
  icons: {
    android: true,
    appleIcon: true,
    favicons: true,
    windows: false,
    yandex: false,
    appleStartup: false,
  },
}

async function run() {
  await mkdir(outDir, { recursive: true })

  const response = await favicons(source, config)

  await Promise.all(
    response.images.map((img) => writeFile(join(outDir, img.name), img.contents)),
  )

  for (const file of response.files) {
    // Normalize the manifest filename to /site.webmanifest (referenced in head).
    const name = file.name.includes('manifest') ? 'site.webmanifest' : file.name
    await writeFile(join(outDir, name), file.contents)
  }

  // Ship the crisp SVG favicon too (modern browsers prefer it).
  const svg = await readFile(source)
  await writeFile(join(outDir, 'favicon.svg'), svg)

  console.log(
    `✓ favicons: ${response.images.length} images + ${response.files.length} files + favicon.svg`,
  )
}

run().catch((err) => {
  console.error('favicon generation failed:', err)
  process.exit(1)
})
