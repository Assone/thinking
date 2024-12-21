export type PageInfo = {
  pageNumber: number
  width: number
  height: number
  originalWidth: number
  originalHeight: number
  rotation: number
  scale: number
}

export interface OutlineNode {
  title: string
  pageNumber: number
  children: OutlineNode[]
  expanded?: boolean
  level: number
}

export abstract class AbstractRenderEngine<RenderOptions = unknown> {
  protected scale: number = 1
  protected rotation: number = 0
  protected pageCount: number = 0
  protected isDestroyed: boolean = false

  /**
   * 初始化渲染引擎
   * @param data 文档数据
   */
  abstract initialize(data: ArrayBuffer): Promise<void>

  /**
   * 获取总页数
   */
  abstract getPageCount(): Promise<number>

  /**
   * 获取页面信息
   * @param pageNumber 页码
   */
  abstract getPageInfo(pageNumber: number): Promise<PageInfo>

  /**
   * 渲染页面
   * @param canvas Canvas上下文
   * @param pageNumber 页码
   * @param options 渲染选项
   */
  abstract renderPage(
    canvas: CanvasRenderingContext2D,
    pageNumber: number,
    options?: RenderOptions,
  ): Promise<void>

  /**
   * 设置缩放比例
   * @param scale 缩放比例
   */
  setScale(scale: number): void {
    this.scale = scale
  }

  /**
   * 设置旋转角度
   * @param rotation 旋转角度
   */
  setRotation(rotation: number): void {
    this.rotation = rotation
  }

  /**
   * 获取当前缩放比例
   */
  getScale(): number {
    return this.scale
  }

  /**
   * 获取当前旋转角度
   */
  getRotation(): number {
    return this.rotation
  }

  /**
   * 销毁渲染引擎
   */
  async destroy(): Promise<void> {
    this.isDestroyed = true
  }

  /**
   * 重置渲染引擎
   */
  async reset(): Promise<void> {
    this.scale = 1
    this.rotation = 0
    this.pageCount = 0
  }

  abstract getOutline(): Promise<OutlineNode[]>
}
