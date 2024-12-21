import { useCallback, useRef, useState } from 'react'

export interface MeasureRect {
  width: number
  height: number
  top: number
  left: number
  bottom: number
  right: number
  x: number
  y: number
}

// interface MeasureResult {
//   rect: MeasureRect;
//   entry?: ResizeObserverEntry;
// }

const defaultRect: MeasureRect = {
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
}

export function useMeasure<T extends Element = Element>() {
  const [rect, setRect] = useState<MeasureRect>(defaultRect)
  const ref = useRef<T | null>(null)

  const previousObserver = useRef<ResizeObserver | null>(null)
  const measureRef = useCallback((element: T | null) => {
    if (previousObserver.current) {
      previousObserver.current.disconnect()
      previousObserver.current = null
    }

    if (element?.nodeType === Node.ELEMENT_NODE) {
      previousObserver.current = new ResizeObserver(([entry]) => {
        if (entry && entry.contentRect) {
          setRect(entry.contentRect)
        }
      })
      previousObserver.current.observe(element)
    }

    ref.current = element
  }, [])

  return [measureRef, rect, ref] as const
}
