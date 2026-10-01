import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Camera } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { Splash } from '@/components/layout/splash'
import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { IconButton } from '@/components/ui/icon-button'
import { copy } from '@/copy/pt-BR'
import { signOut } from '@/features/conta/api'
import { FormMessage } from '@/features/conta/components/form-message'
import type { MyProfile } from '@/features/perfil/api'
import { ProfileCover } from '@/features/perfil/components/profile-cover'
import { useMyProfile, useSaveMyProfile } from '@/features/perfil/hooks'
import {
  editProfileSchema,
  type EditProfileInput,
  type EditProfileOutput,
} from '@/features/perfil/schemas'
import { useFilePreview } from '@/features/perfil/use-file-preview'
import { cn } from '@/lib/utils'

const t = copy.profile

// Figma: MVP > "Perfil" > "Editar perfil" (cabeçalho com "salvar", campos em linha).
export function EditProfilePage() {
  const { data: profile } = useMyProfile()
  if (!profile) return <Splash />
  return <EditProfileForm profile={profile} />
}

const inlineInput =
  'w-full bg-transparent py-1 text-sm leading-[1.4] text-foreground outline-none placeholder:text-muted-foreground'

function InlineField({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1 pt-3">
      <span className="text-xs">{label}</span>
      {children}
      <Divider className={cn('mt-2', error && 'border-destructive')} />
      {error ? (
        <span role="alert" className="text-sm text-destructive">
          {error}
        </span>
      ) : null}
    </label>
  )
}

function EditProfileForm({ profile }: { profile: MyProfile }) {
  const navigate = useNavigate()
  const save = useSaveMyProfile()
  const form = useForm<EditProfileInput, unknown, EditProfileOutput>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: profile.full_name,
      displayName: profile.display_name ?? '',
      bio: profile.bio ?? '',
      instagram: profile.instagram ?? '',
      photo: undefined,
    },
  })
  const photo = useWatch({ control: form.control, name: 'photo' })
  const preview = useFilePreview(photo)
  const { errors } = form.formState

  function submit(values: EditProfileOutput) {
    save.mutate(
      {
        photo: values.photo,
        patch: {
          full_name: values.fullName,
          display_name: values.displayName || null,
          bio: values.bio || null,
          instagram: values.instagram || null,
        },
      },
      { onSuccess: () => navigate('/perfil', { replace: true }) },
    )
  }

  async function leave() {
    await signOut()
    navigate('/boas-vindas', { replace: true })
  }

  return (
    <form noValidate onSubmit={form.handleSubmit(submit)} className="min-h-dvh bg-background">
      <header className="sticky top-0 z-10 bg-brand pt-[env(safe-area-inset-top)] shadow-[inset_0_-1px_0_0_var(--line)]">
        <div className="mx-auto flex h-[66px] max-w-app items-center gap-2 px-2">
          <IconButton aria-label={copy.actions.back} onClick={() => navigate(-1)}>
            <ArrowLeft strokeWidth={1.5} />
          </IconButton>
          <h1 className="flex-1 text-base leading-[1.4]">{t.editTitle}</h1>
          <Button
            type="submit"
            variant="ghost"
            className="px-4 text-xs font-bold disabled:bg-transparent"
            disabled={save.isPending}
          >
            {copy.actions.save}
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-app pb-[calc(env(safe-area-inset-bottom)+32px)]">
        <ProfileCover
          name={profile.display_name || profile.full_name}
          avatarUrl={preview ?? profile.avatar_url}
        >
          <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/25 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              aria-label={t.fields.photo}
              onChange={(event) => {
                form.setValue('photo', event.target.files?.[0], { shouldValidate: true })
              }}
            />
            <Camera aria-hidden className="size-9 text-foreground" strokeWidth={1.5} />
          </label>
        </ProfileCover>

        <div className="flex flex-col gap-2 px-5 pt-3">
          {errors.photo?.message ? <FormMessage>{errors.photo.message}</FormMessage> : null}
          <InlineField label={t.fields.fullName} error={errors.fullName?.message}>
            <input className={inlineInput} autoComplete="name" {...form.register('fullName')} />
          </InlineField>
          <InlineField label={t.fields.displayName} error={errors.displayName?.message}>
            <input
              className={inlineInput}
              autoComplete="nickname"
              {...form.register('displayName')}
            />
          </InlineField>
          <InlineField label={t.fields.bio} error={errors.bio?.message}>
            <textarea
              rows={4}
              maxLength={500}
              className={cn(inlineInput, 'resize-none')}
              placeholder={t.noBio}
              {...form.register('bio')}
            />
          </InlineField>
          <InlineField label={t.fields.instagram} error={errors.instagram?.message}>
            <input
              className={inlineInput}
              placeholder={t.fields.instagramPlaceholder}
              autoCapitalize="none"
              autoCorrect="off"
              {...form.register('instagram')}
            />
          </InlineField>

          <FormMessage className="mt-4">{save.isError ? copy.errors.network : null}</FormMessage>

          <Button
            variant="ghost"
            className="mt-10 self-start px-0 text-destructive"
            onClick={leave}
          >
            {copy.auth.signOut}
          </Button>
        </div>
      </div>
    </form>
  )
}
