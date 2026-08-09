import { ArrowRight, Check, CircleSlash2, Pill, Stethoscope } from 'lucide-react'
import type { CarePlan } from '../types/care'
import { SourceBadge } from './SourceBadge'

type MedicationsViewProps = {
  plan: CarePlan
  onOpenSource: (documentId: string) => void
}

export function MedicationsView({ plan, onOpenSource }: MedicationsViewProps) {
  const current = plan.medications.filter((medication) => medication.status === 'current')
  const discontinued = plan.medications.filter((medication) => medication.status === 'discontinued')
  const uncertain = plan.medications.filter((medication) => medication.status === 'uncertain')

  return (
    <div className="view-stack">
      <div className="view-heading">
        <div><p className="section-kicker"><Pill size={15} /> Cross-document comparison</p><h2>Medication reconciliation</h2><p>The newest documented list is compared against earlier sources. This is not prescribing advice.</p></div>
      </div>
      <div className="safety-banner"><Stethoscope size={19} /><div><strong>Confirm with a qualified healthcare professional</strong><span>KithRelay surfaces documented changes; it never recommends starting, stopping, or changing a medicine.</span></div></div>
      <section className="medication-grid">
        {current.map((medication) => (
          <article className={`panel medication-card ${medication.change ? 'changed' : ''}`} key={medication.id}>
            <div className="medication-topline"><span className="medication-symbol"><Pill size={19} /></span><span className="status-chip current"><Check size={12} /> Current</span></div>
            <h3>{medication.name}</h3>
            <strong className="dose">{medication.strength ?? 'Strength not stated'}</strong>
            <p>{medication.instructions ?? 'Instructions not stated'}</p>
            {medication.indication && <span className="indication">For: {medication.indication}</span>}
            {medication.change && (
              <div className="change-box">
                <span>{medication.change.type}</span>
                <strong>{medication.change.from ?? 'Not listed'} <ArrowRight size={14} /> {medication.change.to ?? medication.strength}</strong>
                {medication.change.reason && <p>{medication.change.reason}</p>}
              </div>
            )}
            <div className="source-row">{medication.sources.map((source) => <SourceBadge key={`${medication.id}-${source.documentId}`} source={source} onOpen={onOpenSource} />)}</div>
          </article>
        ))}
        {discontinued.map((medication) => (
          <article className="panel medication-card discontinued" key={medication.id}>
            <div className="medication-topline"><span className="medication-symbol muted"><CircleSlash2 size={19} /></span><span className="status-chip discontinued">Discontinued in document</span></div>
            <h3>{medication.name}</h3>
            <strong className="dose">{medication.strength}</strong>
            <p>{medication.change?.reason}</p>
            <div className="source-row">{medication.sources.map((source) => <SourceBadge key={`${medication.id}-${source.documentId}`} source={source} onOpen={onOpenSource} />)}</div>
          </article>
        ))}
        {uncertain.map((medication) => (
          <article className="panel medication-card changed" key={medication.id}>
            <div className="medication-topline"><span className="medication-symbol muted"><CircleSlash2 size={19} /></span><span className="status-chip rescheduled">Needs confirmation</span></div>
            <h3>{medication.name}</h3>
            <strong className="dose">{medication.strength}</strong>
            <p>Missing from the newest list without an explicit discontinuation statement.</p>
            <div className="source-row">{medication.sources.map((source) => <SourceBadge key={`${medication.id}-${source.documentId}`} source={source} onOpen={onOpenSource} />)}</div>
          </article>
        ))}
      </section>
    </div>
  )
}
