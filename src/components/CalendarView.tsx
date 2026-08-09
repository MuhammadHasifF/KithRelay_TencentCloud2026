import { CalendarDays, Clock3, FileText, MapPin } from 'lucide-react'
import { formatDate, formatTime } from '../lib/date'
import type { CarePlan } from '../types/care'
import { SourceBadge } from './SourceBadge'

type CalendarViewProps = {
  plan: CarePlan
  onOpenSource: (documentId: string) => void
}

export function CalendarView({ plan, onOpenSource }: CalendarViewProps) {
  return (
    <div className="view-stack">
      <div className="view-heading">
        <div><p className="section-kicker"><CalendarDays size={15} /> Unified timeline</p><h2>Care calendar</h2><p>Repeated appointments are merged; source documents remain one click away.</p></div>
      </div>
      <section className="panel timeline-panel">
        {plan.timeline.length ? plan.timeline.map((event, index) => (
          <article className="timeline-item" key={event.id}>
            <div className="timeline-rail"><span className={`timeline-node ${event.type}`} />{index < plan.timeline.length - 1 && <i />}</div>
            <div className="timeline-date"><strong>{formatDate(event.date, { day: 'numeric' }).split(' ')[0]}</strong><span>{formatDate(event.date, { month: 'short' }).split(' ')[1]}</span><small>{formatDate(event.date, { weekday: 'short' }).split(',')[0]}</small></div>
            <div className="timeline-content">
              <div className="timeline-title-row"><span className={`event-chip ${event.type}`}>{event.type}</span><h3>{event.title}</h3></div>
              <p>{event.detail}</p>
              <div className="event-meta">
                {event.time && <span><Clock3 size={14} />{formatTime(event.time)}</span>}
                {event.type === 'appointment' && event.detail.includes('Block') && <span><MapPin size={14} />Hospital location in details</span>}
              </div>
              <div className="source-row"><FileText size={14} />{event.sources.map((source) => <SourceBadge key={`${event.id}-${source.documentId}`} source={source} onOpen={onOpenSource} />)}</div>
            </div>
          </article>
        )) : <div className="empty-state"><CalendarDays size={30} /><h3>No dated events yet</h3><p>Add appointment letters, medication lists, or bills.</p></div>}
      </section>
    </div>
  )
}

