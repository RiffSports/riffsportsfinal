import { z } from 'zod'
import { copy } from '@/copy/pt-BR'

const v = copy.auth.validation

const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: v.emailInvalid }))

// Igual à regra do Supabase Auth (mínimo 8, letras e números).
const newPassword = z
  .string()
  .min(8, v.passwordMin)
  .refine((value) => /[A-Za-z]/.test(value) && /\d/.test(value), v.passwordLettersDigits)

export const signUpSchema = z
  .object({
    fullName: z.string().trim().min(1, v.nameRequired).max(120),
    email,
    password: newPassword,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: v.passwordMismatch,
  })

export const signInSchema = z.object({
  email,
  password: z.string().min(1, v.passwordRequired),
})

export const forgotPasswordSchema = z.object({ email })

export const resetPasswordSchema = z
  .object({ password: newPassword, confirmPassword: z.string() })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: v.passwordMismatch,
  })

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
