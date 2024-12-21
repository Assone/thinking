import { useReaderStore } from '@/services/stores/reader'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'

export const ReaderPageControls: React.FC = () => {
  const currentPage = useReaderStore.use.currentPage()
  const totalPages = useReaderStore.use.totalPages()
  const setCurrentPage = useReaderStore.use.setCurrentPage()
  const viewMode = useReaderStore.use.viewMode()
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(currentPage.toString())

  // 同步当前页码到输入值
  useEffect(() => {
    setInputValue(currentPage.toString())
  }, [currentPage])

  const isVertical = viewMode === 'vertical'
  const isDouble = viewMode === 'double'

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(isDouble ? Math.floor((newPage - 1) / 2) * 2 + 1 : newPage)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      setInputValue(value)
    }
  }

  const handleInputBlur = () => {
    const newPage = parseInt(inputValue)
    if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
      handlePageChange(newPage)
    } else {
      setInputValue(currentPage.toString())
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    } else if (e.key === 'Escape') {
      setInputValue(currentPage.toString())
      setIsEditing(false)
    }
  }

  const handlePrevPage = () => {
    if (isDouble) {
      handlePageChange(currentPage - 2)
    } else {
      handlePageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (isDouble) {
      handlePageChange(currentPage + 2)
    } else {
      handlePageChange(currentPage + 1)
    }
  }

  if (isVertical) {
    return null
  }

  const displayCurrentPage = isDouble
    ? `${currentPage} - ${Math.min(currentPage + 1, totalPages)}`
    : currentPage.toString()

  return (
    <div className="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0}>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="relative group"
              >
                <m.div
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center justify-center"
                >
                  <ChevronLeft className="h-4 w-4" />
                </m.div>
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            {currentPage <= 1 ? 'No previous page' : 'Previous page'}
          </TooltipContent>
        </Tooltip>

        <div className="flex items-center gap-1 min-w-[6rem] justify-center">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <m.div
                key="input"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-12"
              >
                <Input
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  onKeyDown={handleKeyDown}
                  className="h-8 w-full text-center px-1"
                  autoFocus
                />
              </m.div>
            ) : (
              <m.button
                key="display"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setIsEditing(true)}
                className="text-sm px-2 relative"
              >
                <div className="flex items-center gap-1">
                  <AnimatePresence mode="wait">
                    <m.div
                      key={displayCurrentPage}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <span>{displayCurrentPage}</span>
                    </m.div>
                  </AnimatePresence>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-muted-foreground">{totalPages}</span>
                </div>
              </m.button>
            )}
          </AnimatePresence>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0}>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="relative group"
              >
                <m.div
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center justify-center"
                >
                  <ChevronRight className="h-4 w-4" />
                </m.div>
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            {currentPage >= totalPages ? 'No more pages' : 'Next page'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
