import { QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState, type ReactNode } from 'react'
import { startSessionSync } from '@/features/conta/session-store'
import { createQueryClient } from '@/lib/query-client'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient)
  useEffect(() => startSessionSync(), [])
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
