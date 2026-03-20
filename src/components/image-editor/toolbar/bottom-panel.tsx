import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { WifiOff } from 'lucide-react'
import { TabAdjust } from './tab-adjust'
import { TabEffects } from './tab-effects'
import { TabBgRemove } from './tab-bgremove'
import type { Adjustments } from './types'
import { DEFAULT_ADJUSTMENTS } from './types'

type BottomTab = 'adjust' | 'effects' | 'bgremove'

function useOnlineStatus() {
  const [online, setOnline] = useState(() => navigator.onLine)
  useEffect(() => {
    const on  = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online',  on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])
  return online
}

interface Props {
  adjustments: Adjustments
  onAdjustments: (a: Adjustments) => void
}

export function BottomPanel({ adjustments, onAdjustments }: Props) {
  const [activeTab, setActiveTab] = useState<BottomTab>('adjust')
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const online = useOnlineStatus()

  const handleAdjustments = (a: Adjustments) => {
    setActivePreset(null)
    onAdjustments(a)
  }

  return (
    <div className="rounded-2xl border border-border bg-secondary/20 overflow-hidden">
      <div className="flex border-b border-border">
        {(['adjust', 'effects'] as BottomTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-5 py-2.5 text-xs font-medium transition-colors cursor-pointer',
              activeTab === tab
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab === 'adjust' ? 'Adjust' : 'Effects'}
          </button>
        ))}

        {/* BG Remove — separated, disabled when offline */}
        <button
          onClick={() => { if (online) setActiveTab('bgremove') }}
          disabled={!online}
          className={cn(
            'px-5 py-2.5 text-xs font-medium transition-colors flex items-center gap-1.5',
            !online
              ? 'text-muted-foreground/40 cursor-not-allowed'
              : activeTab === 'bgremove'
                ? 'text-primary border-b-2 border-primary bg-primary/5 cursor-pointer'
                : 'text-muted-foreground hover:text-foreground cursor-pointer'
          )}
        >
          {online ? (
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-50" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
            </span>
          ) : (
            <WifiOff className="size-2.5 shrink-0" />
          )}
          BG Remove
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'adjust' && (
          <TabAdjust
            adjustments={adjustments}
            onChange={handleAdjustments}
            onReset={() => { onAdjustments(DEFAULT_ADJUSTMENTS); setActivePreset(null) }}
            grid
          />
        )}
        {activeTab === 'effects' && (
          <TabEffects
            adjustments={adjustments}
            activePreset={activePreset}
            onChange={onAdjustments}
            onPresetSelect={setActivePreset}
            cols={6}
          />
        )}
        {activeTab === 'bgremove' && <TabBgRemove />}
      </div>
    </div>
  )
}
