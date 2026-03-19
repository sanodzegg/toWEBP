import type { ConversionEngine } from './ConversionEngine'
import type { ConversionOptions } from '@/types'

export const videoEngine: ConversionEngine = {
  id: 'video',
  name: 'FFmpeg Video Engine',
  supportedInputExtensions: ['mp4', 'mov', 'avi', 'mkv'],
  outputFormats: ['mp4', 'webm', 'gif'],

  async convert(_file: File, _targetFormat: string, _options: ConversionOptions): Promise<Blob> {
    throw new Error('Video engine not yet implemented')
  },
}
