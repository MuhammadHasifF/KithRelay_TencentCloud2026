import {
  Bot,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  Download,
  FileText,
  LayoutDashboard,
  Menu,
  Pill,
  RefreshCcw,
  ShieldCheck,
  Trash2,
  Waypoints,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { CalendarView } from './components/CalendarView'
import { DocumentsView } from './components/DocumentsView'
import { MedicationsView } from './components/MedicationsView'
import { Overview } from './components/Overview'
import { ReviewView } from './components/ReviewView'
import { SourceDrawer } from './components/SourceDrawer'
import { WorkBuddyView } from './components/WorkBuddyView'
import { demoDocuments } from './data/demoDocuments'
import { appointmentBriefingMarkdown, careCalendarMarkdown, downloadText } from './lib/export'
import { readSourceFiles, type FileIssue } from './lib/files'
import { buildAppointmentBriefing, buildCarePlan } from './lib/reconcile'
import type { SourceDocument } from './types/care'

type ViewKey = 'overview' | 'calendar' | 'medications' | 'documents' | 'review' | 'workbuddy'

const navigation: Array<{ key: ViewKey; label: string; icon: typeof LayoutDashboard }> = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'calendar', label: 'Care calendar', icon: CalendarDays },
  { key: 'medications', label: 'Medications', icon: Pill },
  { key: 'documents', label: 'Documents', icon: FileText },
  { key: 'review', label: 'Review findings', icon: ClipboardCheck },
  { key: 'workbuddy', label: 'WorkBuddy', icon: Bot },
]

function App() {
  const [activeView, setActiveView] = useState<ViewKey>('overview')
  const [documents, setDocuments] = useState<SourceDocument[]>(demoDocuments)
  const [analysisDate, setAnalysisDate] = useState('2026-08-09')
  const [reviewedFlagIds, setReviewedFlagIds] = useState<string[]>([])
  const [approved, setApproved] = useState(false)
  const [sourceDocumentId, setSourceDocumentId] = useState<string>()
  const [fileIssues, setFileIssues] = useState<FileIssue[]>([])
  const [isReading, setIsReading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)

  const basePlan = useMemo(() => buildCarePlan(documents, analysisDate), [documents, analysisDate])
  const plan = useMemo(() => ({
    ...basePlan,
    flags: basePlan.flags.map((flag) => ({ ...flag, reviewed: reviewedFlagIds.includes(flag.id) })),
  }), [basePlan, reviewedFlagIds])
  const briefing = useMemo(() => buildAppointmentBriefing(plan, analysisDate), [plan, analysisDate])
  const selectedDocument = plan.documents.find((document) => document.id === sourceDocumentId)
  const isDemo = documents.length === demoDocuments.length && documents.every((document, index) => document.id === demoDocuments[index].id)

  function resetReviewState() {
    setReviewedFlagIds([])
    setApproved(false)
  }

  async function handleFiles(files: File[]) {
    setIsReading(true)
    setFileIssues([])
    const result = await readSourceFiles(files)
    setFileIssues(result.issues)
    if (result.documents.length) {
      setDocuments((current) => [...current, ...result.documents])
      setAnalysisDate(new Date().toISOString().slice(0, 10))
      resetReviewState()
    }
    setIsReading(false)
  }

  function removeDocument(documentId: string) {
    setDocuments((current) => current.filter((document) => document.id !== documentId))
    resetReviewState()
  }

  function loadDemo() {
    setDocuments(demoDocuments)
    setAnalysisDate('2026-08-09')
    setFileIssues([])
    resetReviewState()
    setActiveView('overview')
  }

  function clearWorkspace() {
    setDocuments([])
    setAnalysisDate(new Date().toISOString().slice(0, 10))
    setFileIssues([])
    resetReviewState()
    setActiveView('documents')
  }

  function navigate(view: ViewKey) {
    setActiveView(view)
    setMobileMenuOpen(false)
  }

  function renderView() {
    switch (activeView) {
      case 'calendar':
        return <CalendarView plan={plan} onOpenSource={setSourceDocumentId} />
      case 'medications':
        return <MedicationsView plan={plan} onOpenSource={setSourceDocumentId} />
      case 'documents':
        return <DocumentsView plan={plan} issues={fileIssues} isReading={isReading} onFiles={handleFiles} onOpenSource={setSourceDocumentId} onRemove={removeDocument} />
      case 'review':
        return <ReviewView plan={plan} approved={approved} onToggleReviewed={(flagId) => { setReviewedFlagIds((current) => current.includes(flagId) ? current.filter((id) => id !== flagId) : [...current, flagId]); setApproved(false) }} onApprove={() => setApproved(true)} onOpenSource={setSourceDocumentId} />
      case 'workbuddy':
        return <WorkBuddyView plan={plan} />
      default:
        return <Overview plan={plan} briefing={briefing} reviewedCount={reviewedFlagIds.length} onNavigate={navigate} onOpenSource={setSourceDocumentId} />
    }
  }

  return (
    <div className="app-frame">
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-brand"><span><Waypoints size={23} /></span><div><strong>KithRelay</strong><small>Care handoff</small></div><button className="mobile-close" type="button" onClick={() => setMobileMenuOpen(false)}><X size={20} /></button></div>
        <nav aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          {navigation.map((item) => {
            const Icon = item.icon
            const badge = item.key === 'review' ? plan.flags.filter((flag) => !flag.reviewed).length : undefined
            return <button className={activeView === item.key ? 'active' : ''} type="button" key={item.key} onClick={() => navigate(item.key)}><Icon size={18} /><span>{item.label}</span>{badge ? <em>{badge}</em> : null}</button>
          })}
        </nav>
        <div className="sidebar-safety"><ShieldCheck size={18} /><div><strong>Human-reviewed</strong><span>Administrative support only</span></div></div>
        <div className="sidebar-footer"><p>Tencent Cloud Hackathon 2026</p><span>Age Well · AI Agent Track</span></div>
      </aside>
      {mobileMenuOpen && <button className="mobile-overlay" type="button" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)} />}

      <div className="app-main">
        <header className="topbar">
          <button className="menu-button" type="button" aria-label="Open navigation" onClick={() => setMobileMenuOpen(true)}><Menu size={21} /></button>
          <div className="workspace-identity">
            <span className="profile-avatar">TG</span>
            <div><strong>{plan.profile.preferredName}</strong><span>{plan.profile.age ? `${plan.profile.age} years` : 'Age not provided'} · {plan.profile.conditions.join(' · ') || 'No conditions listed'}</span></div>
          </div>
          <div className="topbar-actions">
            <span className={`data-chip ${isDemo ? 'synthetic' : ''}`}><ShieldCheck size={14} />{isDemo ? 'Synthetic demo data' : 'Local review session'}</span>
            <button className="icon-button desktop-only" type="button" title="Reload synthetic demo" onClick={loadDemo}><RefreshCcw size={17} /></button>
            <div className="export-menu">
              <button className="primary-button compact" type="button" onClick={() => setExportOpen((open) => !open)}><Download size={16} /> Export <ChevronDown size={14} /></button>
              {exportOpen && <div className="export-popover"><button type="button" onClick={() => { downloadText('care_calendar.md', careCalendarMarkdown(plan)); setExportOpen(false) }}>Care calendar (.md)</button><button type="button" onClick={() => { downloadText('briefing.md', appointmentBriefingMarkdown(plan)); setExportOpen(false) }}>Appointment briefing (.md)</button><button type="button" onClick={() => { downloadText('care_plan.json', JSON.stringify(plan, null, 2), 'application/json'); setExportOpen(false) }}>Evidence bundle (.json)</button></div>}
            </div>
          </div>
        </header>
        <main className="content-area">{renderView()}</main>
        <footer className="app-footer"><span>AI-assisted administrative summary · Verify against source documents</span><div><button type="button" onClick={loadDemo}><RefreshCcw size={13} /> Reset demo</button><button type="button" onClick={clearWorkspace}><Trash2 size={13} /> Clear workspace</button></div></footer>
      </div>
      <SourceDrawer document={selectedDocument} onClose={() => setSourceDocumentId(undefined)} />
    </div>
  )
}

export default App
