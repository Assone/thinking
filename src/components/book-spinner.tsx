import { Loader2 } from 'lucide-react'

export const BookSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
  </div>
)
