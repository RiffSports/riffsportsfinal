import type { ReactNode } from 'react'
import { Avatar } from '@/components/ui/avatar'

type ProfileCoverProps = { name: string; avatarUrl?: string | null; children?: ReactNode }

// Figma: capa azul com a foto redonda à esquerda (perfil, editar perfil e perfil de terceiro).
export function ProfileCover({ name, avatarUrl, children }: ProfileCoverProps) {
  return (
    <div className="relative h-[178px] bg-profile-cover">
      <div className="absolute top-px left-5">
        <Avatar src={avatarUrl} name={name} showInitials={!children} className="size-[176px]" />
        {children}
      </div>
    </div>
  )
}
