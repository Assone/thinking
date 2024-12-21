import { ScaleMode, useReaderStore } from '@/services/stores/reader'
import { debounce } from '@/utils/fn'
import { useCallback, useEffect, useMemo } from 'react'
import { useRenderEngine } from './use-render-engine'

export function useReaderRender(
  containerRef: React.RefObject<HTMLElement | null>,
) {
  const engine = useRenderEngine()
  const {
    currentPage,
    scale,
    rotation,
    isLoading,
    scaleMode,
    bookData,
    setScale,
    setIsLoading,
    setError,
    setTotalPages,
    setOutline,
    viewMode,
  } = useReaderStore()
  const arrayBuffer = useMemo(() => bookData?.data, [bookData?.data])
  const isDoublePage = useMemo(() => viewMode === 'double', [viewMode])

  const render = useCallback(
    async (context: CanvasRenderingContext2D, pageNumber: number) => {
      if (!engine.current) return

      try {
        setError(null)

        engine.current.renderPage(context, pageNumber)
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error('Failed to render page')
        setError(err)
        console.error('Failed to render page:', err)
      }
    },
    [engine, setError],
  )

  const calculateScale = useCallback(async () => {
    if (!engine.current) return

    try {
      const pageInfo = await engine.current.getPageInfo(currentPage)
      const container = containerRef.current!
      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight
      const margin = 48

      const totalWidth = isDoublePage ? pageInfo.width * 2 + 4 : pageInfo.width

      let newScale = scale
      switch (scaleMode) {
        case ScaleMode.Auto: {
          const scaleWidth = (containerWidth - margin) / totalWidth
          const scaleHeight = (containerHeight - margin) / pageInfo.height
          newScale = Math.min(scaleWidth, scaleHeight)
          break
        }
        case ScaleMode.PageWidth:
          newScale = (containerWidth - margin) / totalWidth
          break
        case ScaleMode.PageFit:
          newScale = (containerWidth - margin) / pageInfo.width
          break
      }

      if (newScale !== scale) {
        setScale(newScale)
      }
    } catch (error) {
      console.error('Error calculating scale:', error)
    }
  }, [
    containerRef,
    currentPage,
    engine,
    isDoublePage,
    scale,
    scaleMode,
    setScale,
  ])

  useEffect(() => {
    const calculate = async () => {
      if (!containerRef.current || !engine.current) return

      const container = containerRef.current
      const { width: containerWidth, height: containerHeight } =
        container.getBoundingClientRect()

      if (scaleMode === ScaleMode.PageWidth) {
        const firstPage = await engine.current.getPageInfo(currentPage)

        const newScale = (containerWidth - 32) / firstPage.width // 减去内边距
        setScale(newScale)
      } else if (scaleMode === ScaleMode.PageFit) {
        const { width, height } = await engine.current.getPageInfo(currentPage)

        const widthScale = (containerWidth - 32) / width
        const heightScale = (containerHeight - 32) / height
        setScale(Math.min(widthScale, heightScale))
      }
    }

    calculate()
  }, [containerRef, currentPage, engine, scaleMode, setScale])

  const getPageHeight = useCallback(
    (index: number) => {
      return (bookData?.pageHeights[index] || 800) * scale
    },
    [bookData?.pageHeights, scale],
  )

  const loadPDF = useCallback(async () => {
    if (!engine.current || !arrayBuffer) return

    try {
      setIsLoading(true)
      setError(null)

      const clonedData = arrayBuffer.slice(0)
      await engine.current.initialize(clonedData)

      const totalPages = await engine.current.getPageCount()
      const outline = await engine.current.getOutline()

      setTotalPages(totalPages)
      setOutline(outline)
      setError(null)
    } catch (error) {
      console.error('Failed to load PDF:', error)
      const err =
        error instanceof Error ? error : new Error('Failed to load PDF')
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [arrayBuffer, engine, setError, setIsLoading, setOutline, setTotalPages])

  useEffect(() => {
    const handleResize = () => {
      if (!isLoading) {
        debounce(calculateScale, 100)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [calculateScale, isLoading])

  useEffect(() => {
    engine.current?.setRotation(rotation)
    engine.current?.setScale(scale)
  }, [engine, rotation, scale])

  useEffect(() => {
    loadPDF()
  }, [loadPDF])

  return {
    render,
    getPageHeight,
  }
}
