import { GlobalWorkerOptions } from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?worker&url'

GlobalWorkerOptions.workerSrc = pdfjsWorker

export * from 'pdfjs-dist'
