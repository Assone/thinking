import { useBook } from '@/hooks/use-book'
import { Link } from '@tanstack/react-router'
import { Star, StarOff, Trash2 } from 'lucide-react'
import { Card } from './ui/card'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from './ui/context-menu'

interface BookCardProps {
  id: number
}

export const BookCard: React.FC<BookCardProps> = ({ id }) => {
  const { book, onDeleteBook, onUpdateBook } = useBook(id)

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex flex-col gap-1">
          <Link to="/book/$id" params={{ id: String(id) }}>
            <Card className="overflow-hidden aspect-2/3">
              <img
                className="w-full h-full object-cover cursor-pointer"
                src={book!.cover}
                alt={book!.title}
              />
            </Card>
            <div className="flex justify-center items-center">
              <span className="text-sm truncate">{book!.title}</span>
            </div>
          </Link>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => onUpdateBook({ isFavorite: !book?.isFavorite })}
        >
          {book?.isFavorite ? (
            <StarOff className="w-4 h-4 mr-2" />
          ) : (
            <Star className="w-4 h-4 mr-2" />
          )}

          <span>{book?.isFavorite ? 'Unfavorite' : 'Favorite'}</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onDeleteBook()}>
          <Trash2 className="w-4 h-4 mr-2" />
          <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
