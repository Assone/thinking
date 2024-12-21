import { db } from '@/services/db'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const bookDataQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['book', 'data', id],
    queryFn: () => db.bookData.where('bookId').equals(id).first(),
  })

export const useBookData = (id: number) => {
  const bookDataQuery = useSuspenseQuery(bookDataQueryOptions(id))

  return {
    bookData: bookDataQuery.data,
    arrayBuffer: bookDataQuery.data?.data,
    fileType: bookDataQuery.data?.fileType,
  }
}
