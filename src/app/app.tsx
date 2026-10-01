import { useState } from 'react'
import { RouterProvider } from 'react-router'
import { Providers } from '@/app/providers'
import { createRouter } from '@/app/router'

export function App() {
  const [router] = useState(createRouter)
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
}
