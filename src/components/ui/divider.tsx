import { cn } from '@/lib/utils'

// Figma: "Divider" (Background=Dark, Opacity=32%).
export function Divider({ className }: { className?: string }) {
  return <hr className={cn('border-0 border-t border-foreground/32', className)} />
}
