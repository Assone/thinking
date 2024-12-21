import { useReaderStore } from '@/services/stores/reader'
import { Suspense, lazy, memo } from 'react'
import { ReaderPageControls } from './reader-page-controls'
import { ReaderRotationControls } from './reader-rotaion-controls'
import { ReaderScaleControls } from './reader-scale-controls'
import { ReaderSwitchOutlineViewButton } from './reader-switch-outline-view-button'
import { ReaderSwitchViewModeButton } from './reader-switch-view-mode-button'

const ReaderOutlineView = lazy(() =>
  import('./reader-outline-view').then((m) => ({
    default: m.ReaderOutlineView,
  })),
)

const ReaderRenderView = lazy(() =>
  import('./reader-render-view').then((m) => ({ default: m.ReaderRenderView })),
)

export const Reader: React.FC = memo(() => {
  const book = useReaderStore.use.book()

  return (
    <div className="flex flex-col w-full h-full max-h-screen">
      {/* 顶部工具栏 */}
      <div className="flex items-center p-4 border-b justify-between">
        <div className="flex-1">
          <h1 className="text-xl font-semibold line-clamp-1">{book?.title}</h1>
        </div>
        <div className="flex items-center gap-2 flex-1 shrink-0 justify-end h-4">
          <ReaderPageControls />
          <ReaderScaleControls />
          <ReaderRotationControls />
          <ReaderSwitchOutlineViewButton />
          <ReaderSwitchViewModeButton />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <Suspense>
          <ReaderRenderView />
        </Suspense>
        <Suspense>
          <ReaderOutlineView />
        </Suspense>
      </div>
    </div>
  )
})
