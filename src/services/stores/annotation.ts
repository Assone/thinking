import { createSelectors } from '@/utils/zustand'
import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { Annotation, DocumentAnnotation } from '../annotation/types'

interface AnnotationState {
  documentAnnotations: Record<string, DocumentAnnotation>
  currentDocumentId: string | null
  selection: {
    isSelecting: boolean
    rects: DOMRect[]
    selectedText: string
  }

  // Actions
  setCurrentDocument: (documentId: string) => void
  addAnnotation: (
    documentId: string,
    annotation: Omit<Annotation, 'id'>,
  ) => void
  updateAnnotation: (
    documentId: string,
    annotationId: string,
    updates: Partial<Annotation>,
  ) => void
  deleteAnnotation: (documentId: string, annotationId: string) => void
  setSelection: (selection: Partial<AnnotationState['selection']>) => void
  clearSelection: () => void
}

const initialState: Pick<
  AnnotationState,
  'documentAnnotations' | 'currentDocumentId' | 'selection'
> = {
  documentAnnotations: {},
  currentDocumentId: null,
  selection: {
    isSelecting: false,
    rects: [],
    selectedText: '',
  },
}

export const useAnnotationStore = createSelectors(
  create<AnnotationState>(
    combine(initialState, (set, get) => ({
      setCurrentDocument: (documentId) => {
        set({ currentDocumentId: documentId })
        if (!get().documentAnnotations[documentId]) {
          set((state) => ({
            documentAnnotations: {
              ...state.documentAnnotations,
              [documentId]: {
                documentId,
                annotations: [],
              },
            },
          }))
        }
      },

      addAnnotation: (documentId, annotation) => {
        const newAnnotation: Annotation = {
          ...annotation,
          id: nanoid(),
          metadata: {
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        }

        set((state) => ({
          documentAnnotations: {
            ...state.documentAnnotations,
            [documentId]: {
              documentId,
              annotations: [
                ...(state.documentAnnotations[documentId]?.annotations || []),
                newAnnotation,
              ],
            },
          },
        }))
      },

      updateAnnotation: (documentId, annotationId, updates) => {
        set((state) => ({
          documentAnnotations: {
            ...state.documentAnnotations,
            [documentId]: {
              documentId,
              annotations: state.documentAnnotations[
                documentId
              ].annotations.map((annotation) =>
                annotation.id === annotationId
                  ? {
                      ...annotation,
                      ...updates,
                      metadata: {
                        ...annotation.metadata,
                        updatedAt: Date.now(),
                      },
                    }
                  : annotation,
              ),
            },
          },
        }))
      },

      deleteAnnotation: (documentId, annotationId) => {
        set((state) => ({
          documentAnnotations: {
            ...state.documentAnnotations,
            [documentId]: {
              documentId,
              annotations: state.documentAnnotations[
                documentId
              ].annotations.filter(
                (annotation) => annotation.id !== annotationId,
              ),
            },
          },
        }))
      },

      setSelection: (selection) => {
        set((state) => ({
          selection: {
            ...state.selection,
            ...selection,
          },
        }))
      },

      clearSelection: () => {
        set(() => ({
          selection: initialState.selection,
        }))
      },
    })),
  ),
)
