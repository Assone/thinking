import { bookQueryOptions } from '@/hooks/use-book'
import { bookDataQueryOptions } from '@/hooks/use-book-data'
import { createFileRoute, notFound } from '@tanstack/react-router'

export const Route = createFileRoute('/book/$id')({
  loader: async ({ params, context: { queryClient } }) => {
    const id = parseInt(params.id)

    const book = await queryClient.ensureQueryData(bookQueryOptions(id))
    const bookData = await queryClient.ensureQueryData(bookDataQueryOptions(id))

    if (!book || !bookData) {
      throw notFound()
    }

    return {
      book,
      bookData,
    }
  },
})
