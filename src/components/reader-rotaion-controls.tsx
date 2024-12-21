import { useReaderStore } from '@/services/stores/reader'
import { RotateCcw, RotateCw } from 'lucide-react'
import { m } from 'motion/react'
import { Button } from './ui/button'

export const ReaderRotationControls: React.FC = () => {
  const rotateClockwise = useReaderStore.use.rotateClockwise()
  const rotateCounterClockwise = useReaderStore.use.rotateCounterClockwise()
  const rotation = useReaderStore.use.rotation()

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={rotateCounterClockwise}
        className="relative"
      >
        <m.div
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: rotation }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          className="flex items-center justify-center"
        >
          <RotateCcw className="h-4 w-4" />
        </m.div>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={rotateClockwise}
        className="relative"
      >
        <m.div
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: rotation }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          className="flex items-center justify-center"
        >
          <RotateCw className="h-4 w-4" />
        </m.div>
      </Button>
    </div>
  )
}
