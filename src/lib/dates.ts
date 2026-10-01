/** Data local de hoje no formato do banco (AAAA-MM-DD). */
export function toIsoDate(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Último dia de nascimento possível para quem tem `years` anos hoje. */
export function latestBirthDateFor(years: number, today = new Date()) {
  return toIsoDate(new Date(today.getFullYear() - years, today.getMonth(), today.getDate()))
}

/** Mesma regra do gatilho do banco: 18 anos completos até hoje. */
export function isAtLeast(years: number, birthDate: string, today = new Date()) {
  return birthDate <= latestBirthDateFor(years, today)
}

/** "Jan/22", como no Figma ("Membro desde Jan/22"). */
export function formatMonthYear(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : value
  const month = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date).replace('.', '')
  const year = String(date.getFullYear()).slice(-2)
  return `${month.charAt(0).toUpperCase()}${month.slice(1)}/${year}`
}
