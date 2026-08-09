import { File, FilePlus2, FileText, ShieldCheck, Trash2, UploadCloud } from 'lucide-react'
import { useRef, useState } from 'react'
import type { FileIssue } from '../lib/files'
import type { CarePlan } from '../types/care'

type DocumentsViewProps = {
  plan: CarePlan
  issues: FileIssue[]
  isReading: boolean
  onFiles: (files: File[]) => void
  onOpenSource: (documentId: string) => void
  onRemove: (documentId: string) => void
}

export function DocumentsView({ plan, issues, isReading, onFiles, onOpenSource, onRemove }: DocumentsViewProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function acceptFiles(fileList: FileList | null) {
    if (fileList?.length) onFiles(Array.from(fileList))
  }

  return (
    <div className="view-stack">
      <div className="view-heading">
        <div><p className="section-kicker"><FileText size={15} /> Evidence workspace</p><h2>Source documents</h2><p>Files stay in this browser tab. Use synthetic documents for the public demo.</p></div>
      </div>
      <section
        className={`upload-zone ${dragging ? 'dragging' : ''}`}
        onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); acceptFiles(event.dataTransfer.files) }}
      >
        <input ref={inputRef} type="file" multiple accept=".txt,.md,.csv,.json,.pdf,image/*" onChange={(event) => acceptFiles(event.target.files)} />
        <span className="upload-icon"><UploadCloud size={28} /></span>
        <div><h3>{isReading ? 'Reading documents…' : 'Drop care documents here'}</h3><p>Text, Markdown, CSV, JSON, and text-layer PDF · maximum 10 MB each</p></div>
        <button className="secondary-button" type="button" disabled={isReading} onClick={() => inputRef.current?.click()}><FilePlus2 size={17} /> Choose files</button>
      </section>
      {issues.length > 0 && <div className="issue-list">{issues.map((issue) => <p key={`${issue.filename}-${issue.message}`}><strong>{issue.filename}:</strong> {issue.message}</p>)}</div>}
      <div className="privacy-note"><ShieldCheck size={17} /><span><strong>Demo privacy:</strong> document text is kept in memory and is not uploaded by this companion interface. WorkBuddy has separate cloud-processing terms.</span></div>
      <section className="document-list">
        {plan.documents.map((document) => (
          <article className="document-row" key={document.id}>
            <button className="document-open" type="button" onClick={() => onOpenSource(document.id)}>
              <span className={`document-icon ${document.kind}`}><File size={20} /></span>
              <span><strong>{document.name}</strong><small>{document.kind} · {document.content.length.toLocaleString()} characters</small></span>
            </button>
            <span className={`kind-chip ${document.kind}`}>{document.kind}</span>
            <button className="icon-button danger" type="button" aria-label={`Remove ${document.name}`} onClick={() => onRemove(document.id)}><Trash2 size={17} /></button>
          </article>
        ))}
      </section>
    </div>
  )
}

