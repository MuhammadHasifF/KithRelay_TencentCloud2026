import { Calendar, Copy, FileText, X } from 'lucide-react'
import { useState } from 'react'
import type { SourceDocument } from '../types/care'

type SourceDrawerProps = {
  document?: SourceDocument
  onClose: () => void
}

export function SourceDrawer({ document, onClose }: SourceDrawerProps) {
  const [copied, setCopied] = useState(false)
  if (!document) return null

  async function copyContent() {
    await navigator.clipboard.writeText(document!.content)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside className="source-drawer" role="dialog" aria-modal="true" aria-labelledby="source-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="drawer-heading">
          <span className={`document-icon ${document.kind}`}><FileText size={20} /></span>
          <div><p className="overline">Source evidence</p><h2 id="source-title">{document.name}</h2></div>
          <button className="icon-button" type="button" aria-label="Close source document" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="document-metadata"><span className={`kind-chip ${document.kind}`}>{document.kind}</span><span><Calendar size={14} /> Added {new Date(document.addedAt).toLocaleString('en-SG')}</span></div>
        <pre className="document-content">{document.content}</pre>
        <div className="drawer-footer"><p>Always verify extracted details against this source.</p><button className="secondary-button" type="button" onClick={copyContent}><Copy size={16} />{copied ? 'Copied' : 'Copy text'}</button></div>
      </aside>
    </div>
  )
}

