import { cn } from '@/lib/utils'
import { Annotation } from '@/services/annotation/types'
import { useEffect, useRef } from 'react'

interface AnnotationLayerProps {
  annotations: Annotation[]
  pageNumber: number
  scale: number
  rotation: number
  onAnnotationClick?: (annotation: Annotation) => void
}

const colorMap = {
  yellow: 'bg-yellow-200/50',
  green: 'bg-green-200/50',
  blue: 'bg-blue-200/50',
  red: 'bg-red-200/50',
  purple: 'bg-purple-200/50',
}

export function AnnotationLayer({
  annotations,
  pageNumber,
  scale,
  rotation,
  onAnnotationClick,
}: AnnotationLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // 根据缩放和旋转更新标注位置
    const container = containerRef.current
    container.style.transform = `scale(${scale}) rotate(${rotation}deg)`
  }, [scale, rotation])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ transformOrigin: 'top left' }}
    >
      {annotations
        .filter((annotation) => annotation.position.pageNumber === pageNumber)
        .map((annotation) => (
          <div
            key={annotation.id}
            className="absolute pointer-events-auto"
            onClick={() => onAnnotationClick?.(annotation)}
          >
            {annotation.position.rects.map((rect, index) => {
              const style = {
                left: `${rect.x}px`,
                top: `${rect.y}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
              }

              return (
                <div
                  key={index}
                  style={style}
                  className={cn(
                    'absolute cursor-pointer transition-colors',
                    colorMap[annotation.color],
                    annotation.type === 'highlight' && 'mix-blend-multiply',
                    annotation.type === 'underline' && 'h-0.5 bottom-0',
                    annotation.type === 'rectangle' &&
                      'border-2 bg-transparent',
                    `border-${annotation.color}-500`,
                  )}
                />
              )
            })}
          </div>
        ))}
    </div>
  )
}
