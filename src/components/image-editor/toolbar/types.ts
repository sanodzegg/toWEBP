export interface Adjustments {
  brightness: number    // 0–200, 100 = neutral
  contrast: number      // 0–200, 100 = neutral
  saturation: number    // 0–200, 100 = neutral
  exposure: number      // -100–100, 0 = neutral
  grayscale: number     // 0–100, 0 = neutral
  sepia: number         // 0–100, 0 = neutral
  hueRotate: number     // -180–180, 0 = neutral
  blur: number          // 0–20, 0 = neutral
  sharpen: number       // 0–10, 0 = neutral
  vignette: number      // 0–100, 0 = neutral
}

export interface Transform {
  rotation: number      // 0, 90, 180, 270
  flipH: boolean
  flipV: boolean
}

export const DEFAULT_ADJUSTMENTS: Adjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  exposure: 0,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0,
  blur: 0,
  sharpen: 0,
  vignette: 0,
}

export const DEFAULT_TRANSFORM: Transform = {
  rotation: 0,
  flipH: false,
  flipV: false,
}

export type EditorTab = 'adjust' | 'effects' | 'transform' | 'overlay' | 'canvas' | 'bgremove'
