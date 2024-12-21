import { PDFPageProxy, getDocument } from '@/lib/pdf'

export interface ParsedBook {
  title: string
  author?: string
  cover?: string
  fileData: ArrayBuffer // 添加fileData字段
  metadata?: Record<string, unknown>
}

/**
 * 从文件名中提取可能的书名和作者信息
 */
function extractInfoFromFilename(filename: string): {
  title: string
  author?: string
} {
  // 移除文件扩展名
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')

  // 尝试匹配不同的格式
  const authorInParens = nameWithoutExt.match(/^(.+)[\\(（](.+?)[\\)）]$/)
  const authorWithDash = nameWithoutExt.match(/^(.+)-(.+)$/)

  if (authorInParens) {
    return {
      title: authorInParens[1].trim(),
      author: authorInParens[2].trim(),
    }
  }

  if (authorWithDash) {
    return {
      title: authorWithDash[1].trim(),
      author: authorWithDash[2].trim(),
    }
  }

  return { title: nameWithoutExt.trim() }
}

/**
 * 从PDF第一页生成封面预览
 */
async function generatePdfCover(page: PDFPageProxy): Promise<string> {
  const viewport = page.getViewport({ scale: 1.0 })
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!

  // 设置canvas大小
  canvas.width = viewport.width
  canvas.height = viewport.height

  // 渲染PDF页面到canvas
  await page.render({
    canvasContext: context,
    viewport: viewport,
  }).promise

  return canvas.toDataURL('image/jpeg')
}

/**
 * 解析PDF文件
 */
async function parsePdfFile(file: File): Promise<ParsedBook> {
  // 将File对象转换为ArrayBuffer
  const arrayBuffer = await file.arrayBuffer()

  // 加载PDF文档
  const pdf = await getDocument({ data: arrayBuffer }).promise

  // 获取元数据
  const metadata = await pdf.getMetadata()
  const info = metadata.info as Record<string, unknown>

  // 提取文本内容
  // const content = await extractPdfText(pdf);

  // 生成封面（使用第一页）
  const firstPage = await pdf.getPage(1)
  const cover = await generatePdfCover(firstPage)

  // 尝试从PDF元数据或文件名获取标题和作者
  let title = (info.Title as string) || ''
  let author = (info.Author as string) || ''

  if (!title || !author) {
    const fileInfo = extractInfoFromFilename(file.name)
    if (!title) title = fileInfo.title
    if (!author) author = fileInfo.author || ''
  }

  return {
    title,
    author,
    cover,

    fileData: arrayBuffer, // 添加文件数据
    metadata: {
      ...info,
      pageCount: pdf.numPages,
      fileSize: file.size,
      lastModified: new Date(file.lastModified),
    },
  }
}

const parsePageHeights = async (fileData: ArrayBuffer) => {
  const loadingTask = getDocument(fileData)
  const pdf = await loadingTask.promise
  const heights = await Promise.all(
    Array.from({ length: pdf.numPages }).map(async (_, index) => {
      const page = await pdf.getPage(index + 1)
      const viewport = page.getViewport({ scale: 1.0 })

      return viewport.height
    }),
  )

  return heights
}

/**
 * 解析书籍文件
 */
export async function parseBookFile(file: File) {
  const parsedBook: ParsedBook = await parsePdfFile(file)
  const fileData = await file.arrayBuffer() // 读取文件数据
  const pageHeights = await parsePageHeights(fileData.slice(0))

  return {
    ...parsedBook,
    pageHeights,
    fileData,
    fileType: file.type,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}
