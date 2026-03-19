import type { ConversionOptions } from '@/types'

export interface ConversionEngine {
  id: string
  name: string
  supportedInputExtensions: string[]
  outputFormats: string[]
  convert(file: File, targetFormat: string, options: ConversionOptions): Promise<Blob>
}
