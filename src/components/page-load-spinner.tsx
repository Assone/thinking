import { Loader2 } from 'lucide-react'

export const PageLoadSpinner: React.FC = () => (
  <div className="flex items-center justify-center w-full min-h-screen">
    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
  </div>
)
