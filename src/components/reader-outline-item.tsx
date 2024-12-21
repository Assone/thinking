import { cn } from '@/lib/utils'
import { OutlineNode } from '@/models/AbstractRenderEngine'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { memo } from 'react'

interface ReaderOutlineItemProps {
  node: OutlineNode
  selectedNode: OutlineNode | null
  onToggle: (node: OutlineNode) => void
  onSelect: (node: OutlineNode) => void
  style?: React.CSSProperties
}

export const ReaderOutlineItem: React.FC<ReaderOutlineItemProps> = memo(
  ({ node, selectedNode, onToggle, onSelect, style }) => {
    const isSelected = selectedNode === node
    const hasChildren = node.children.length > 0

    return (
      <div style={style}>
        <div
          className={cn(
            'group flex cursor-pointer gap-1 rounded px-2 py-1',
            'hover:bg-neutral-100 dark:hover:bg-neutral-800',
            isSelected && 'bg-neutral-100 dark:bg-neutral-800',
          )}
          style={{ paddingLeft: `${node.level * 12 + 8}px` }}
          onClick={() => onSelect(node)}
        >
          {hasChildren && (
            <button
              className="flex h-4 w-4 items-center justify-center text-neutral-500 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-300"
              onClick={(e) => {
                e.stopPropagation()
                onToggle(node)
              }}
            >
              {node.expanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
          <span className="flex-1 truncate text-sm text-neutral-700 group-hover:text-neutral-900 dark:text-neutral-300 dark:group-hover:text-neutral-100">
            {node.title}
          </span>
          <span className="text-xs text-neutral-500 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-300">
            {node.pageNumber}
          </span>
        </div>
        {node.expanded && hasChildren && (
          <div>
            {node.children.map((child, index) => (
              <ReaderOutlineItem
                key={`${child.title}-${index}`}
                selectedNode={selectedNode}
                node={child}
                onToggle={onToggle}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    )
  },
)
