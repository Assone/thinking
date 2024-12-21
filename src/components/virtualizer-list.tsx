import { cn } from '@/lib/utils'
import { type Virtualizer, useVirtualizer } from '@tanstack/react-virtual'
import { ReactNode, useImperativeHandle, useRef } from 'react'

interface VirtualizerListProps {
  count: number
  estimateSize: (index: number) => number
  children: (index: number) => ReactNode
  horizontal?: boolean
  overscan?: number
  getItemKey?: (index: number) => string
  className?: string
  style?: React.CSSProperties
  virtualItemClassName?: string
  ref?: React.RefObject<Virtualizer<HTMLDivElement, Element> | null>
}

export const VirtualizerList: React.FC<VirtualizerListProps> = ({
  style,
  count,
  estimateSize,
  children,
  horizontal = false,
  overscan = 2,
  getItemKey,
  className,
  virtualItemClassName,
  ref,
}) => {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize,
    overscan,
    horizontal,
    getItemKey,
  })

  useImperativeHandle(ref, () => virtualizer)

  const items = virtualizer.getVirtualItems()

  return (
    <div
      ref={parentRef}
      style={style}
      className={cn(
        `overflow-auto`,
        { 'whitespace-nowrap': horizontal },
        className,
      )}
    >
      <div
        className={cn('relative w-full')}
        style={{
          height: horizontal ? '100%' : `${virtualizer.getTotalSize()}px`,
          width: horizontal ? `${virtualizer.getTotalSize()}px` : '100%',
          minHeight: horizontal ? undefined : '100%',
        }}
      >
        {items.map((virtualItem) => (
          <div
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={virtualizer.measureElement}
            className={cn(
              `absolute`,
              {
                'left-0 top-0': horizontal,
              },
              virtualItemClassName,
            )}
            style={{
              height: horizontal ? '100%' : `${virtualItem.size}px`,
              width: horizontal ? `${virtualItem.size}px` : '100%',
              transform: `translate${horizontal ? 'X' : 'Y'}(${virtualItem.start}px)`,
            }}
          >
            {children(virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  )
}
