import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Type, Pen, Square, ArrowRight, Undo2, Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TextOverlay } from '../layers/use-text-overlays'
import type { DrawTool } from '../layers/use-draw-commands'

export type OverlayMode = 'none' | 'crop' | 'text' | 'draw'

interface Props {
  mode: OverlayMode
  onModeChange: (m: OverlayMode) => void
  // Text
  textOverlays: TextOverlay[]
  selectedTextId: string | null
  onSelectText: (id: string | null) => void
  onUpdateText: (id: string, patch: Partial<TextOverlay>) => void
  onDeleteText: (id: string) => void
  // Draw
  drawTool: DrawTool
  drawColor: string
  drawWidth: number
  onDrawTool: (t: DrawTool) => void
  onDrawColor: (c: string) => void
  onDrawWidth: (w: number) => void
  onDrawUndo: () => void
  canUndo: boolean
}

const DRAW_COLORS = ['#ffffff', '#000000', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7']

export function TabOverlay({
  mode, onModeChange,
  textOverlays, selectedTextId, onSelectText, onUpdateText, onDeleteText,
  drawTool, drawColor, drawWidth, onDrawTool, onDrawColor, onDrawWidth, onDrawUndo, canUndo,
}: Props) {
  const selected = textOverlays.find(t => t.id === selectedTextId)
  const [fontSizeInput, setFontSizeInput] = useState('')
  useEffect(() => {
    setFontSizeInput(selected ? String(selected.fontSize) : '')
  }, [selected?.id, selected?.fontSize])

  return (
    <div className="space-y-4">
      {/* Mode selector */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Tool</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={mode === 'text' ? 'default' : 'outline'}
            size="sm"
            className="gap-1.5"
            onClick={() => onModeChange(mode === 'text' ? 'none' : 'text')}
          >
            <Type className="size-3.5" /> Text
          </Button>
          <Button
            variant={mode === 'draw' ? 'default' : 'outline'}
            size="sm"
            className="gap-1.5"
            onClick={() => onModeChange(mode === 'draw' ? 'none' : 'draw')}
          >
            <Pen className="size-3.5" /> Draw
          </Button>
        </div>
      </div>

      {/* Text mode controls */}
      {mode === 'text' && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">Click on the image to place text.</p>

          {textOverlays.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Text layers</p>
              {textOverlays.map(t => (
                <div
                  key={t.id}
                  onClick={() => onSelectText(t.id === selectedTextId ? null : t.id)}
                  className={cn(
                    'flex items-center justify-between rounded-lg border px-2 py-1.5 cursor-pointer transition-colors text-xs',
                    t.id === selectedTextId
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-secondary/20 text-muted-foreground hover:text-foreground'
                  )}
                >
                  <span className="truncate max-w-[110px]">{t.content || '(empty)'}</span>
                  <button
                    onClick={e => { e.stopPropagation(); onDeleteText(t.id) }}
                    className="text-muted-foreground hover:text-destructive transition-colors ml-1 cursor-pointer"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {selected && (
            <div className="space-y-2 border-t border-border pt-3">
              <p className="text-xs font-medium text-muted-foreground">Edit selected</p>
              <input
                value={selected.content}
                onChange={e => onUpdateText(selected.id, { content: e.target.value })}
                className="w-full rounded-lg border border-border bg-secondary/20 px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                placeholder="Text content..."
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground shrink-0">Size</span>
                <input
                  type="number"
                  min={8}
                  value={fontSizeInput}
                  onChange={e => setFontSizeInput(e.target.value)}
                  onBlur={() => {
                    const v = parseInt(fontSizeInput)
                    const clamped = isNaN(v) ? selected.fontSize : Math.max(8, v)
                    onUpdateText(selected.id, { fontSize: clamped })
                    setFontSizeInput(String(clamped))
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
                  }}
                  onWheel={e => {
                    e.preventDefault()
                    const delta = e.deltaY < 0 ? 2 : -2
                    onUpdateText(selected.id, { fontSize: Math.max(8, selected.fontSize + delta) })
                  }}
                  className="w-16 rounded-lg border border-border bg-secondary/20 px-2 py-1 text-xs text-foreground tabular-nums outline-none focus:border-primary text-center"
                />
                <input
                  type="color"
                  value={selected.color}
                  onChange={e => onUpdateText(selected.id, { color: e.target.value })}
                  className="w-7 h-7 rounded cursor-pointer border border-border bg-transparent"
                  title="Text color"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Draw mode controls */}
      {mode === 'draw' && (
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Shape</p>
            <div className="grid grid-cols-3 gap-1.5">
              {(['pen', 'arrow', 'rect'] as DrawTool[]).map(tool => (
                <Button
                  key={tool}
                  variant={drawTool === tool ? 'default' : 'outline'}
                  size="sm"
                  className="gap-1"
                  onClick={() => onDrawTool(tool)}
                >
                  {tool === 'pen' && <><Pen className="size-3" /> Pen</>}
                  {tool === 'arrow' && <><ArrowRight className="size-3" /> Arrow</>}
                  {tool === 'rect' && <><Square className="size-3" /> Rect</>}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Color</p>
            <div className="flex flex-wrap gap-1.5">
              {DRAW_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => onDrawColor(c)}
                  style={{ backgroundColor: c }}
                  className={cn(
                    'w-6 h-6 rounded-full border-2 cursor-pointer transition-transform hover:scale-110',
                    drawColor === c ? 'border-primary scale-110' : 'border-border'
                  )}
                />
              ))}
              <input
                type="color"
                value={drawColor}
                onChange={e => onDrawColor(e.target.value)}
                className="w-6 h-6 rounded-full cursor-pointer border border-border bg-transparent"
                title="Custom color"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Width</span>
              <Button variant="outline" size="icon-sm" onClick={() => onDrawWidth(Math.max(1, drawWidth - 1))}>
                <Minus className="size-3" />
              </Button>
              <span className="text-xs tabular-nums w-4 text-center">{drawWidth}</span>
              <Button variant="outline" size="icon-sm" onClick={() => onDrawWidth(Math.min(20, drawWidth + 1))}>
                <Plus className="size-3" />
              </Button>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={onDrawUndo} disabled={!canUndo}>
              <Undo2 className="size-3.5" /> Undo
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
