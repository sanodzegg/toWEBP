import type { Adjustments } from '../toolbar/types'

// Build CSS filter string from adjustments (applied via ctx.filter)
export function buildFilter(a: Adjustments): string {
  const exp = a.exposure >= 0
    ? `brightness(${1 + a.exposure / 100})`
    : `brightness(${1 + a.exposure / 200})`
  return [
    `brightness(${a.brightness}%)`,
    `contrast(${a.contrast}%)`,
    `saturate(${a.saturation}%)`,
    `grayscale(${a.grayscale}%)`,
    `sepia(${a.sepia}%)`,
    `hue-rotate(${a.hueRotate}deg)`,
    exp,
  ].join(' ')
}

// Apply gaussian blur using CSS filter on an offscreen canvas
// Returns a new offscreen canvas with blur applied
export function applyBlur(source: HTMLCanvasElement, radius: number): HTMLCanvasElement {
  const out = document.createElement('canvas')
  out.width = source.width
  out.height = source.height
  const ctx = out.getContext('2d')!
  if (radius > 0) {
    ctx.filter = `blur(${radius}px)`
  }
  ctx.drawImage(source, 0, 0)
  ctx.filter = 'none'
  return out
}

// Apply sharpen via convolution on ImageData
// strength: 0–10, maps to kernel factor 0.0–0.3
export function applySharpen(source: HTMLCanvasElement, strength: number): HTMLCanvasElement {
  const out = document.createElement('canvas')
  out.width = source.width
  out.height = source.height
  const ctx = out.getContext('2d')!
  ctx.drawImage(source, 0, 0)

  if (strength <= 0) return out

  const s = (strength / 10) * 0.3
  const kernel = [
    0, -s, 0,
    -s, 1 + 4 * s, -s,
    0, -s, 0,
  ]

  const imageData = ctx.getImageData(0, 0, out.width, out.height)
  const src = new Uint8ClampedArray(imageData.data)
  const dst = imageData.data
  const w = out.width
  const h = out.height

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = (y * w + x) * 4
      for (let c = 0; c < 3; c++) {
        dst[i + c] = Math.min(255, Math.max(0,
          kernel[0] * src[((y - 1) * w + (x - 1)) * 4 + c] +
          kernel[1] * src[((y - 1) * w + x) * 4 + c] +
          kernel[2] * src[((y - 1) * w + (x + 1)) * 4 + c] +
          kernel[3] * src[(y * w + (x - 1)) * 4 + c] +
          kernel[4] * src[(y * w + x) * 4 + c] +
          kernel[5] * src[(y * w + (x + 1)) * 4 + c] +
          kernel[6] * src[((y + 1) * w + (x - 1)) * 4 + c] +
          kernel[7] * src[((y + 1) * w + x) * 4 + c] +
          kernel[8] * src[((y + 1) * w + (x + 1)) * 4 + c]
        ))
      }
      dst[i + 3] = src[i + 3] // preserve alpha
    }
  }

  ctx.putImageData(imageData, 0, 0)
  return out
}

// Draw a vignette radial gradient on top of the current canvas context
// Call after drawing the image, before drawing overlays
export function applyVignette(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  intensity: number, // 0–100
) {
  if (intensity <= 0) return
  const alpha = intensity / 100
  const cx = x + w / 2
  const cy = y + h / 2
  const radius = Math.sqrt(w * w + h * h) / 2

  const gradient = ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, radius)
  gradient.addColorStop(0, `rgba(0,0,0,0)`)
  gradient.addColorStop(1, `rgba(0,0,0,${alpha})`)

  ctx.save()
  ctx.fillStyle = gradient
  ctx.fillRect(x, y, w, h)
  ctx.restore()
}
