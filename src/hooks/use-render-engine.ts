import { AbstractRenderEngine } from '@/models/AbstractRenderEngine'
import { PDFRenderEngine } from '@/models/PDFRenderEngine'
import { useEffect, useRef } from 'react'

export function useRenderEngine() {
  const engine = useRef<AbstractRenderEngine>(null)

  useEffect(() => {
    engine.current = new PDFRenderEngine()

    return () => {
      engine.current?.destroy()
      engine.current = null
    }
  }, [])

  return engine
}
