import { FileText } from 'lucide-react'
import type { SourceReference } from '../types/care'

type SourceBadgeProps = {
  source: SourceReference
  onOpen: (documentId: string) => void
}

export function SourceBadge({ source, onOpen }: SourceBadgeProps) {
  return (
    <button
      className="source-badge"
      type="button"
      onClick={() => onOpen(source.documentId)}
      title={`Open ${source.documentName}`}
    >
      <FileText size={13} />
      {source.documentName}
    </button>
  )
}

