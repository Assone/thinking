import { BookCard } from "@/components/book-card";
import { BookSpinner } from "@/components/book-spinner";
import { PageTransition } from "@/components/page-transition";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { db } from "@/services/db";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { m } from "motion/react";
import { Suspense, lazy } from "react";

import { PageHeader } from "@/components/page-header";
import { PageLoadSpinner } from "@/components/page-load-spinner";
import { useBookActions } from "@/hooks/use-book-actions";
import { useDrag } from "@/hooks/use-drag";
import { useToast } from "@/hooks/use-toast";

const BookWithAddSpinner = lazy(() =>
  import("@/components/book-with-add-spinner").then((m) => ({
    default: m.BookWithAddSpinner,
  }))
);
const BookWithDragMask = lazy(() =>
  import("@/components/book-with-drag-mask").then((m) => ({
    default: m.BookWithDragMask,
  }))
);
const BookWithEmptyCard = lazy(() =>
  import("@/components/book-with-empty-card").then((m) => ({
    default: m.BookWithEmptyCard,
  }))
);

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
  pendingComponent: PageLoadSpinner,
  errorComponent: () => (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load books.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  ),
});

function RouteComponent() {
  const { toast } = useToast();
  const { create } = useBookActions();

  const booksQuery = useSuspenseQuery({
    queryKey: ["books"],
    queryFn: () => db.books.orderBy("updatedAt").reverse().toArray(),
  });

  const {
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  } = useDrag({
    onDrag: async (e) => {
      const files = Array.from(e.dataTransfer.files);
      const pdfFiles = files.filter((file) => file.type === "application/pdf");

      if (pdfFiles.length === 0) {
        toast({
          title: "Invalid files",
          description: "Please drop PDF files only",
          variant: "destructive",
        });
        return;
      }

      try {
        await Promise.all(pdfFiles.map((file) => create.mutateAsync(file)));
        booksQuery.refetch();
        toast({
          title: "Success",
          description: "Book added to your library",
        });
      } catch (error) {
        console.error("Error adding books:", error);
        toast({
          title: "Error",
          description: "Failed to add book",
          variant: "destructive",
        });
      }
    },
  });

  const isProcessing = create.isPending;

  return (
    <PageTransition>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn("p-6 w-full min-h-screen relative")}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <PageHeader
          title="Your Library"
          description={`${booksQuery.data.length} ${booksQuery.data.length === 1 ? "book" : "books"} in your collection`}
        />

        {booksQuery.data.length === 0 ? (
          <Suspense>
            <BookWithEmptyCard />
          </Suspense>
        ) : (
          <div
            className={cn(
              "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 relative",
              isDragging && "opacity-50"
            )}
          >
            <Suspense fallback={<BookSpinner />}>
              {booksQuery.data.map((book) => (
                <BookCard key={book.id} id={book.id!} />
              ))}
            </Suspense>
          </div>
        )}

        <Suspense>
          {/* 拖放提示遮罩 */}
          {isDragging && <BookWithDragMask />}

          {/* 处理状态指示器 */}
          {isProcessing && <BookWithAddSpinner />}
        </Suspense>
      </m.div>
    </PageTransition>
  );
}
