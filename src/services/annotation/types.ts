export type AnnotationType = 'highlight' | 'underline' | 'rectangle'
export type AnnotationColor = 'yellow' | 'green' | 'blue' | 'red' | 'purple'

export interface Position {
  pageNumber: number
  rects: DOMRect[]
}

export interface Annotation {
  id: string
  type: AnnotationType
  color: AnnotationColor
  position: Position
  content: {
    selectedText: string
    note?: string
  }
  metadata: {
    createdAt: number
    updatedAt: number
  }
}

export interface DocumentAnnotation {
  documentId: string
  annotations: Annotation[]
}

// 文档标注接口
export interface IDocumentAnnotator {
  // 基本操作
  addAnnotation(annotation: Omit<Annotation, 'id'>): Promise<Annotation>
  updateAnnotation(
    id: string,
    annotation: Partial<Annotation>,
  ): Promise<Annotation>
  deleteAnnotation(id: string): Promise<void>
  getAnnotations(): Promise<Annotation[]>

  // 选择操作
  beginSelection(): void
  endSelection(): void
  clearSelection(): void

  // 状态
  isSelecting: boolean
  currentSelection: {
    rects: DOMRect[]
    selectedText: string
  } | null
}
