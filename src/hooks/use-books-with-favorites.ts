import { db } from '@/services/db'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const booksWithFavoritesQueryOptions = queryOptions({
  queryKey: ['books', 'favorites'],
  queryFn: () =>
    db.books
      .orderBy('updatedAt')
      .filter((book) => book.isFavorite === true)
      .reverse()
      .toArray(),
})

export const useBooksWithFavorites = () => {
  const booksQuery = useSuspenseQuery(booksWithFavoritesQueryOptions)

  return {
    books: booksQuery.data,
  }
}
