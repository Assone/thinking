import { Toaster } from '@/components/ui/toaster'
import { QueryClient } from '@tanstack/react-query'
import {
  ScrollRestoration,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { lazy } from 'react'
import App from '../App'

const QueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-query-devtools').then((m) => ({
        default: m.ReactQueryDevtools,
      })),
    )
  : () => null

const RouterDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/router-devtools').then((m) => ({
        default: m.TanStackRouterDevtools,
      })),
    )
  : () => null

const Root = () => {
  return (
    <>
      <App />
      <Toaster />
      <ScrollRestoration />
      <RouterDevtools position="bottom-right" />
      <QueryDevtools />
    </>
  )
}

export interface RouteContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouteContext>()({
  component: Root,
})
