import { EmptyState } from '@/components/layout/empty-state'

// Telas reais entram a partir da Sprint 1. Até lá, cada aba mostra um estado vazio.
export function PlaceholderPage({ title }: { title: string }) {
  return <EmptyState title={title} description="Em construção. Chega nas próximas sprints." />
}
