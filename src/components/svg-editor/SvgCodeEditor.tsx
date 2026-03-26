import { useEffect, useRef, useCallback } from 'react'
import { EditorView, ViewUpdate, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { xml } from '@codemirror/lang-xml'
import { defaultKeymap, historyKeymap, history } from '@codemirror/commands'

// ── Theme ─────────────────────────────────────────────────────────────────────

const editorTheme = EditorView.theme({
    '&': {
        height: '100%',
        fontSize: '12px',
        fontFamily: 'var(--font-mono, monospace)',
        backgroundColor: 'transparent',
    },
    '.cm-scroller': {
        overflow: 'auto',
        fontFamily: 'inherit',
    },
    '.cm-content': {
        padding: '10px 0',
        caretColor: 'var(--foreground)',
    },
    '.cm-line': {
        padding: '0 12px',
        lineHeight: '1.6',
        color: 'var(--foreground)',
    },
    '.cm-activeLine': {
        backgroundColor: 'oklch(1 0 0 / 4%)',
    },
    '.cm-cursor': {
        borderLeftColor: 'var(--foreground)',
    },
    '.cm-selectionBackground, ::selection': {
        backgroundColor: 'oklch(0.78 0.14 300 / 25%) !important',
    },
    '.cm-gutters': {
        backgroundColor: 'transparent',
        border: 'none',
        color: 'var(--muted-foreground)',
        paddingRight: '4px',
    },
    '.cm-gutterElement': {
        padding: '0 8px',
        fontSize: '11px',
    },
    // XML syntax colors
    '.cm-tag': { color: 'oklch(0.78 0.14 300)' },
    '.cm-attribute': { color: 'oklch(0.72 0.10 220)' },
    '.cm-string': { color: 'oklch(0.75 0.15 160)' },
    '.cm-punctuation': { color: 'var(--muted-foreground)' },
    '.cm-comment': { color: 'var(--muted-foreground)', fontStyle: 'italic' },
}, { dark: true })

// ── Hover extension ───────────────────────────────────────────────────────────

function hoverExtension(onHoverLine: (line: number | null) => void) {
    return EditorView.domEventHandlers({
        mousemove(event, view) {
            const pos = view.posAtCoords({ x: event.clientX, y: event.clientY })
            if (pos == null) { onHoverLine(null); return }
            const line = view.state.doc.lineAt(pos)
            onHoverLine(line.number - 1) // convert to 0-based
        },
        mouseleave() {
            onHoverLine(null)
        },
    })
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
    value: string
    onChange: (value: string) => void
    onHoverLine?: (line: number | null) => void
    readOnly?: boolean
}

export function SvgCodeEditor({ value, onChange, onHoverLine, readOnly = false }: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    const viewRef = useRef<EditorView | null>(null)
    // Use refs for callbacks so the editor never needs to be recreated
    const onChangeRef = useRef(onChange)
    const onHoverLineRef = useRef(onHoverLine)
    // Flag to suppress onChange during programmatic updates
    const isProgrammatic = useRef(false)

    onChangeRef.current = onChange
    onHoverLineRef.current = onHoverLine

    const stableHover = useCallback((line: number | null) => {
        onHoverLineRef.current?.(line)
    }, [])

    // Create editor once on mount
    useEffect(() => {
        if (!containerRef.current) return

        const state = EditorState.create({
            doc: value,
            extensions: [
                history(),
                keymap.of([...defaultKeymap, ...historyKeymap]),
                lineNumbers(),
                highlightActiveLine(),
                xml(),
                editorTheme,
                hoverExtension(stableHover),
                EditorView.updateListener.of((update: ViewUpdate) => {
                    if (update.docChanged && !isProgrammatic.current) {
                        onChangeRef.current(update.state.doc.toString())
                    }
                }),
                EditorView.lineWrapping,
                ...(readOnly ? [EditorState.readOnly.of(true)] : []),
            ],
        })

        const view = new EditorView({ state, parent: containerRef.current })
        viewRef.current = view

        return () => {
            view.destroy()
            viewRef.current = null
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Sync external value changes into the editor without destroying it
    useEffect(() => {
        const view = viewRef.current
        if (!view) return
        const current = view.state.doc.toString()
        if (current === value) return
        isProgrammatic.current = true
        view.dispatch({
            changes: { from: 0, to: current.length, insert: value },
        })
        isProgrammatic.current = false
    }, [value])

    return (
        <div
            ref={containerRef}
            className="flex-1 min-h-0 rounded-xl border border-border bg-muted/30 overflow-hidden"
        />
    )
}
