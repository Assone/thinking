import { PDFPageProxy } from '@/lib/pdf'
import { useAnnotationStore } from '../stores/annotation'
import { Annotation, IDocumentAnnotator } from './types'

export class PDFAnnotator implements IDocumentAnnotator {
  private documentId: string
  private page: PDFPageProxy | null

  constructor(documentId: string, page: PDFPageProxy | null = null) {
    this.documentId = documentId
    this.page = page
    console.log(this.page)
  }

  setPage(page: PDFPageProxy | null) {
    this.page = page
  }

  async addAnnotation(annotation: Omit<Annotation, 'id'>): Promise<Annotation> {
    const store = useAnnotationStore.getState()
    store.addAnnotation(this.documentId, annotation)
    const annotations = store.documentAnnotations[this.documentId].annotations
    return annotations[annotations.length - 1]
  }

  async updateAnnotation(
    id: string,
    annotation: Partial<Annotation>,
  ): Promise<Annotation> {
    const store = useAnnotationStore.getState()
    store.updateAnnotation(this.documentId, id, annotation)
    return store.documentAnnotations[this.documentId].annotations.find(
      (a) => a.id === id,
    )!
  }

  async deleteAnnotation(id: string): Promise<void> {
    const store = useAnnotationStore.getState()
    store.deleteAnnotation(this.documentId, id)
  }

  async getAnnotations(): Promise<Annotation[]> {
    const store = useAnnotationStore.getState()
    return store.documentAnnotations[this.documentId]?.annotations || []
  }

  beginSelection(): void {
    useAnnotationStore.getState().setSelection({ isSelecting: true })
  }

  endSelection(): void {
    useAnnotationStore.getState().setSelection({ isSelecting: false })
  }

  clearSelection(): void {
    useAnnotationStore.getState().clearSelection()
  }

  get isSelecting(): boolean {
    return useAnnotationStore.getState().selection.isSelecting
  }

  get currentSelection() {
    const selection = useAnnotationStore.getState().selection
    if (!selection.selectedText && selection.rects.length === 0) {
      return null
    }
    return {
      rects: selection.rects,
      selectedText: selection.selectedText,
    }
  }
}
