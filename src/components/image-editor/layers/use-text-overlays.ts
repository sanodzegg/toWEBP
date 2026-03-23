import { useState, useCallback } from 'react'
import { randomId } from '../utils/random-id'

export interface TextOverlay {
  id: string
  x: number         // image space
  y: number         // image space
  content: string
  fontSize: number  // image pixels
  color: string
  fontFamily: string
}

export function useTextOverlays() {
  const [overlays, setOverlays] = useState<TextOverlay[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const add = useCallback((x: number, y: number): string => {
    const id = randomId()
    setOverlays(prev => [...prev, {
      id,
      x, y,
      content: 'Text',
      fontSize: 48,
      color: '#ffffff',
      fontFamily: 'sans-serif',
    }])
    setSelectedId(id)
    return id
  }, [])

  const update = useCallback((id: string, patch: Partial<TextOverlay>) => {
    setOverlays(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t))
  }, [])

  const remove = useCallback((id: string) => {
    setOverlays(prev => prev.filter(t => t.id !== id))
    setSelectedId(prev => prev === id ? null : prev)
  }, [])

  const clear = useCallback(() => {
    setOverlays([])
    setSelectedId(null)
  }, [])

  const setOverlaysExternal = useCallback((ovs: TextOverlay[]) => {
    setOverlays(ovs)
    setSelectedId(null)
  }, [])

  return { overlays, selectedId, setSelectedId, add, update, remove, clear, setOverlays: setOverlaysExternal }
}
