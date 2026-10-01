import type { Session } from '@supabase/supabase-js'
import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

type SessionState = {
  session: Session | null
  status: 'loading' | 'ready'
  /** Veio de um link de "esqueci a senha": a próxima tela é a de senha nova. */
  recovering: boolean
}

export const useSessionStore = create<SessionState>(() => ({
  session: null,
  status: 'loading',
  recovering: false,
}))

let started = false

/** Liga a sessão do Supabase ao store. Chamado uma vez, no início do app. */
export function startSessionSync() {
  if (started) return
  started = true

  void supabase.auth.getSession().then(({ data }) => {
    useSessionStore.setState({ session: data.session, status: 'ready' })
  })

  supabase.auth.onAuthStateChange((event, session) => {
    useSessionStore.setState((state) => ({
      session,
      status: 'ready',
      recovering: event === 'PASSWORD_RECOVERY' ? true : state.recovering && session !== null,
    }))
  })
}

export function useSession() {
  return useSessionStore((state) => state.session)
}

export function useUserId() {
  return useSessionStore((state) => state.session?.user.id ?? null)
}
