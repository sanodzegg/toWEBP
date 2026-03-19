import type { StateCreator } from 'zustand'
import type {
  SettingsSliceState,
  SettingsSliceActions,
  FileSliceState,
  FileSliceActions,
  ConversionSliceState,
  ConversionSliceActions,
} from '@/types'

type FullStore = FileSliceState &
  FileSliceActions &
  ConversionSliceState &
  ConversionSliceActions &
  SettingsSliceState &
  SettingsSliceActions

export const createSettingsSlice: StateCreator<
  FullStore,
  [['zustand/persist', unknown]],
  [],
  SettingsSliceState & SettingsSliceActions
> = (set) => ({
  quality: 60,
  defaultOutputFormat: 'webp',
  setQuality: (quality) => set({ quality }),
  setDefaultOutputFormat: (defaultOutputFormat) => set({ defaultOutputFormat }),
})
