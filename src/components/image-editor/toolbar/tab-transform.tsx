import { Button } from '@/components/ui/button'
import { FlipHorizontal, FlipVertical, RotateCcw, RotateCw } from 'lucide-react'
import { SliderRow } from './slider-row'
import type { Transform } from './types'

interface Props {
  transform: Transform
  vignette: number
  onTransform: (t: Transform) => void
  onVignette: (v: number) => void
}

export function TabTransform({ transform, vignette, onTransform, onVignette }: Props) {
  const rotateLeft  = () => onTransform({ ...transform, rotation: (transform.rotation - 90 + 360) % 360 })
  const rotateRight = () => onTransform({ ...transform, rotation: (transform.rotation + 90) % 360 })

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Rotate</p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={rotateLeft}>
            <RotateCcw className="size-3.5" /> CCW
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={rotateRight}>
            <RotateCw className="size-3.5" /> CW
          </Button>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Flip</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={transform.flipH ? 'default' : 'outline'}
            size="sm"
            className="gap-1.5"
            onClick={() => onTransform({ ...transform, flipH: !transform.flipH })}
          >
            <FlipHorizontal className="size-3.5" /> Flip H
          </Button>
          <Button
            variant={transform.flipV ? 'default' : 'outline'}
            size="sm"
            className="gap-1.5"
            onClick={() => onTransform({ ...transform, flipV: !transform.flipV })}
          >
            <FlipVertical className="size-3.5" /> Flip V
          </Button>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Vignette</p>
        <SliderRow
          label="Intensity"
          value={vignette}
          min={0}
          max={100}
          neutral={0}
          onChange={onVignette}
        />
      </div>
    </div>
  )
}
