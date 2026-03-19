import { useConvertStore } from "@/store/useConvertStore"
import { useEffect, useState } from "react"
import type { ConvertedFile } from "@/types"
import { formatBytes } from "@/utils/fileUtils"
import { Button } from "../ui/button"
import { RefreshCcw } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

export default function ConvertedFiles() {
    const convertedFiles = useConvertStore(s => s.convertedFiles)
    const failedFiles = useConvertStore(s => s.failedFiles)
    const convertedCount = useConvertStore(s => s.convertedCount)
    const convertingTotal = useConvertStore(s => s.convertingTotal)
    const totalInputSize = useConvertStore(s => s.totalInputSize)
    const totalOutputSize = useConvertStore(s => s.totalOutputSize)
    const currentFileName = useConvertStore(s => s.currentFileName)
    const resetAppState = useConvertStore(s => s.resetConversion);

    const [snapshot, setSnapshot] = useState<ConvertedFile[]>([])

    useEffect(() => {
        const incoming = Object.values(convertedFiles)
        if (incoming.length > 0) setSnapshot(incoming)
        else setSnapshot([])
    }, [convertedFiles])

    const failedEntries = Object.entries(failedFiles)
    const doneCount = convertedCount + failedEntries.length
    const isDone = convertingTotal > 0 && doneCount >= convertingTotal
    const progress = convertingTotal > 0 ? (doneCount / convertingTotal) * 100 : 0
    const savedPercent = totalInputSize > 0 ? Math.round((1 - totalOutputSize / totalInputSize) * 100) : 0

    if (convertingTotal === 0) return null

    const handleDownload = (blob: Blob, name: string) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = name
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <section className="py-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-primary font-body text-base">
                    Converted ({snapshot.length}){failedEntries.length > 0 && <span className="text-destructive ml-2">· {failedEntries.length} failed</span>}
                </h3>
                <Tooltip>
                    <TooltipTrigger>
                        <Button onClick={resetAppState} variant={'secondary'} className={'group p-2.5! h-full!'}>
                            <RefreshCcw className="size-5 group-hover:animate-spin-once" />
                        </Button>
                        <TooltipContent>
                            <p className="text-sm font-light text-accent">Refresh Converting</p>
                        </TooltipContent>
                    </TooltipTrigger>

                </Tooltip>
            </div>
            {snapshot.length > 0 && (
                <ul className="space-y-2.5">
                    {snapshot.map((f) => (
                        <li key={f.name} className="flex items-center justify-between p-4 rounded-2xl border border-accent bg-secondary/30">
                            <span className="text-sm text-accent-foreground font-body">{f.name}</span>
                            <Button variant={'secondary'} onClick={() => handleDownload(f.blob, f.name)} className="text-xs text-primary">
                                Download
                            </Button>
                        </li>
                    ))}
                </ul>
            )}

            <div className="mt-6 p-4 rounded-2xl border border-accent bg-secondary/30 space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-accent-foreground/70 truncate max-w-xs">
                        {isDone ? 'Done' : `Converting ${currentFileName}`}
                    </span>
                    <span className="text-accent-foreground font-medium ml-4 shrink-0">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-accent overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%`, background: 'linear-gradient(to right, #7c3aed, #a855f7)' }}
                    />
                </div>
                <div className="grid grid-cols-3 gap-3 pt-1">
                    <div className="rounded-xl border border-accent bg-background p-3">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Converted</p>
                        <p className="text-2xl font-bold text-foreground">{convertedCount}</p>
                        <p className="text-xs text-muted-foreground">of {convertingTotal} files</p>
                    </div>
                    <div className="rounded-xl border border-accent bg-background p-3">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Saved</p>
                        <p className="text-2xl font-bold text-foreground">{savedPercent > 0 ? `${savedPercent}%` : '—'}</p>
                        <p className="text-xs text-muted-foreground">file size reduction</p>
                    </div>
                    <div className="rounded-xl border border-accent bg-background p-3">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Output</p>
                        <p className="text-2xl font-bold text-foreground">{totalOutputSize > 0 ? formatBytes(totalOutputSize) : '—'}</p>
                        <p className="text-xs text-muted-foreground">from {formatBytes(totalInputSize)}</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
