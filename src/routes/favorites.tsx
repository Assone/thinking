import { booksWithFavoritesQueryOptions } from '@/hooks/use-books-with-favorites'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/favorites')({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(booksWithFavoritesQueryOptions)
  },
})
