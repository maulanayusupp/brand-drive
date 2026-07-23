// =============================================================================
// Procedural building facade texture — a grid of windows, some lit. Used as
// both the color map and emissive map so lit windows glow at night.
// =============================================================================
import * as THREE from 'three'

export function createWindowTexture(seed = 1): THREE.CanvasTexture {
  const W = 256
  const H = 512
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // Facade base
  ctx.fillStyle = '#0b1020'
  ctx.fillRect(0, 0, W, H)

  const cols = 6
  const rows = 14
  const marginX = 14
  const marginY = 16
  const gapX = 10
  const gapY = 12
  const cellW = (W - marginX * 2 - gapX * (cols - 1)) / cols
  const cellH = (H - marginY * 2 - gapY * (rows - 1)) / rows

  // Deterministic-ish PRNG so a given seed is stable within a session.
  let s = seed * 9301 + 49297
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }

  const lit = ['#c6ff3d', '#23e5db', '#ffd24a', '#7c5cff', '#eaf0ff']

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = marginX + c * (cellW + gapX)
      const y = marginY + r * (cellH + gapY)
      const on = rand() > 0.55
      if (on) {
        ctx.fillStyle = lit[Math.floor(rand() * lit.length)]
        ctx.globalAlpha = 0.55 + rand() * 0.45
      } else {
        ctx.fillStyle = '#121a2c' // dark (unlit) window
        ctx.globalAlpha = 1
      }
      ctx.fillRect(x, y, cellW, cellH)
      ctx.globalAlpha = 1
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.needsUpdate = true
  return texture
}
