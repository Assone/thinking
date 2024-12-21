import { PDFDocumentProxy } from 'pdfjs-dist'
import { OutlineNode } from './AbstractRenderEngine'

type PDFOutlines = Array<{
  title: string
  bold: boolean
  italic: boolean
  color: Uint8ClampedArray
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dest: string | Array<any> | null
  url: string | null
  unsafeUrl: string | undefined
  newWindow: boolean | undefined
  count: number | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: Array<any>
}>

export default class PDFOutlineService {
  private document: PDFDocumentProxy | null = null

  async initialize(document: PDFDocumentProxy) {
    this.document = document
  }

  async getOutline(): Promise<OutlineNode[]> {
    if (!this.document) {
      throw new Error('Document not initialized')
    }

    const outline = await this.document.getOutline()
    if (!outline) {
      return []
    }

    return this.parseOutline(outline)
  }

  private async parseOutline(
    items: PDFOutlines,
    level: number = 0,
    result: OutlineNode[] = [],
  ): Promise<OutlineNode[]> {
    for (const item of items) {
      if (!item.dest && !item.url) continue

      // 处理目标页码
      let pageNumber = 1
      if (item.dest) {
        if (typeof item.dest === 'string') {
          const dest = await this.document!.getDestination(item.dest)
          if (dest) {
            const ref = dest[0]
            pageNumber = (await this.document!.getPageIndex(ref)) + 1
          }
        } else {
          const ref = item.dest[0]
          pageNumber = (await this.document!.getPageIndex(ref)) + 1
        }
      }

      const node: OutlineNode = {
        title: item.title,
        pageNumber,
        children: [],
        level,
        expanded: false, // 默认收起所有节点
      }

      if (item.items?.length > 0) {
        node.children = await this.parseOutline(item.items, level + 1)
      }

      result.push(node)
    }

    return result
  }

  destroy() {
    this.document = null
  }
}
