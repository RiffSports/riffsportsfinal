import { Camera } from 'lucide-react'
import { copy } from '@/copy/pt-BR'
import { useFilePreview } from '@/features/perfil/use-file-preview'
import { cn } from '@/lib/utils'

type AvatarPickerProps = {
  value?: File
  onChange: (file: File | undefined) => void
  error?: string
}

// Figma: "01 - File Uploader" (caixa tracejada "Imagem do perfil").
export function AvatarPicker({ value, onChange, error }: AvatarPickerProps) {
  const preview = useFilePreview(value)
  const t = copy.onboarding.step1
  return (
    <div className="flex flex-col gap-2">
      <label
        className={cn(
          'relative flex h-[126px] w-[142px] cursor-pointer items-center justify-center gap-[15px] overflow-hidden rounded-[10px] border border-dashed border-line bg-chip text-sm font-bold text-line focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring',
          error && 'border-destructive',
        )}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          aria-label={preview ? t.photoChange : t.photoButton}
          onChange={(event) => onChange(event.target.files?.[0])}
        />
        {preview ? (
          <img src={preview} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <>
            <Camera aria-hidden className="size-5" strokeWidth={1.5} />
            <span className="w-[60px] leading-[1.4]">{t.photoButton}</span>
          </>
        )}
      </label>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
