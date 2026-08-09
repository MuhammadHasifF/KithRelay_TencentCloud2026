import { Check, CheckCircle2, CircleAlert, FileSearch, LockKeyhole, ShieldCheck } from 'lucide-react'
import type { CarePlan } from '../types/care'
import { SourceBadge } from './SourceBadge'

type ReviewViewProps = {
  plan: CarePlan
  approved: boolean
  onToggleReviewed: (flagId: string) => void
  onApprove: () => void
  onOpenSource: (documentId: string) => void
}

export function ReviewView({ plan, approved, onToggleReviewed, onApprove, onOpenSource }: ReviewViewProps) {
  const remainingImportant = plan.flags.filter((flag) => flag.severity === 'important' && !flag.reviewed)
  const canApprove = remainingImportant.length === 0 && plan.flags.length > 0

  return (
    <div className="view-stack">
      <div className="view-heading">
        <div><p className="section-kicker"><FileSearch size={15} /> Human verification</p><h2>Review findings</h2><p>Check each important change against its source before approving the administrative summary.</p></div>
        <div className={`approval-state ${approved ? 'approved' : ''}`}>{approved ? <CheckCircle2 size={18} /> : <LockKeyhole size={18} />}<span><strong>{approved ? 'Plan approved' : 'Approval locked'}</strong><small>{approved ? 'Ready to export' : `${remainingImportant.length} important item${remainingImportant.length === 1 ? '' : 's'} remaining`}</small></span></div>
      </div>
      <section className="review-list">
        {plan.flags.map((flag) => (
          <article className={`review-card ${flag.severity} ${flag.reviewed ? 'reviewed' : ''}`} key={flag.id}>
            <div className="review-card-main">
              <span className="review-severity-icon">{flag.reviewed ? <CheckCircle2 size={21} /> : <CircleAlert size={21} />}</span>
              <div>
                <div className="review-title-row"><span className={`severity-label ${flag.severity}`}>{flag.severity}</span><span className="category-label">{flag.category}</span></div>
                <h3>{flag.title}</h3>
                <p>{flag.explanation}</p>
                <div className="source-row">{flag.sourceIds.map((sourceId) => {
                  const document = plan.documents.find((item) => item.id === sourceId)
                  return document ? <SourceBadge key={`${flag.id}-${sourceId}`} source={{ documentId: sourceId, documentName: document.name, excerpt: document.content.slice(0, 120) }} onOpen={onOpenSource} /> : null
                })}</div>
              </div>
            </div>
            <button className={`review-toggle ${flag.reviewed ? 'done' : ''}`} type="button" onClick={() => onToggleReviewed(flag.id)}><Check size={16} />{flag.reviewed ? 'Reviewed' : 'Mark reviewed'}</button>
          </article>
        ))}
      </section>
      <section className="approval-panel">
        <ShieldCheck size={27} />
        <div><h3>Caregiver approval</h3><p>Approval confirms that important dates and medication changes were checked against the synthetic source documents. It does not constitute medical approval.</p></div>
        <button className="primary-button" type="button" disabled={!canApprove || approved} onClick={onApprove}>{approved ? <><CheckCircle2 size={17} /> Approved</> : <>Approve administrative plan</>}</button>
      </section>
    </div>
  )
}

