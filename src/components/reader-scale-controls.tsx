import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScaleMode, useReaderStore } from '@/services/stores/reader'
import { Maximize2, Minus, MonitorUp, MoveHorizontal, Plus } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import React from 'react'
import { Button } from './ui/button'

const SCALE_MODE_OPTIONS = [
  { mode: ScaleMode.Auto, icon: MonitorUp, label: 'Auto' },
  { mode: ScaleMode.PageWidth, icon: MoveHorizontal, label: 'Zoom to width' },
  { mode: ScaleMode.PageFit, icon: Maximize2, label: 'Zoom to fit' },
] as const

export const ReaderScaleControls: React.FC = () => {
  const scale = useReaderStore.use.scale()
  const scaleMode = useReaderStore.use.scaleMode()
  const zoomIn = useReaderStore.use.zoomIn()
  const zoomOut = useReaderStore.use.zoomOut()
  const setScaleMode = useReaderStore.use.setScaleMode()

  const displayScale = Math.round(scale * 100)
  const currentOption = SCALE_MODE_OPTIONS.find((opt) => opt.mode === scaleMode)

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={zoomOut}
        className="relative group"
      >
        <m.div
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className="flex items-center justify-center"
        >
          <Minus className="h-4 w-4" />
        </m.div>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="min-w-[4rem] relative group">
            <AnimatePresence mode="wait">
              <m.div
                key={`${scaleMode}-${displayScale}`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className="flex items-center gap-1"
              >
                {currentOption && (
                  <m.div
                    whileHover={{ rotate: 10 }}
                    className="text-muted-foreground"
                  >
                    <m.div className="h-4 w-4">
                      <currentOption.icon />
                    </m.div>
                  </m.div>
                )}
                <AnimatePresence mode="wait">
                  <m.span
                    key={`${scaleMode}-${displayScale}`}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    className="inline-block"
                  >
                    {scaleMode === ScaleMode.Custom
                      ? `${displayScale}%`
                      : currentOption?.label}
                  </m.span>
                </AnimatePresence>
              </m.div>
            </AnimatePresence>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {SCALE_MODE_OPTIONS.map(({ mode, icon: Icon, label }) => (
            <DropdownMenuItem
              key={mode}
              onClick={() => setScaleMode(mode)}
              className="flex items-center gap-2 group"
            >
              <m.div
                whileHover={{ rotate: 10 }}
                className="text-muted-foreground group-hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
              </m.div>
              <span>{label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon"
        onClick={zoomIn}
        className="relative group"
      >
        <m.div
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className="flex items-center justify-center"
        >
          <Plus className="h-4 w-4" />
        </m.div>
      </Button>
    </div>
  )
}
