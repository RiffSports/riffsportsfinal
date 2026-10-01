import { z } from 'zod'
import { copy } from '@/copy/pt-BR'
import { isAtLeast } from '@/lib/dates'
import { ACCESSIBILITY, GENDERS } from '@/features/perfil/options'

const o = copy.onboarding.validation
const p = copy.profile.validation

const MAX_PHOTO_BYTES = 5 * 1024 * 1024
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const photoSchema = z
  .instanceof(File)
  .refine((file) => PHOTO_TYPES.includes(file.type), o.photoType)
  .refine((file) => file.size <= MAX_PHOTO_BYTES, o.photoTooBig)

const fullName = z
  .string()
  .trim()
  .min(1, copy.auth.validation.nameRequired)
  .max(120)
  .refine((value) => value.split(/\s+/).length >= 2, o.fullNameMin)

const displayName = z.string().trim().max(40, p.displayNameMax)

export const onboardingStep1Schema = z.object({
  photo: photoSchema.optional(),
  fullName,
  birthDate: z
    .string()
    .min(1, o.birthDateRequired)
    .refine(
      (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && value >= '1900-01-01',
      o.birthDateInvalid,
    )
    .refine((value) => isAtLeast(18, value), o.underage),
  displayName,
})

export const onboardingStep2Schema = z.object({
  accessibility: z.enum(ACCESSIBILITY, { error: o.accessibilityRequired }),
  gender: z.enum(GENDERS, { error: o.genderRequired }),
})

export const onboardingSchema = onboardingStep1Schema.extend(onboardingStep2Schema.shape)

export type OnboardingInput = z.infer<typeof onboardingSchema>

export const editProfileSchema = z.object({
  photo: photoSchema.optional(),
  fullName,
  displayName,
  bio: z.string().trim().max(500, p.bioMax),
  instagram: z
    .string()
    .trim()
    .transform((value) =>
      value
        .replace(/^@/, '')
        .replace(/^https?:\/\/(www\.)?instagram\.com\//, '')
        .replace(/\/$/, ''),
    )
    .refine((value) => value === '' || /^[A-Za-z0-9._]{1,30}$/.test(value), p.instagramInvalid),
})

export type EditProfileInput = z.input<typeof editProfileSchema>
export type EditProfileOutput = z.output<typeof editProfileSchema>
