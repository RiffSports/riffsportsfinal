import { copy } from '@/copy/pt-BR'

// Esqueleto de carregamento no lugar de spinner (plano: "esqueletos de carregamento").
export function ProfileSkeleton() {
  return (
    <div role="status" aria-label={copy.actions.loading} className="motion-safe:animate-pulse">
      <div className="relative h-[178px] bg-card">
        <div className="absolute top-px left-5 size-[176px] rounded-full bg-chip" />
      </div>
      <div className="flex flex-col gap-4 px-5 pt-5">
        <div className="h-6 w-40 rounded-md bg-card" />
        <div className="h-4 w-48 rounded-md bg-card" />
        <div className="h-4 w-44 rounded-md bg-card" />
        <div className="h-16 w-full rounded-md bg-card" />
      </div>
    </div>
  )
}
