import { Eraser } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function TabBgRemove() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground leading-relaxed">
        Automatically remove the background from your image using AI. Works best on photos with a clear subject.
      </p>
      <Button className="w-full gap-2" size="sm">
        <Eraser className="size-3.5" />
        Remove Background
      </Button>
    </div>
  )
}
