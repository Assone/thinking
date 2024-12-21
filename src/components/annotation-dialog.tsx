import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Annotation } from '@/services/annotation/types'
import { useRef } from 'react'

interface AnnotationDialogProps {
  annotation: Annotation | null
  isOpen: boolean
  onClose: () => void
  onSave: (note: string) => void
  onDelete: () => void
}

export function AnnotationDialog({
  annotation,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: AnnotationDialogProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSave = () => {
    const note = textareaRef.current?.value || ''
    onSave(note)
  }

  if (!annotation) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑批注</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <p className="text-sm font-medium">选中的文本</p>
            <p className="text-sm text-muted-foreground">
              {annotation.content.selectedText}
            </p>
          </div>
          <div className="grid gap-2">
            <label htmlFor="note" className="text-sm font-medium">
              批注内容
            </label>
            <Textarea
              id="note"
              ref={textareaRef}
              defaultValue={annotation.content.note}
              placeholder="添加批注..."
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onDelete}>
            删除
          </Button>
          <Button onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
