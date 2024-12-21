import { BookCard } from '@/components/book-card'
import { BookSpinner } from '@/components/book-spinner'
import { PageHeader } from '@/components/page-header'
import { PageLoadSpinner } from '@/components/page-load-spinner'
import { PageTransition } from '@/components/page-transition'
import { useBooksWithFavorites } from '@/hooks/use-books-with-favorites'
import { cn } from '@/lib/utils'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { m } from 'motion/react'
import { Suspense } from 'react'

export const Route = createLazyFileRoute('/favorites')({
  component: RouteComponent,
  pendingComponent: PageLoadSpinner,
  errorComponent: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-[420px] rounded-md border border-dashed p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-lg font-semibold">Error</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Failed to load favorite books
          </p>
        </div>
      </div>
    </div>
  ),
})

function RouteComponent() {
  const { books } = useBooksWithFavorites()

  return (
    <PageTransition>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn('flex flex-col h-screen p-6 relative')}
      >
        <PageHeader
          title="Favorite Books"
          description={`${books.length} ${books.length === 1 ? 'book' : 'books'} in your collection`}
        />

        {books.length === 0 ? (
          <div className="flex-1 flex items-center justify-center w-full h-full">
            <div className="w-full max-w-[420px] rounded-md border border-dashed p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <Heart className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  No favorite books
                </h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  Add some books to your favorites to see them here
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <Suspense fallback={<BookSpinner />}>
              {books.map((book) => (
                <BookCard key={book.id} id={book.id!} />
              ))}
            </Suspense>
          </div>
        )}
      </m.div>
    </PageTransition>
  )
}
