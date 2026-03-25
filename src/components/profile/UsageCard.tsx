import { TRIAL_LIMITS } from '@/lib/useConversionCount'
import type { ConversionCounts } from '@/lib/useConversionCount'
import type { Plan } from '@/lib/useAuth'
import { cn } from '@/lib/utils'

function UsageBar({ used, limit }: { used: number; limit: number }) {
    const pct = Math.min((used / limit) * 100, 100)
    const isNear = pct >= 80
    const isFull = pct >= 100
    return (
        <div className="w-full h-1.5 rounded-full bg-accent overflow-hidden">
            <div
                className={cn('h-full rounded-full transition-all', isFull ? 'bg-destructive' : isNear ? 'bg-yellow-500' : 'bg-primary')}
                style={{ width: `${pct}%` }}
            />
        </div>
    )
}

interface UsageCardProps {
    plan: Plan
    counts: ConversionCounts
}

export function UsageCard({ plan, counts }: UsageCardProps) {
    const isTrial = plan === 'trial'

    return (
        <div className="rounded-2xl border border-border p-5 space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Usage</p>
            {isTrial ? (
                <div className="space-y-3">
                    {([
                        { label: 'Images', used: counts.image, limit: TRIAL_LIMITS.image },
                        { label: 'Documents', used: counts.document, limit: TRIAL_LIMITS.document },
                        { label: 'Videos', used: counts.video, limit: TRIAL_LIMITS.video },
                    ] as const).map(({ label, used, limit }) => (
                        <div key={label} className="space-y-1">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">{label}</p>
                                <p className="text-xs text-foreground">{used} / {limit}</p>
                            </div>
                            <UsageBar used={used} limit={limit} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-1">
                    <p className="text-sm text-foreground font-medium">Unlimited</p>
                    <p className="text-xs text-muted-foreground">
                        Images: {counts.image} &middot; Documents: {counts.document} &middot; Videos: {counts.video}
                    </p>
                </div>
            )}
        </div>
    )
}
