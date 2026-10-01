import { Outlet } from 'react-router'
import { AppTabs } from '@/components/layout/app-tabs'

export function AppShell() {
  return (
    <div className="min-h-dvh bg-background">
      <AppTabs />
      <main className="mx-auto w-full max-w-app pb-[calc(env(safe-area-inset-bottom)+24px)]">
        <Outlet />
      </main>
    </div>
  )
}
