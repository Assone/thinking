import { cn } from '@/lib/utils'
import {
  type AnnotationColor,
  AnnotationType,
} from '@/services/annotation/types'
import {
  ChevronLeft,
  HighlighterIcon,
  type LucideIcon,
  Square,
  Underline,
} from 'lucide-react'
import { AnimatePresence, m, useDragControls } from 'motion/react'
import {
  type PointerEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { AnnotationColorButton } from './annotation-color-button'
import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

interface AnnotationToolbarProps {
  onTypeChange: (type: AnnotationType) => void
  onColorChange: (color: AnnotationColor) => void
  currentType: AnnotationType
  currentColor: AnnotationColor
  className?: string
  containerRef: React.RefObject<HTMLDivElement>
}

const annotationTypes: Array<{
  type: AnnotationType
  icon: LucideIcon
  label: string
}> = [
  {
    type: 'highlight',
    icon: HighlighterIcon,
    label: '高亮',
  },
  {
    type: 'underline',
    icon: Underline,
    label: '下划线',
  },
  {
    type: 'rectangle',
    icon: Square,
    label: '矩形',
  },
]

const annotationColors: Array<{
  color: AnnotationColor
  label: string
  className: string
}> = [
  {
    color: 'yellow',
    label: '黄色',
    className: 'bg-yellow-500',
  },
  {
    color: 'green',
    label: '绿色',
    className: 'bg-green-500',
  },
  {
    color: 'blue',
    label: '蓝色',
    className: 'bg-blue-500',
  },
  {
    color: 'red',
    label: '红色',
    className: 'bg-red-500',
  },
  {
    color: 'purple',
    label: '紫色',
    className: 'bg-purple-500',
  },
]

export const AnnotationToolbar: React.FC<AnnotationToolbarProps> = memo(
  ({
    onTypeChange,
    onColorChange,
    currentType,
    currentColor,
    className,
    containerRef,
  }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const dragControls = useDragControls()
    const toolbarRef = useRef<HTMLDivElement>(null)

    const startDrag = useCallback(
      (event: PointerEvent) => {
        setIsDragging(true)
        dragControls.start(event)
      },
      [dragControls],
    )

    useEffect(() => {
      const handleSelectStart = (e: Event) => {
        if (isDragging) {
          e.preventDefault()
        }
      }

      document.addEventListener('selectstart', handleSelectStart)

      return () => {
        document.removeEventListener('selectstart', handleSelectStart)
      }
    }, [isDragging])

    const toggleCollapse = () => {
      setIsCollapsed(!isCollapsed)
    }

    const constrainPosition = useCallback(
      (point: { x: number; y: number }) => {
        if (!toolbarRef.current || !containerRef.current) return point

        const toolbarRect = toolbarRef.current.getBoundingClientRect()
        const containerRect = containerRef.current.getBoundingClientRect()

        const maxX = containerRect.width - toolbarRect.width
        const maxY = containerRect.height - toolbarRect.height

        return {
          x: Math.max(0, Math.min(point.x, maxX)),
          y: Math.max(0, Math.min(point.y, maxY)),
        }
      },
      [containerRef],
    )

    return (
      <m.div
        ref={toolbarRef}
        drag
        dragControls={dragControls}
        dragMomentum={false}
        dragConstraints={containerRef}
        dragElastic={0}
        dragTransition={{ power: 0 }}
        dragListener={false}
        style={{ x: position.x, y: position.y }}
        onPointerDown={startDrag}
        onDragEnd={(_, info) => {
          setIsDragging(false)
          const newPosition = constrainPosition({
            x: position.x + info.offset.x,
            y: position.y + info.offset.y,
          })
          setPosition(newPosition)
        }}
        className={cn(
          'absolute top-4 right-4 gap-2 border bg-background/80 backdrop-blur-xs cursor-grab active:cursor-grabbing flex items-center p-2 shadow-md rounded-lg z-50 select-none',
          isDragging && 'pointer-events-auto',
          className,
        )}
      >
        <Button variant="ghost" size="icon" onClick={toggleCollapse}>
          <ChevronLeft
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              isCollapsed && 'rotate-180',
            )}
          />
        </Button>

        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <m.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center overflow-hidden"
            >
              <div className="flex items-center space-x-1 border-l border-border pl-2">
                {annotationTypes.map(({ type, icon: Icon, label }) => (
                  <Tooltip key={type}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={currentType === type ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => onTypeChange(type)}
                      >
                        <Icon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>

              <div className="flex items-center space-x-1 border-l border-border pl-2">
                {annotationColors.map(({ color, label, className }) => (
                  <AnnotationColorButton
                    key={color}
                    label={label}
                    className={className}
                    isActive={currentColor === color}
                    onClick={() => onColorChange(color)}
                  />
                ))}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    )
  },
)
