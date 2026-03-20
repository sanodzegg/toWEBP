import { Button } from '@/components/ui/button'
import { Lock, Unlock } from 'lucide-react'
import { RESIZE_PRESETS, type ResizeState } from '../utils/resize-presets'
import { cn } from '@/lib/utils'

interface Props {
  resize: ResizeState
  naturalW: number
  naturalH: number
  onChange: (r: ResizeState) => void
}

export function TabCanvas({ resize, naturalW, naturalH, onChange }: Props) {
  const aspectRatio = naturalW / (naturalH || 1)

  const setW = (raw: string) => {
    const w = parseInt(raw) || 0
    const h = resize.lockAspect ? Math.round(w / aspectRatio) : resize.h
    onChange({ ...resize, enabled: w > 0, w, h })
  }

  const setH = (raw: string) => {
    const h = parseInt(raw) || 0
    const w = resize.lockAspect ? Math.round(h * aspectRatio) : resize.w
    onChange({ ...resize, enabled: h > 0, w, h })
  }

  const applyPreset = (w: number, h: number, label: string) => {
    onChange({ ...resize, enabled: true, w, h })
  }

  const reset = () => onChange({ enabled: false, w: naturalW, h: naturalH, lockAspect: resize.lockAspect })

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-muted-foreground">Export size</p>
          {resize.enabled && (
            <button onClick={reset} className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2">
              Reset
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 space-y-1">
            <span className="text-[10px] text-muted-foreground">W</span>
            <input
              type="number"
              value={resize.enabled ? resize.w : naturalW}
              onChange={e => setW(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary/20 px-2 py-1.5 text-xs text-foreground outline-none focus:border-primary"
              min={1}
            />
          </div>
          <button
            onClick={() => onChange({ ...resize, lockAspect: !resize.lockAspect })}
            className="mt-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title={resize.lockAspect ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
          >
            {resize.lockAspect ? <Lock className="size-3.5" /> : <Unlock className="size-3.5" />}
          </button>
          <div className="flex-1 space-y-1">
            <span className="text-[10px] text-muted-foreground">H</span>
            <input
              type="number"
              value={resize.enabled ? resize.h : naturalH}
              onChange={e => setH(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary/20 px-2 py-1.5 text-xs text-foreground outline-none focus:border-primary"
              min={1}
            />
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Presets</p>
        <div className="space-y-1">
          {RESIZE_PRESETS.map(preset => {
            const isActive = resize.enabled && resize.w === preset.w && resize.h === preset.h
            return (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset.w, preset.h, preset.label)}
                className={cn(
                  'w-full flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-xs transition-colors cursor-pointer',
                  isActive
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-secondary/20 text-muted-foreground hover:text-foreground hover:border-primary/50'
                )}
              >
                <span>{preset.label}</span>
                <span className="tabular-nums text-[10px]">{preset.w}×{preset.h}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
