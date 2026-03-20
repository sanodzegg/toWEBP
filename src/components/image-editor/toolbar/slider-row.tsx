import { Slider } from '@/components/ui/slider'

interface Props {
  label: string
  value: number
  min: number
  max: number
  neutral: number
  step?: number
  onChange: (v: number) => void
}

export function SliderRow({ label, value, min, max, neutral, step = 1, onChange }: Props) {
  const isChanged = value !== neutral
  const delta = value - neutral
  const display = delta > 0 ? `+${delta}` : `${delta}`

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${isChanged ? 'text-primary' : 'text-muted-foreground'}`}>
          {label}
        </span>
        <span className={`text-xs tabular-nums ${isChanged ? 'text-primary' : 'text-muted-foreground'}`}>
          {display}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={v => onChange(Array.isArray(v) ? v[0] : v)}
      />
    </div>
  )
}
