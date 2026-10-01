import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import { Input } from '@/components/ui/input'

const swatches = [
  ['background', 'bg-background'],
  ['brand', 'bg-brand'],
  ['card', 'bg-card'],
  ['chip', 'bg-chip'],
  ['input', 'bg-input'],
  ['primary', 'bg-primary'],
  ['secondary', 'bg-secondary'],
  ['destructive', 'bg-destructive'],
] as const

async function fetchSportsCount() {
  const { supabase } = await import('@/lib/supabase')
  const { count, error } = await supabase.from('sports').select('*', { count: 'exact', head: true })
  if (error) throw error
  return count ?? 0
}

function SupabaseStatus() {
  const { data, error, isPending } = useQuery({
    queryKey: ['dev', 'sports-count'],
    queryFn: fetchSportsCount,
  })
  if (isPending) return <p className="text-sm text-muted-foreground">Conectando ao Supabase...</p>
  if (error) return <p className="text-sm text-destructive">Supabase: {error.message}</p>
  return <p className="text-sm">Supabase conectado: {data} esportes carregados.</p>
}

// Vitrine do design system para conferir os tokens contra o Figma. Não é tela de produto.
export function DesignPage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h1 className="text-lg font-bold">Design system</h1>
        <SupabaseStatus />
      </section>

      <section className="grid grid-cols-4 gap-3">
        {swatches.map(([name, className]) => (
          <div key={name} className="flex flex-col items-center gap-1">
            <div className={`size-14 rounded-lg border border-foreground/10 ${className}`} />
            <span className="text-xs text-muted-foreground">{name}</span>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <Button size="block">Tô dentro</Button>
        <Button size="block" variant="secondary">
          Continuar
        </Button>
        <Button size="block" variant="outline">
          Iniciar sessão
        </Button>
        <Button size="block" variant="destructive">
          Sair do evento
        </Button>
        <Button size="block" disabled>
          Desativado
        </Button>
      </section>

      <section className="flex flex-col gap-4">
        <Input placeholder="Nome:" aria-label="Nome" />
        <Input placeholder="E-mail ou celular:" aria-label="E-mail ou celular" />
      </section>

      <section className="flex gap-2">
        <Chip>1 jogador</Chip>
        <Chip>Time</Chip>
        <Chip selected>Filas Iniciadas</Chip>
      </section>

      <section className="grid grid-cols-2 gap-6">
        <Card>
          <p className="text-xs font-bold">Xadrez</p>
          <p className="text-sm">
            <b>25/08</b> manhã
          </p>
          <p className="text-sm">Praça da Alfândega</p>
          <p className="text-sm font-bold">PROCURANDO</p>
        </Card>
      </section>
    </div>
  )
}
