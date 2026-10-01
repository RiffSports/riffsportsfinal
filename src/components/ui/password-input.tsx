import { Eye, EyeOff } from 'lucide-react'
import { useState, type ComponentProps } from 'react'
import { Input } from '@/components/ui/input'
import { copy } from '@/copy/pt-BR'
import { cn } from '@/lib/utils'

// Figma: "07 - Password" (campo com ícone de olho à direita).
export function PasswordInput({ className, ...props }: Omit<ComponentProps<'input'>, 'type'>) {
  const [visible, setVisible] = useState(false)
  const Icon = visible ? Eye : EyeOff
  return (
    <div className="relative">
      <Input type={visible ? 'text' : 'password'} className={cn('pr-12', className)} {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? copy.auth.fields.hidePassword : copy.auth.fields.showPassword}
        aria-pressed={visible}
        className="absolute inset-y-0 right-1 flex w-11 items-center justify-center text-foreground"
      >
        <Icon className="size-5" strokeWidth={1.5} />
      </button>
    </div>
  )
}
