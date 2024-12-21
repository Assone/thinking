import { cn } from '@/lib/utils'
import { useReaderStore } from '@/services/stores/reader'
import { memo, useEffect, useRef, useState } from 'react'

interface ReaderRenderViewCanvasProps {
  currentPage: number
  onMount: (canvas: HTMLCanvasElement, pageNumber: number) => Promise<void>
}

export const ReaderRenderViewCanvas: React.FC<ReaderRenderViewCanvasProps> =
  memo(({ currentPage, onMount }) => {
    const ref = useRef<HTMLCanvasElement>(null)
    const rotation = useReaderStore.use.rotation()
    const scale = useReaderStore.use.scale()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
      const onLoad = async () => {
        if (ref.current) {
          setIsLoading(true)
          await onMount(ref.current, currentPage)
          setIsLoading(false)
        }
      }

      onLoad()
    }, [currentPage, onMount, rotation, scale])

    return (
      <div className="relative justify-center">
        <canvas
          ref={ref}
          className={cn(
            'transition-opacity duration-200',
            isLoading && 'opacity-0',
          )}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
          </div>
        )}
      </div>
    )
  })

ReaderRenderViewCanvas.displayName = 'ReaderRenderViewCanvas'
