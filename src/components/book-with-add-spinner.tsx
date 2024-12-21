import { Loader2 } from 'lucide-react'
import { m } from 'motion/react'
import { Card, CardContent } from './ui/card'

export const BookWithAddSpinner: React.FC = () => {
  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="fixed bottom-4 right-4"
    >
      <Card>
        <CardContent className="flex items-center space-x-3 py-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Adding books...</span>
        </CardContent>
      </Card>
    </m.div>
  )
}
