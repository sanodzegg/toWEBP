import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'
import { getLocalCounts } from '@/lib/useConversionCount'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AccountCard } from '@/components/profile/AccountCard'
import { UsageCard } from '@/components/profile/UsageCard'

type Mode = 'login' | 'signup'

export default function Auth() {
    const { user, plan, loading } = useAuth()
    const [mode, setMode] = useState<Mode>('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setMessage(null)
        setSubmitting(true)

        if (mode === 'login') {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) setError(error.message)
        } else {
            const { error } = await supabase.auth.signUp({ email, password })
            if (error) setError(error.message)
            else setMessage('Check your email to confirm your account.')
        }

        setSubmitting(false)
    }

    if (loading) return null

    if (user) {
        const counts = getLocalCounts()

        return (
            <section className="section py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-body font-semibold text-foreground">Account</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage your account and usage.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <AccountCard user={user} plan={plan} />
                    <UsageCard plan={plan} counts={counts} />
                </div>
            </section>
        )
    }

    return (
        <div className="max-w-sm mx-auto mt-24 px-6">
            <h2 className="font-body text-2xl font-semibold text-primary mb-1">
                {mode === 'login' ? 'Sign in' : 'Create account'}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
                {mode === 'login' ? 'Welcome back.' : 'Start using Cone with an account.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        autoFocus
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}
                {message && <p className="text-sm text-primary">{message}</p>}

                <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
                </Button>
            </form>

            <p className="text-sm text-muted-foreground mt-4 text-center">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                    className="text-primary underline underline-offset-2"
                    onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); setMessage(null) }}
                >
                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
            </p>
        </div>
    )
}
