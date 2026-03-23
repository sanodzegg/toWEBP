import { useRef, useState, useCallback } from 'react'
import type { Adjustments, Transform } from '../toolbar/types'
import type { DrawCommand } from './use-draw-commands'
import type { TextOverlay } from './use-text-overlays'

interface Rect { x: number; y: number; w: number; h: number }

export interface EditorSnapshot {
  crop: Rect
  adjustments: Adjustments
  transform: Transform
  drawCommands: DrawCommand[]
  textOverlays: TextOverlay[]
}

export function useEditorHistory(initial: EditorSnapshot) {
  const pastRef = useRef<EditorSnapshot[]>([])
  const futureRef = useRef<EditorSnapshot[]>([])
  // Track counts to trigger re-renders when history changes
  const [counts, setCounts] = useState({ past: 0, future: 0 })

  const refreshCounts = () => setCounts({ past: pastRef.current.length, future: futureRef.current.length })

  // Call BEFORE applying a change, passing the current (pre-change) snapshot
  const push = useCallback((current: EditorSnapshot) => {
    pastRef.current = [...pastRef.current, current]
    futureRef.current = []
    refreshCounts()
  }, [])

  const undo = useCallback((): EditorSnapshot | null => {
    if (pastRef.current.length === 0) return null
    const prev = pastRef.current[pastRef.current.length - 1]
    pastRef.current = pastRef.current.slice(0, -1)
    refreshCounts()
    return prev
  }, [])

  const redo = useCallback((current: EditorSnapshot): EditorSnapshot | null => {
    if (futureRef.current.length === 0) return null
    const next = futureRef.current[0]
    pastRef.current = [...pastRef.current, current]
    futureRef.current = futureRef.current.slice(1)
    refreshCounts()
    return next
  }, [])

  const pushRedo = useCallback((current: EditorSnapshot) => {
    futureRef.current = [current, ...futureRef.current]
    refreshCounts()
  }, [])

  const reset = useCallback(() => {
    pastRef.current = []
    futureRef.current = []
    refreshCounts()
  }, [])

  return {
    canUndo: counts.past > 0,
    canRedo: counts.future > 0,
    push,
    pushRedo,
    undo,
    redo,
    reset,
  }
}
