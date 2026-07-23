// =============================================================================
// Builds a CanvasTexture for a 3D billboard panel (title + subtitle + accent).
// Avoids loading external font files for Three.js TextGeometry.
// =============================================================================
import * as THREE from 'three'

interface BillboardTextOptions {
  title: string
  subtitle: string
  accent: string
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export function createBillboardTexture({
  title,
  subtitle,
  accent,
}: BillboardTextOptions): THREE.CanvasTexture {
  const W = 640
  const H = 360
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // Panel background
  ctx.fillStyle = 'rgba(10, 14, 24, 0.92)'
  roundRect(ctx, 12, 12, W - 24, H - 24, 28)
  ctx.fill()

  // Accent border
  ctx.lineWidth = 6
  ctx.strokeStyle = accent
  roundRect(ctx, 12, 12, W - 24, H - 24, 28)
  ctx.stroke()

  // Accent tab
  ctx.fillStyle = accent
  roundRect(ctx, 44, 44, 120, 16, 8)
  ctx.fill()

  // Title
  ctx.fillStyle = '#EAF0FF'
  ctx.font = '700 64px "Space Grotesk", system-ui, sans-serif'
  ctx.textBaseline = 'top'
  ctx.fillText(title, 44, 96, W - 100)

  // Subtitle (wrapped)
  ctx.fillStyle = '#9AA7C2'
  ctx.font = '400 30px "Space Grotesk", system-ui, sans-serif'
  const words = subtitle.split(' ')
  let line = ''
  let y = 188
  const maxWidth = W - 96
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, 44, y)
      line = word
      y += 40
    } else {
      line = test
    }
    if (y > H - 60) break
  }
  if (line) ctx.fillText(line, 44, y)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  texture.needsUpdate = true
  return texture
}
