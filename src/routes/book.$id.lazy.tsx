import { PageTransition } from '@/components/page-transition'
import { Reader } from '@/components/reader'
import { useBook } from '@/hooks/use-book'
import { useBookData } from '@/hooks/use-book-data'
import { useReaderStore } from '@/services/stores/reader'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createLazyFileRoute('/book/$id')({
  component: BookPage,
  pendingComponent: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex justify-center items-center flex-col h-full">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg">Book not found</p>
    </div>
  ),
})

function BookPage() {
  const { id } = Route.useParams()
  const bookId = parseInt(id)

  const { book } = useBook(bookId)
  const { bookData } = useBookData(bookId)
  const setBookAndBookData = useReaderStore.use.setBookAndBookData()
  const reset = useReaderStore.use.reset()

  useEffect(() => {
    setBookAndBookData(book!, bookData!)

    return () => {
      reset()
    }
  }, [book, bookData, reset, setBookAndBookData])

  return (
    <PageTransition>
      <Reader />
    </PageTransition>
  )
}
