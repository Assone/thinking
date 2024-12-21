import { cn } from '@/lib/utils'
import { OutlineNode } from '@/models/AbstractRenderEngine'
import { useReaderStore } from '@/services/stores/reader'
import { m } from 'motion/react'
import { lazy, memo, useMemo, useState } from 'react'
import { ReaderOutlineItem } from './reader-outline-item'

const VirtualizerList = lazy(() =>
  import('./virtualizer-list').then((m) => ({ default: m.VirtualizerList })),
)

export const ReaderOutlineView: React.FC = memo(() => {
  const setCurrentPage = useReaderStore.use.setCurrentPage()
  const outline = useReaderStore.use.outline()
  const onOutlineChange = useReaderStore.use.setOutline()
  const isShowOutline = useReaderStore.use.isShowOutline()
  const [selectedNode, setSelectedNode] = useState<OutlineNode | null>(null)

  // 将大纲树展平为列表
  const flattenedOutline = useMemo(() => {
    const result: OutlineNode[] = []
    const flatten = (nodes: OutlineNode[]) => {
      for (const node of nodes) {
        result.push(node)
        if (node.expanded && node.children.length > 0) {
          flatten(node.children)
        }
      }
    }
    flatten(outline)
    return result
  }, [outline])

  const handleToggle = (targetNode: OutlineNode) => {
    const toggleNode = (nodes: OutlineNode[]): OutlineNode[] => {
      return nodes.map((node) => {
        if (node === targetNode) {
          return { ...node, expanded: !node.expanded }
        }
        if (node.children.length > 0) {
          return { ...node, children: toggleNode(node.children) }
        }
        return node
      })
    }

    onOutlineChange(toggleNode(outline))
  }

  const handleSelect = (node: OutlineNode) => {
    setSelectedNode(node)
    setCurrentPage(node.pageNumber)
  }

  const render = () => {
    if (outline.length === 0)
      return (
        <div className="flex h-full w-64 items-center justify-center border-r border-neutral-200 bg-white text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
          No outline available
        </div>
      )

    return (
      <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {isShowOutline && (
          <VirtualizerList
            style={{
              maxHeight: 'calc(100vh - (var(--spacing) * 4 + 2.8rem))',
            }}
            count={flattenedOutline.length}
            estimateSize={() => 28}
            getItemKey={(index) => `${flattenedOutline[index].title}-${index}`}
            className="p-2"
          >
            {(index) => (
              <ReaderOutlineItem
                selectedNode={selectedNode}
                node={flattenedOutline[index]}
                onToggle={handleToggle}
                onSelect={handleSelect}
              />
            )}
          </VirtualizerList>
        )}
      </m.div>
    )
  }

  return (
    <div
      className={cn(
        'h-full w-64 overflow-hidden border-x border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 transition-[width] opacity-100',
        {
          'w-0 opacity-0': !isShowOutline,
        },
      )}
    >
      {render()}
    </div>
  )
})
