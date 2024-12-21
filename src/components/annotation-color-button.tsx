import { cn } from '@/lib/utils'
import { memo } from 'react'
import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

interface AnnotationColorButtonProps {
  className?: string
  label: string
  isActive: boolean
  onClick: () => void
}

export const AnnotationColorButton: React.FC<AnnotationColorButtonProps> = memo(
  ({ className, label, isActive, onClick }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          className={cn(
            'rounded-full p-1 h-6 w-6',
            isActive && 'ring-2 ring-offset-2',
          )}
        >
          <div className={cn('w-full h-full rounded-full', className)} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  ),
)
