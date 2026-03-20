import type { Adjustments } from '../toolbar/types'
import type { LucideIcon } from 'lucide-react'
import {
  Circle, Zap, Cloud, Sunset, Snowflake, Aperture,
  CircleDashed, Film, Star,
} from 'lucide-react'

export interface FilterPreset {
  label: string
  icon: LucideIcon
  adjustments: Partial<Adjustments>
}

export const FILTER_PRESETS: FilterPreset[] = [
  {
    label: 'Original',
    icon: Circle,
    adjustments: {
      brightness: 100, contrast: 100, saturation: 100,
      exposure: 0, grayscale: 0, sepia: 0, hueRotate: 0,
      blur: 0, sharpen: 0, vignette: 0,
    },
  },
  {
    label: 'Vivid',
    icon: Zap,
    adjustments: { brightness: 105, contrast: 120, saturation: 140, exposure: 5 },
  },
  {
    label: 'Muted',
    icon: Cloud,
    adjustments: { brightness: 95, contrast: 85, saturation: 65, exposure: -5 },
  },
  {
    label: 'Warm',
    icon: Sunset,
    adjustments: { brightness: 105, contrast: 100, saturation: 110, exposure: 8, sepia: 15, hueRotate: -5 },
  },
  {
    label: 'Cool',
    icon: Snowflake,
    adjustments: { brightness: 100, contrast: 105, saturation: 95, hueRotate: 10 },
  },
  {
    label: 'Fade',
    icon: Aperture,
    adjustments: { brightness: 115, contrast: 78, saturation: 85, exposure: 12 },
  },
  {
    label: 'B&W',
    icon: CircleDashed,
    adjustments: { grayscale: 100, contrast: 110, saturation: 0 },
  },
  {
    label: 'Noir',
    icon: Film,
    adjustments: { grayscale: 100, contrast: 140, brightness: 90, vignette: 50 },
  },
  {
    label: 'Golden',
    icon: Star,
    adjustments: { brightness: 108, contrast: 105, saturation: 120, sepia: 25, hueRotate: -8 },
  },
]
