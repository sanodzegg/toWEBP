import { SliderRow } from './slider-row'
import type { Adjustments } from './types'
import { DEFAULT_ADJUSTMENTS } from './types'

interface Props {
  adjustments: Adjustments
  onChange: (a: Adjustments) => void
  onReset: () => void
  grid?: boolean
}

export function TabAdjust({ adjustments, onChange, onReset, grid = false }: Props) {
  const set = (key: keyof Adjustments) => (v: number) =>
    onChange({ ...adjustments, [key]: v })

  const isAdjusted = JSON.stringify(adjustments) !== JSON.stringify(DEFAULT_ADJUSTMENTS)

  const sliders = (
    <>
      <SliderRow label="Brightness" value={adjustments.brightness} min={0} max={200} neutral={100} onChange={set('brightness')} />
      <SliderRow label="Contrast"   value={adjustments.contrast}   min={0} max={200} neutral={100} onChange={set('contrast')} />
      <SliderRow label="Exposure"   value={adjustments.exposure}   min={-100} max={100} neutral={0} onChange={set('exposure')} />
      <SliderRow label="Saturation" value={adjustments.saturation} min={0} max={200} neutral={100} onChange={set('saturation')} />
      <SliderRow label="Grayscale"  value={adjustments.grayscale}  min={0} max={100} neutral={0}   onChange={set('grayscale')} />
      <SliderRow label="Warmth"     value={adjustments.sepia}      min={0} max={100} neutral={0}   onChange={set('sepia')} />
      <SliderRow label="Hue"        value={adjustments.hueRotate}  min={-180} max={180} neutral={0} onChange={set('hueRotate')} />
      <SliderRow label="Blur"       value={adjustments.blur}       min={0} max={20}  neutral={0}   step={0.5} onChange={set('blur')} />
      <SliderRow label="Sharpen"    value={adjustments.sharpen}    min={0} max={10}  neutral={0}   onChange={set('sharpen')} />
    </>
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">Adjustments</p>
        {isAdjusted && (
          <button
            onClick={onReset}
            className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            Reset all
          </button>
        )}
      </div>
      {grid ? (
        <div className="grid grid-cols-3 gap-x-6 gap-y-3">{sliders}</div>
      ) : (
        <div className="space-y-3">{sliders}</div>
      )}
    </div>
  )
}
