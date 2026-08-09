import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FolderSync,
  HeartPulse,
  Pill,
  ShieldCheck,
  TriangleAlert,
  WalletCards,
  Waypoints,
} from 'lucide-react'
import { formatDate, formatTime } from '../lib/date'
import type { AppointmentBriefing, CarePlan } from '../types/care'
import { SourceBadge } from './SourceBadge'

type OverviewProps = {
  plan: CarePlan
  briefing: AppointmentBriefing
  reviewedCount: number
  workspaceName?: string
  onNavigate: (view: 'calendar' | 'medications' | 'review' | 'documents' | 'workbuddy') => void
  onOpenSource: (documentId: string) => void
}

export function Overview({
  plan,
  briefing,
  reviewedCount,
  workspaceName,
  onNavigate,
  onOpenSource,
}: OverviewProps) {
  const nextAppointment = briefing.appointment
  const importantFlags = plan.flags.filter((flag) => flag.severity === 'important')
  const progress = plan.flags.length ? Math.round((reviewedCount / plan.flags.length) * 100) : 100

  return (
    <div className="view-stack">
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="section-kicker">
            <Waypoints size={15} />
            Every care detail, carried forward
          </div>
          <h2>Care handoff for {plan.profile.preferredName}</h2>
          <p>
            KithRelay reviewed {plan.documents.length} source documents, reconciled repeated events,
            and kept the evidence attached to every important change.
          </p>
          <button className="primary-button" type="button" onClick={() => onNavigate('review')}>
            Review {plan.flags.filter((flag) => !flag.reviewed).length} findings
            <ArrowRight size={17} />
          </button>
        </div>
        <div className="review-meter" aria-label={`${progress}% of findings reviewed`}>
          <div className="meter-orbit" style={{ '--progress': `${progress * 3.6}deg` } as React.CSSProperties}>
            <div>
              <strong>{progress}%</strong>
              <span>reviewed</span>
            </div>
          </div>
          <p><ShieldCheck size={16} /> Human review stays in control</p>
        </div>
      </section>

      <section className={`workspace-strip ${workspaceName ? 'connected' : ''}`}>
        <span><FolderSync size={19} /></span>
        <div><strong>{workspaceName ? `${workspaceName} is connected` : 'Connect the WorkBuddy workflow'}</strong><p>{workspaceName ? 'KithRelay is reading the same care folder used by the desktop agent.' : 'Choose one shared folder, run WorkBuddy, and sync its results back into this website.'}</p></div>
        <button className="secondary-button" type="button" onClick={() => onNavigate('workbuddy')}>{workspaceName ? 'View sync' : 'Connect now'}<ArrowRight size={16} /></button>
      </section>

      <section className="metric-grid" aria-label="Care plan summary">
        <button className="metric-card" type="button" onClick={() => onNavigate('calendar')}>
          <span className="metric-icon sage"><CalendarDays size={20} /></span>
          <span><strong>{plan.appointments.length}</strong><small>Upcoming visits</small></span>
          <ArrowRight size={16} />
        </button>
        <button className="metric-card" type="button" onClick={() => onNavigate('medications')}>
          <span className="metric-icon blue"><Pill size={20} /></span>
          <span><strong>{briefing.medications.length}</strong><small>Current medicines</small></span>
          <ArrowRight size={16} />
        </button>
        <button className="metric-card" type="button" onClick={() => onNavigate('review')}>
          <span className="metric-icon amber"><TriangleAlert size={20} /></span>
          <span><strong>{importantFlags.length}</strong><small>Important changes</small></span>
          <ArrowRight size={16} />
        </button>
        <button className="metric-card" type="button" onClick={() => onNavigate('documents')}>
          <span className="metric-icon plum"><FileCheck2 size={20} /></span>
          <span><strong>{plan.documents.length}</strong><small>Sources checked</small></span>
          <ArrowRight size={16} />
        </button>
      </section>

      <section className="dashboard-grid">
        <article className="panel next-appointment-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-icon"><HeartPulse size={18} /></span>
              <div><p className="overline">Next appointment</p><h3>{nextAppointment?.clinic ?? 'No appointment found'}</h3></div>
            </div>
            <button className="text-button" type="button" onClick={() => onNavigate('calendar')}>Full calendar <ArrowRight size={14} /></button>
          </div>
          {nextAppointment ? (
            <>
              <div className="appointment-date-block">
                <div className="date-tile">
                  <span>{formatDate(nextAppointment.date, { month: 'short' }).split(' ')[1]}</span>
                  <strong>{new Date(`${nextAppointment.date}T00:00:00`).getDate()}</strong>
                  <small>{formatDate(nextAppointment.date, { weekday: 'short' }).split(',')[0]}</small>
                </div>
                <div className="appointment-primary">
                  <strong>{formatTime(nextAppointment.time)}</strong>
                  <span>{nextAppointment.doctor}</span>
                  <span>{nextAppointment.location}</span>
                </div>
                {nextAppointment.status === 'rescheduled' && <span className="status-chip rescheduled">Rescheduled</span>}
              </div>
              <div className="source-row">
                {nextAppointment.sources.map((source) => <SourceBadge key={`${source.documentId}-${source.excerpt}`} source={source} onOpen={onOpenSource} />)}
              </div>
            </>
          ) : <p className="empty-copy">Add an appointment document to build the next-visit briefing.</p>}
        </article>

        <article className="panel action-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-icon warm"><CheckCircle2 size={18} /></span>
              <div><p className="overline">Action centre</p><h3>What changed</h3></div>
            </div>
            <button className="text-button" type="button" onClick={() => onNavigate('review')}>Review all <ArrowRight size={14} /></button>
          </div>
          <div className="action-list">
            {plan.flags.slice(0, 3).map((flag) => (
              <button className="action-item" type="button" key={flag.id} onClick={() => onNavigate('review')}>
                <span className={`severity-dot ${flag.severity}`} />
                <span><strong>{flag.title}</strong><small>{flag.explanation}</small></span>
                {flag.reviewed ? <CheckCircle2 size={17} className="reviewed-icon" /> : <ArrowRight size={16} />}
              </button>
            ))}
          </div>
        </article>

        <article className="panel mini-panel">
          <div className="mini-panel-heading"><Clock3 size={17} /><span>Next deadline</span></div>
          {plan.payments[0] ? (
            <><strong>{formatDate(plan.payments[0].dueDate)}</strong><p>{plan.payments[0].description}{plan.payments[0].amount ? ` · SGD ${plan.payments[0].amount.toFixed(2)}` : ''}</p></>
          ) : <p>No payment deadlines found.</p>}
        </article>

        <article className="panel mini-panel">
          <div className="mini-panel-heading"><WalletCards size={17} /><span>Document coverage</span></div>
          <strong>{new Set(plan.timeline.flatMap((event) => event.sources.map((source) => source.documentId))).size} of {plan.documents.length}</strong>
          <p>documents contributed dated events or medication evidence.</p>
        </article>
      </section>
    </div>
  )
}
