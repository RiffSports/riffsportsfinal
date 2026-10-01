import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router'
import type { z } from 'zod'
import { AuthLayout } from '@/components/layout/auth-layout'
import { Splash } from '@/components/layout/splash'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RadioGroup } from '@/components/ui/radio-group'
import { Select } from '@/components/ui/select'
import { copy } from '@/copy/pt-BR'
import { signOut } from '@/features/conta/api'
import { FormMessage } from '@/features/conta/components/form-message'
import { AvatarPicker } from '@/features/perfil/components/avatar-picker'
import { useMyProfile, useSaveMyProfile } from '@/features/perfil/hooks'
import { accessibilityOptions, genderOptions } from '@/features/perfil/options'
import {
  onboardingSchema,
  onboardingStep1Schema,
  onboardingStep2Schema,
  type OnboardingInput,
} from '@/features/perfil/schemas'
import { latestBirthDateFor } from '@/lib/dates'

const t = copy.onboarding
const TOTAL_STEPS = 2 // Passos 3 a 5 do Figma (documento, Instagram, selfie) entram na Sprint 9.

type FormValues = z.input<typeof onboardingSchema>

// Figma: MVP > "Log In e cadastro" > "cadastro 8" e "cadastro 9".
export function OnboardingPage() {
  const profileQuery = useMyProfile()
  if (profileQuery.isPending) return <Splash />
  if (profileQuery.data?.onboarded_at) return <Navigate to="/perfil" replace />
  return <OnboardingForm defaultFullName={profileQuery.data?.full_name ?? ''} />
}

function OnboardingForm({ defaultFullName }: { defaultFullName: string }) {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)
  const save = useSaveMyProfile()
  const form = useForm<FormValues, unknown, OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: defaultFullName === 'Jogador' ? '' : defaultFullName,
      birthDate: '',
      displayName: '',
      accessibility: undefined,
      gender: undefined,
      photo: undefined,
    },
  })
  const values = useWatch({ control: form.control })
  const stepValid = (step === 1 ? onboardingStep1Schema : onboardingStep2Schema).safeParse(
    values,
  ).success
  const { errors } = form.formState

  async function next() {
    const ok = await form.trigger(['photo', 'fullName', 'birthDate', 'displayName'])
    if (ok) setStep(2)
  }

  function finish(input: OnboardingInput) {
    save.mutate(
      {
        photo: input.photo,
        patch: {
          full_name: input.fullName,
          display_name: input.displayName || null,
          birth_date: input.birthDate,
          accessibility_needs: input.accessibility,
          gender: input.gender,
          onboarded_at: new Date().toISOString(),
        },
      },
      { onSuccess: () => navigate('/perfil', { replace: true }) },
    )
  }

  async function leave() {
    await signOut()
    navigate('/boas-vindas', { replace: true })
  }

  const subtitle = (
    <div className="flex flex-col gap-3">
      <p>{t.stepOf(step, TOTAL_STEPS)}</p>
      <p className="text-xs">{t.privacyNote}</p>
    </div>
  )

  return (
    <AuthLayout
      back={step === 1 ? leave : () => setStep(1)}
      title={step === 1 ? t.step1.title : t.step2.title}
      subtitle={subtitle}
    >
      <form noValidate onSubmit={form.handleSubmit(finish)} className="flex flex-1 flex-col">
        {step === 1 ? (
          <div className="flex flex-col gap-[30px]">
            <div className="flex flex-col gap-4">
              <p className="text-base leading-[1.4]">{t.step1.photo}</p>
              <Controller
                control={form.control}
                name="photo"
                render={({ field, fieldState }) => (
                  <AvatarPicker
                    value={field.value}
                    onChange={(file) => {
                      field.onChange(file)
                      void form.trigger('photo')
                    }}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>
            <Field label={t.step1.fullName} error={errors.fullName?.message}>
              <Input
                placeholder={t.step1.fullNamePlaceholder}
                autoComplete="name"
                {...form.register('fullName')}
              />
            </Field>
            <Field label={t.step1.birthDate} error={errors.birthDate?.message}>
              <Input
                type="date"
                max={latestBirthDateFor(0)}
                placeholder={t.step1.birthDatePlaceholder}
                autoComplete="bday"
                className="[color-scheme:dark]"
                {...form.register('birthDate')}
              />
            </Field>
            <Field label={t.step1.displayName} error={errors.displayName?.message}>
              <Input
                placeholder={t.step1.displayNamePlaceholder}
                autoComplete="nickname"
                {...form.register('displayName')}
              />
            </Field>
          </div>
        ) : (
          <div className="flex flex-col gap-[38px]">
            <Field label={t.step2.accessibility} error={errors.accessibility?.message}>
              <Select defaultValue="" {...form.register('accessibility')}>
                <option value="" disabled>
                  {t.step2.accessibilityPlaceholder}
                </option>
                {accessibilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <RadioGroup
              legend={t.step2.gender}
              options={genderOptions}
              error={errors.gender?.message}
              {...form.register('gender')}
            />
          </div>
        )}

        <FormMessage className="mt-6">{save.isError ? copy.errors.network : null}</FormMessage>

        <div className="mt-auto flex justify-end pt-10">
          {step === 1 ? (
            <Button className="-mr-[13px] px-[14px]" disabled={!stepValid} onClick={next}>
              {copy.actions.continue}
            </Button>
          ) : (
            <Button
              type="submit"
              className="-mr-[13px] px-[14px]"
              disabled={!stepValid || save.isPending}
            >
              {t.step2.finish}
            </Button>
          )}
        </div>
      </form>
    </AuthLayout>
  )
}
