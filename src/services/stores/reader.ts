import { OutlineNode } from '@/models/AbstractRenderEngine'
import { createSelectors } from '@/utils/zustand'
import { create } from 'zustand'
import { combine, devtools } from 'zustand/middleware'
import { Book, BookData } from '../db'

export enum ScaleMode {
  Auto,
  PageWidth,
  PageFit,
  Custom,
}
export type ViewMode = 'single' | 'double' | 'vertical'

interface ReaderState {
  // 基础数据
  book: Book | null
  bookData: BookData | null

  // 状态
  isLoading: boolean
  error: Error | null

  // 阅读设置
  currentPage: number
  totalPages: number
  scale: number
  scaleMode: ScaleMode
  rotation: number
  viewMode: ViewMode

  // 大纲数据
  outline: OutlineNode[]
  isShowOutline: boolean
}

const initialState: ReaderState = {
  book: null,
  bookData: null,
  isLoading: true,
  error: null,
  currentPage: 1,
  totalPages: 1,
  scale: 1.0,
  scaleMode: ScaleMode.Auto,
  rotation: 0,
  viewMode: 'single',
  outline: [],
  isShowOutline: false,
}

const store = create(
  devtools(
    combine(initialState, (set, get) => ({
      // 数据操作
      setBookAndBookData: (book: Book, bookData: BookData) =>
        set({ book, bookData }),

      setTotalPages: (totalPages: number) => set({ totalPages }),

      setOutline: (outline: OutlineNode[]) => set({ outline }),
      setIsShowOutline: (isShowOutline: boolean) => set({ isShowOutline }),

      // 页面控制
      setCurrentPage: (currentPage: number) => {
        const { totalPages } = get()
        const maxPage = totalPages
        if (currentPage >= 1 && currentPage <= maxPage) {
          set({ currentPage })
        }
      },

      nextPage: () => {
        const { currentPage, totalPages } = get()
        const step = 1
        const maxPage = totalPages
        if (currentPage + step <= maxPage) {
          set({ currentPage: currentPage + step })
        }
      },

      previousPage: () => {
        const { currentPage } = get()
        const step = 1
        if (currentPage - step >= 1) {
          set({ currentPage: currentPage - step })
        }
      },

      // 视图控制
      setScale: (scale: number) =>
        set(() => ({
          scale,
          scaleMode: ScaleMode.Custom,
        })),

      setScaleMode: (scaleMode: ScaleMode) => {
        set((state) => {
          let scale = state.scale

          switch (scaleMode) {
            case ScaleMode.Auto:
              scale = 1.0
              break
            case ScaleMode.PageWidth:
            case ScaleMode.PageFit:
              // 这里的适应计算将在 useRender hook 中处理
              scale = state.scale
              break
          }

          return {
            scale,
            scaleMode,
          }
        })
      },

      zoomIn: () => {
        const { scale } = get()
        set({ scale: scale * 1.1, scaleMode: ScaleMode.Custom })
      },

      zoomOut: () => {
        const { scale } = get()
        set({ scale: scale * 0.9, scaleMode: ScaleMode.Custom })
      },

      // 旋转控制
      setRotation: (rotation: number) => set({ rotation }),

      rotateClockwise: () => {
        const { rotation } = get()
        set({ rotation: (rotation + 90) % 360 })
      },

      rotateCounterClockwise: () => {
        const { rotation } = get()
        set({ rotation: (rotation - 90 + 360) % 360 })
      },

      // 阅读模式
      setViewMode: (viewMode: ViewMode) => set({ viewMode }),

      // 状态控制
      setIsLoading: (isLoading: boolean) => set({ isLoading }),
      setError: (error: Error | null) => set({ error }),

      // 清空
      reset: () => set(initialState),
    })),
  ),
)

export const useReaderStore = createSelectors(store)
