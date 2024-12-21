import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { LazyMotion } from 'motion/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { SidebarProvider } from './components/ui/sidebar.tsx'
import { routeTree } from './routeTree.gen.ts'
import { queryClient } from './services/query-client.ts'

import '@/assets/styles/main.css'

const loadMotionFeatures = () =>
  import('@/services/motion.ts').then((m) => m.default)

const router = createRouter({
  routeTree,
  defaultPreloadStaleTime: 0,
  context: {
    queryClient,
  },
  Wrap: ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <LazyMotion features={loadMotionFeatures} strict>
        <SidebarProvider>{children}</SidebarProvider>
      </LazyMotion>
    </QueryClientProvider>
  ),
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

if (import.meta.env.DEV) {
  import('react-scan').then(({ scan }) =>
    scan({
      enabled: true,
      log: true,
    }),
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
