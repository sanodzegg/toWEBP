import { useState } from 'react'
import { cn } from '@/lib/utils'
import { TabTransform } from './tab-transform'
import { TabOverlay, type OverlayMode } from './tab-overlay'
import { TabCanvas } from './tab-canvas'
import type { Adjustments, Transform } from './types'
import type { ResizeState } from '../utils/resize-presets'
import type { TextOverlay } from '../layers/use-text-overlays'
import type { DrawTool } from '../layers/use-draw-commands'

type SideTab = 'canvas' | 'transform' | 'overlay'

const TABS: { id: SideTab; label: string; mode: OverlayMode }[] = [
  { id: 'canvas',    label: 'Crop',      mode: 'crop' },
  { id: 'transform', label: 'Transform', mode: 'none' },
  { id: 'overlay',   label: 'Overlay',   mode: 'text' },
]

interface Props {
  adjustments: Adjustments
  transform: Transform
  resize: ResizeState
  naturalW: number
  naturalH: number
  mode: OverlayMode
  textOverlays: TextOverlay[]
  selectedTextId: string | null
  drawTool: DrawTool
  drawColor: string
  drawWidth: number
  canUndo: boolean
  onTransform: (t: Transform) => void
  onResize: (r: ResizeState) => void
  onMode: (m: OverlayMode) => void
  onAdjustments: (a: Adjustments) => void
  onSelectText: (id: string | null) => void
  onUpdateText: (id: string, patch: Partial<TextOverlay>) => void
  onDeleteText: (id: string) => void
  onDrawTool: (t: DrawTool) => void
  onDrawColor: (c: string) => void
  onDrawWidth: (w: number) => void
  onDrawUndo: () => void
}

export function SideToolbar({
  adjustments, transform, resize, naturalW, naturalH,
  mode, textOverlays, selectedTextId,
  drawTool, drawColor, drawWidth, canUndo,
  onTransform, onResize, onMode, onAdjustments,
  onSelectText, onUpdateText, onDeleteText,
  onDrawTool, onDrawColor, onDrawWidth, onDrawUndo,
}: Props) {
  const [activeTab, setActiveTab] = useState<SideTab>('canvas')

  return (
    <div className="rounded-2xl border border-border bg-secondary/20 overflow-hidden">
      <div className="flex border-b border-border">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); onMode(tab.mode) }}
            className={cn(
              'flex-1 py-2 text-[10px] font-medium transition-colors cursor-pointer',
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 overflow-y-auto max-h-[calc(100vh-280px)]">
        {activeTab === 'canvas' && (
          <TabCanvas resize={resize} naturalW={naturalW} naturalH={naturalH} onChange={onResize} />
        )}
        {activeTab === 'transform' && (
          <TabTransform
            transform={transform}
            vignette={adjustments.vignette}
            onTransform={onTransform}
            onVignette={v => onAdjustments({ ...adjustments, vignette: v })}
          />
        )}
        {activeTab === 'overlay' && (
          <TabOverlay
            mode={mode}
            onModeChange={onMode}
            textOverlays={textOverlays}
            selectedTextId={selectedTextId}
            onSelectText={onSelectText}
            onUpdateText={onUpdateText}
            onDeleteText={onDeleteText}
            drawTool={drawTool}
            drawColor={drawColor}
            drawWidth={drawWidth}
            onDrawTool={onDrawTool}
            onDrawColor={onDrawColor}
            onDrawWidth={onDrawWidth}
            onDrawUndo={onDrawUndo}
            canUndo={canUndo}
          />
        )}
      </div>
    </div>
  )
}
