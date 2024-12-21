import Dexie, { Table } from 'dexie'

export interface Book {
  id?: number
  title: string
  author?: string
  cover?: string
  description?: string
  createdAt: Date
  updatedAt: Date
  isFavorite?: boolean
}

export interface BookData {
  id?: number
  bookId: number
  fileType: string
  data: ArrayBuffer
  pageHeights: number[]
}

class ThinkingDB extends Dexie {
  books!: Table<Book>
  bookData!: Table<BookData>

  constructor() {
    super('ThinkingDB')
    this.version(2).stores({
      // 增加版本号以触发数据库升级
      books: '++id, title, author, fileType, createdAt, updatedAt',
      bookData: '++id, &bookId, fileType, data, pageHeights',
    })
  }
}

export const db = new ThinkingDB()
