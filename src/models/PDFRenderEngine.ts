import {
  type PDFDocumentProxy,
  type PDFPageProxy,
  getDocument,
} from '@/lib/pdf'
import { type RenderParameters } from 'pdfjs-dist/types/src/display/api'
import {
  AbstractRenderEngine,
  OutlineNode,
  type PageInfo,
} from './AbstractRenderEngine'
import PDFOutlineService from './PDFOutlineService'

export class PDFRenderEngine extends AbstractRenderEngine<RenderParameters> {
  private document: PDFDocumentProxy | null = null
  private pages: Map<number, PDFPageProxy> = new Map()
  private queue: Promise<void> = Promise.resolve()
  private outline: PDFOutlineService

  constructor() {
    super()
    this.outline = new PDFOutlineService()
  }

  async initialize(data: ArrayBuffer): Promise<void> {
    try {
      // 清理旧的资源
      await this.destroy()

      // 初始化新文档
      const loadingTask = getDocument({
        data: data,
        enableHWA: true,
        disableRange: true,
        disableStream: true,
        disableAutoFetch: false,
      })
      this.document = await loadingTask.promise
      this.pageCount = this.document.numPages

      // 初始化大纲服务
      await this.outline.initialize(this.document)

      // 更新队列状态
      await this.queue
    } catch (error) {
      console.error('Failed to initialize PDF:', error)
      throw error instanceof Error
        ? error
        : new Error('Failed to initialize PDF')
    }

    return this.queue
  }

  override async getPageCount(): Promise<number> {
    return this.queue.then(() => {
      if (!this.document) {
        throw new Error('Document not initialized')
      }

      return this.pageCount
    })
  }

  private async getPage(pageNumber: number): Promise<PDFPageProxy> {
    return this.queue.then(() => {
      if (!this.document) {
        throw new Error('Document not initialized')
      }

      return this.document.getPage(pageNumber)
    })
  }

  async getPageInfo(pageNumber: number): Promise<PageInfo> {
    return this.queue.then(async () => {
      try {
        const page = await this.getPage(pageNumber)
        const viewport = page.getViewport({
          scale: this.scale,
          rotation: this.rotation,
        })

        return {
          pageNumber,
          width: viewport.width,
          height: viewport.height,
          originalWidth: viewport.width / viewport.scale,
          originalHeight: viewport.height / viewport.scale,
          rotation: viewport.rotation,
          scale: viewport.scale,
        }
      } catch (error) {
        console.error('Failed to get page info:', error)
        throw error instanceof Error
          ? error
          : new Error('Failed to get page info')
      }
    })
  }

  override async getOutline(): Promise<OutlineNode[]> {
    return this.outline.getOutline()
  }

  override async renderPage(
    canvas: CanvasRenderingContext2D,
    pageNumber: number,
    options?: RenderParameters,
  ): Promise<void> {
    this.queue.then(async () => {
      try {
        const page = await this.getPage(pageNumber)
        const defaultViewport = page.getViewport({
          scale: this.scale,
          rotation: this.rotation,
        })

        const viewport = options?.viewport ?? defaultViewport

        // 设置画布尺寸
        canvas.canvas.width = viewport.width
        canvas.canvas.height = viewport.height

        // 清除画布
        canvas.clearRect(0, 0, viewport.width, viewport.height)

        // 渲染页面
        const renderContext: RenderParameters = {
          canvasContext: canvas,
          viewport,
          ...options,
        }

        await page.render(renderContext).promise
      } catch (error) {
        console.error('Failed to render page:', error)
        throw error instanceof Error
          ? error
          : new Error('Failed to render page')
      }
    })
  }

  override async destroy(): Promise<void> {
    await this.queue

    // 清理页面缓存
    this.pages.forEach((page) => {
      page.cleanup()
    })
    this.pages.clear()

    // 清理文档
    await this.document?.destroy()
    this.document = null

    // 清理大纲
    this.outline.destroy()

    this.queue = Promise.resolve()

    super.destroy()
  }

  override async reset(): Promise<void> {
    await this.queue

    // 清理页面缓存
    this.pages.forEach((page) => {
      page.cleanup()
    })
    this.pages.clear()

    super.reset()
  }
}
