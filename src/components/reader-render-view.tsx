import { useReaderRender } from '@/hooks/use-reader-render'
import { useReaderStore } from '@/services/stores/reader'
import type { Virtualizer } from '@tanstack/react-virtual'
import { lazy, memo, useCallback, useEffect, useRef } from 'react'
import { ReaderRenderViewCanvas } from './reader-render-view-canvas'

const VirtualizerList = lazy(() =>
  import('./virtualizer-list').then((m) => ({ default: m.VirtualizerList })),
)

export const ReaderRenderView: React.FC = memo(() => {
  const currentPage = useReaderStore.use.currentPage()
  const totalPages = useReaderStore.use.totalPages()
  const isLoading = useReaderStore.use.isLoading()
  const error = useReaderStore.use.error()
  const viewMode = useReaderStore.use.viewMode()
  const containerRef = useRef<HTMLDivElement>(null)

  const { render, getPageHeight } = useReaderRender(containerRef)
  const virtualizerListRef = useRef<Virtualizer<HTMLDivElement, Element>>(null)

  useEffect(() => {
    if (virtualizerListRef.current) {
      virtualizerListRef.current.scrollToIndex(currentPage - 1, {
        behavior: 'auto',
        align: 'start',
      })
    }
  }, [currentPage])

  const onMount = useCallback(
    (canvas: HTMLCanvasElement, pageNumber: number) => {
      const context = canvas.getContext('2d')
      if (context) {
        return render(context, pageNumber)
      }

      return Promise.resolve()
    },
    [render],
  )

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-red-500">{error.message}</div>
      </div>
    )
  }

  const renderPages = () => {
    switch (viewMode) {
      case 'single':
        return (
          <ReaderRenderViewCanvas onMount={onMount} currentPage={currentPage} />
        )
      case 'double':
        return (
          <>
            <ReaderRenderViewCanvas
              onMount={onMount}
              currentPage={currentPage}
            />
            <ReaderRenderViewCanvas
              onMount={onMount}
              currentPage={currentPage + 1}
            />
          </>
        )
      case 'vertical':
        return (
          <VirtualizerList
            ref={virtualizerListRef}
            style={{ maxHeight: 'calc(100vh - (var(--spacing) * 4 + 2.8rem))' }}
            count={totalPages}
            estimateSize={getPageHeight}
            getItemKey={(index) => `page-${index + 1}`}
            className="flex-1"
            virtualItemClassName="flex justify-center"
          >
            {(index) => (
              <ReaderRenderViewCanvas
                onMount={onMount}
                currentPage={index + 1}
              />
            )}
          </VirtualizerList>
        )
    }
  }

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center flex-1 overflow-auto"
    >
      {renderPages()}
    </div>
  )
})

ReaderRenderView.displayName = 'ReaderRenderView'
