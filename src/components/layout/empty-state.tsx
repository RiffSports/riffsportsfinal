type EmptyStateProps = { title: string; description?: string }

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <section className="flex flex-col items-center gap-2 px-6 py-16 text-center">
      <h1 className="text-lg leading-[1.4] font-bold">{title}</h1>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
    </section>
  )
}
