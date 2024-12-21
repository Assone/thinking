import { Book, db } from "@/services/db";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useBookActions } from "./use-book-actions";

export const bookQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ["book", id],
    queryFn: () => db.books.get(id),
  });

export const useBook = (id: number) => {
  const queryClient = useQueryClient();
  const bookQuery = useSuspenseQuery(bookQueryOptions(id));
  const { update, remove } = useBookActions();

  const onUpdateBook = (data: Partial<Book>) => {
    update.mutate(
      { book: data, id },
      {
        onSuccess: () => {
          bookQuery.refetch();
          queryClient.refetchQueries({
            queryKey: ["books"],
          });
        },
      }
    );
  };

  const onDeleteBook = () => {
    remove.mutate(id, {
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: ["books"],
        });
      },
    });
  };

  return {
    book: bookQuery.data,
    onUpdateBook,
    onDeleteBook,
  };
};
