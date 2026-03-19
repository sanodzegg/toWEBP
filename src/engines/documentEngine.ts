import type { ConversionEngine } from './ConversionEngine'
import type { ConversionOptions } from '@/types'

export const documentEngine: ConversionEngine = {
  id: 'document',
  name: 'Document Engine',
  supportedInputExtensions: ['pdf'],
  outputFormats: ['docx', 'txt'],

  async convert(_file: File, _targetFormat: string, _options: ConversionOptions): Promise<Blob> {
    throw new Error('Document engine not yet implemented')
  },
}
