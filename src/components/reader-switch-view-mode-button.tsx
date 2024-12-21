import { ViewMode, useReaderStore } from '@/services/stores/reader'
import { BookOpen, ScrollText, SplitSquareVertical } from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

const viewModeIcons = {
  vertical: ScrollText,
  single: BookOpen,
  double: SplitSquareVertical,
}

const viewModeLabels: Record<ViewMode, string> = {
  vertical: '垂直滚动',
  single: '单页',
  double: '双页',
}

export const ReaderSwitchViewModeButton: React.FC = () => {
  const viewMode = useReaderStore.use.viewMode()
  const setViewMode = useReaderStore.use.setViewMode()

  const Icon = viewModeIcons[viewMode]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Icon className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(viewModeLabels) as ViewMode[]).map((mode) => {
          const ModeIcon = viewModeIcons[mode]
          return (
            <DropdownMenuItem
              key={mode}
              onClick={() => setViewMode(mode)}
              className="flex items-center gap-2"
            >
              <ModeIcon className="h-4 w-4" />
              <span>{viewModeLabels[mode]}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
