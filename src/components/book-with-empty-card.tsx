import { Upload } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'

export const BookWithEmptyCard: React.FC = () => {
  return (
    <Card className="border-dashed">
      <CardHeader className="space-y-2">
        <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
        <div className="space-y-1 text-center">
          <CardTitle>No books yet</CardTitle>
          <CardDescription>
            Drag and drop PDF files here to add them to your library
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
}
