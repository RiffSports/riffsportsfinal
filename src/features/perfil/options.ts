import { copy } from '@/copy/pt-BR'

// Os valores batem com as CHECKs do banco (migração 20261001000000_account_profile).
export const GENDERS = ['masculino', 'feminino', 'nao_binario', 'prefiro_nao_informar'] as const
export const ACCESSIBILITY = [
  'nenhuma',
  'mobilidade_reduzida',
  'cadeirante',
  'visual',
  'auditiva',
  'intelectual',
  'outra',
] as const

export type Gender = (typeof GENDERS)[number]
export type Accessibility = (typeof ACCESSIBILITY)[number]

export const genderOptions = GENDERS.map((value) => ({
  value,
  label: copy.options.gender[value],
}))

export const accessibilityOptions = ACCESSIBILITY.map((value) => ({
  value,
  label: copy.options.accessibility[value],
}))
