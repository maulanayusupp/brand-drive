// =============================================================================
// Builds a CanvasTexture for a 3D billboard panel: an accent icon badge, title,
// subtitle, and accent trim. Icons are drawn from the shared iconPaths module
// (same set as <BaseIcon>) so 3D matches the UI. Avoids external font/model deps.
// =============================================================================
import * as THREE from 'three'
import { filledIcons, iconPaths } from '~/utils/iconPaths'

interface BillboardTextOptions {
  title: string
  subtitle: string
  accent: string
  icon?: string
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

/** Draws a 24x24-viewBox icon (path/circle/rect) centered in a size box. */
function drawIcon(
  ctx: CanvasRenderingContext2D,
  name: string,
  cx: number,
  cy: number,
  size: number,
  color: string,
) {
  const inner = iconPaths[name]
  if (!inner) return
  const filled = filledIcons.has(name)
  const paint = () => (filled ? ctx.fill() : ctx.stroke())

  ctx.save()
  ctx.translate(cx - size / 2, cy - size / 2)
  ctx.scale(size / 24, size / 24)
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 1.9
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  for (const m of inner.matchAll(/<path d="([^"]+)"/g)) {
    const p = new Path2D(m[1])
    if (filled) ctx.fill(p)
    else ctx.stroke(p)
  }
  for (const m of inner.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"/g)) {
    ctx.beginPath()
    ctx.arc(Number(m[1]), Number(m[2]), Number(m[3]), 0, Math.PI * 2)
    paint()
  }
  for (const m of inner.matchAll(
    /<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"(?: rx="([\d.]+)")?/g,
  )) {
    roundRect(ctx, Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4]), Number(m[5] || 0))
    paint()
  }
  ctx.restore()
}

export function createBillboardTexture({
  title,
  subtitle,
  accent,
  icon,
}: BillboardTextOptions): THREE.CanvasTexture {
  const W = 640
  const H = 360
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // Panel background + accent border
  ctx.fillStyle = 'rgba(10, 14, 24, 0.92)'
  roundRect(ctx, 12, 12, W - 24, H - 24, 28)
  ctx.fill()
  ctx.lineWidth = 6
  ctx.strokeStyle = accent
  roundRect(ctx, 12, 12, W - 24, H - 24, 28)
  ctx.stroke()

  // Icon badge (accent-tinted rounded square + icon)
  const badgeX = 44
  const badgeY = 40
  const badgeS = 96
  ctx.fillStyle = accent
  ctx.globalAlpha = 0.16
  roundRect(ctx, badgeX, badgeY, badgeS, badgeS, 22)
  ctx.fill()
  ctx.globalAlpha = 1
  if (icon) drawIcon(ctx, icon, badgeX + badgeS / 2, badgeY + badgeS / 2, 54, accent)

  // Title (to the right of the badge)
  ctx.fillStyle = '#EAF0FF'
  ctx.font = '700 52px "Space Grotesk", system-ui, sans-serif'
  ctx.textBaseline = 'middle'
  ctx.fillText(title, badgeX + badgeS + 26, badgeY + badgeS / 2, W - (badgeX + badgeS + 60))

  // Subtitle (wrapped, below)
  ctx.fillStyle = '#9AA7C2'
  ctx.font = '400 30px "Space Grotesk", system-ui, sans-serif'
  ctx.textBaseline = 'top'
  const words = subtitle.split(' ')
  let line = ''
  let y = 178
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
