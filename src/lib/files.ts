import { inferDocumentKind } from './reconcile'
import type { SourceDocument } from '../types/care'

const maximumFileSize = 10 * 1024 * 1024
const maximumFileCount = 20

export type FileIssue = {
  filename: string
  message: string
}

export type FileReadResult = {
  documents: SourceDocument[]
  issues: FileIssue[]
}

async function readPdf(file: File) {
  const [{ getDocument, GlobalWorkerOptions }, { default: pdfWorker }] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ])
  GlobalWorkerOptions.workerSrc = pdfWorker
  const bytes = new Uint8Array(await file.arrayBuffer())
  const pdf = await getDocument({ data: bytes }).promise
  const pages: string[] = []

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const textContent = await page.getTextContent()
    const text = textContent.items
      .map((item) => ('str' in item ? item.str : ''))
      .filter(Boolean)
      .join(' ')
    pages.push(`--- Page ${pageNumber} ---\n${text}`)
  }

  return pages.join('\n\n').trim()
}

async function readFileContent(file: File) {
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    const content = await readPdf(file)
    if (!content.replace(/--- Page \d+ ---/g, '').trim()) {
      throw new Error('This PDF has no readable text layer. Use WorkBuddy or OCR, then verify the extracted text.')
    }
    return content
  }

  if (file.type.startsWith('image/')) {
    throw new Error('Image OCR is handled through the WorkBuddy workflow. The web reviewer accepts extracted text and text-layer PDFs.')
  }

  return file.text()
}

export async function readSourceFiles(files: File[]): Promise<FileReadResult> {
  const documents: SourceDocument[] = []
  const issues: FileIssue[] = []

  if (files.length > maximumFileCount) {
    issues.push({
      filename: 'Selection',
      message: `Only the first ${maximumFileCount} files were processed.`,
    })
  }

  for (const file of files.slice(0, maximumFileCount)) {
    if (file.size > maximumFileSize) {
      issues.push({ filename: file.name, message: 'File is larger than 10 MB.' })
      continue
    }

    try {
      const content = await readFileContent(file)
      documents.push({
        id: crypto.randomUUID(),
        name: file.name,
        kind: inferDocumentKind(file.name, content),
        content,
        addedAt: new Date().toISOString(),
        mimeType: file.type || 'text/plain',
      })
    } catch (error) {
      issues.push({
        filename: file.name,
        message: error instanceof Error ? error.message : 'The file could not be read.',
      })
    }
  }

  return { documents, issues }
}
