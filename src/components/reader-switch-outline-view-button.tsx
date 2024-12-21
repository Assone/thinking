import { useReaderStore } from '@/services/stores/reader'
import { TableOfContents } from 'lucide-react'
import { Button } from './ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'

export const ReaderSwitchOutlineViewButton = () => {
  const outline = useReaderStore.use.outline()
  const isShowOutline = useReaderStore.use.isShowOutline()
  const setIsShowOutline = useReaderStore.use.setIsShowOutline()
  const isDisabled = outline.length === 0

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0}>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              disabled={isDisabled}
              onClick={() => setIsShowOutline(!isShowOutline)}
            >
              <TableOfContents className="h-4 w-4" />
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {isDisabled ? 'No outline' : 'Toggle outline view'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
