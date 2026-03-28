import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme/theme-provider'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant={'outline'}
      size="icon"
      className="2xl:size-10"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Sun className="size-4 2xl:size-5" /> : <Moon className="size-4 2xl:size-5" />}
    </Button>
  )
}
