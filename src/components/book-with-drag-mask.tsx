import { Upload } from 'lucide-react'
import { m } from 'motion/react'

export const BookWithDragMask: React.FC = () => (
  <m.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 rounded-lg border-2 border-dashed border-primary bg-background/80 backdrop-blur-xs flex items-center justify-center"
  >
    <div className="text-center space-y-2">
      <Upload className="w-12 h-12 mx-auto text-primary" />
      <h3 className="text-sm font-medium">Drop PDF files here</h3>
      <p className="text-sm text-muted-foreground">
        Release to add books to your library
      </p>
    </div>
  </m.div>
)
