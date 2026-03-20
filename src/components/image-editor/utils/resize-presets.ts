export interface ResizePreset {
  label: string
  w: number
  h: number
}

export const RESIZE_PRESETS: ResizePreset[] = [
  { label: 'Instagram Square', w: 1080, h: 1080 },
  { label: 'Instagram Story', w: 1080, h: 1920 },
  { label: 'Twitter Post', w: 1200, h: 675 },
  { label: 'Twitter Header', w: 1500, h: 500 },
  { label: 'Facebook Cover', w: 820, h: 312 },
  { label: 'LinkedIn Banner', w: 1584, h: 396 },
  { label: 'YouTube Thumb', w: 1280, h: 720 },
  { label: 'HD', w: 1920, h: 1080 },
  { label: '4K', w: 3840, h: 2160 },
]

export interface ResizeState {
  enabled: boolean
  w: number
  h: number
  lockAspect: boolean
}

export const DEFAULT_RESIZE: ResizeState = {
  enabled: false,
  w: 0,
  h: 0,
  lockAspect: true,
}
