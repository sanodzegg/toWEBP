export function fileKey(f: File): string {
  return `${f.name}-${f.size}-${f.lastModified}`
}

export function getExtension(f: File): string {
  const parts = f.name.split('.')
  const raw = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
  return raw === 'jpeg' ? 'jpg' : raw
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  return bytes < 1024 * 1024
    ? (bytes / 1024).toFixed(1) + 'KB'
    : (bytes / 1024 / 1024).toFixed(1) + 'MB'
}
