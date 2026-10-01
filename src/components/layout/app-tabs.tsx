import { NavLink } from 'react-router'
import { copy } from '@/copy/pt-BR'
import { cn } from '@/lib/utils'

const tabs = [
  { to: '/eventos', label: copy.nav.eventos },
  { to: '/jogar', label: copy.nav.jogar },
  { to: '/perfil', label: copy.nav.perfil },
] as const

// Figma: "Mobile/03 - Header Back Nav with Page Title" com abas "Center/02 - Active".
export function AppTabs() {
  return (
    <header className="sticky top-0 z-10 bg-brand/90 pt-[env(safe-area-inset-top)] shadow-[inset_0_-1px_0_0_#eaeaea] backdrop-blur-md">
      <nav
        aria-label="Principal"
        className="mx-auto flex h-[66px] max-w-app items-center gap-[30px] px-4"
      >
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                'relative flex h-[42px] flex-1 items-center justify-center text-base leading-[1.4] font-bold text-foreground',
                isActive &&
                  'after:absolute after:inset-x-[9px] after:bottom-px after:h-1 after:rounded-sm after:bg-primary',
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
