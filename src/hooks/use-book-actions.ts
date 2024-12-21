import { db, type Book } from "@/services/db";
import { parseBookFile } from "@/utils/parser";
import { useMutation } from "@tanstack/react-query";

export const useBookActions = () => {
  const create = useMutation({
    mutationFn: async (file: File) => {
      const book = await parseBookFile(file);
      await db.transaction("rw", db.books, db.bookData, async () => {
        const id = await db.books.add(book);

        await db.bookData.add({
          bookId: id,
          pageHeights: book.pageHeights,
          fileType: book.fileType,
          data: book.fileData,
        });
      });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: number) => {
      await db.transaction("rw", db.books, db.bookData, async () => {
        await db.books.delete(id);
        await db.bookData.where("bookId").equals(id).delete();
      });
    },
  });

  const update = useMutation({
    mutationFn: ({ book, id }: { book: Partial<Book>; id: number }) =>
      db.books.update(id, book),
  });

  return {
    create,
    remove,
    update,
  };
};
