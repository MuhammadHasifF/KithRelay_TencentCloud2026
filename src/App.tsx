import {
  Bot,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  Download,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Pill,
  RefreshCcw,
  ShieldCheck,
  Trash2,
  Waypoints,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AuthScreen } from './components/AuthScreen'
import { CalendarView } from './components/CalendarView'
import { DocumentsView } from './components/DocumentsView'
import { MedicationsView } from './components/MedicationsView'
import { Overview } from './components/Overview'
import { ReviewView } from './components/ReviewView'
import { SourceDrawer } from './components/SourceDrawer'
import { WorkBuddyView, type WorkBuddyArtifacts } from './components/WorkBuddyView'
import { demoDocuments } from './data/demoDocuments'
import { clearSession, createDemoSession, restoreSession, type AuthSession } from './lib/auth'
import { appointmentBriefingMarkdown, careCalendarMarkdown, downloadText } from './lib/export'
import { readSourceFiles, type FileIssue } from './lib/files'
import { buildAppointmentBriefing, buildCarePlan } from './lib/reconcile'
import { buildTaskFile, writeWorkspaceFile } from './lib/workbuddy'
import { clearWorkspaceHandle, loadWorkspaceHandle, saveWorkspaceHandle, verifyWorkspacePermission } from './lib/workspace'
import type { SourceDocument } from './types/care'

type ViewKey = 'overview' | 'calendar' | 'medications' | 'documents' | 'review' | 'workbuddy'

type DirectoryPickerWindow = Window & {
  showDirectoryPicker?: (options?: { mode?: 'read' | 'readwrite' }) => Promise<FileSystemDirectoryHandle>
}

type IterableDirectoryHandle = FileSystemDirectoryHandle & {
  values: () => AsyncIterableIterator<FileSystemHandle>
}

const navigation: Array<{ key: ViewKey; label: string; icon: typeof LayoutDashboard }> = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'calendar', label: 'Care calendar', icon: CalendarDays },
  { key: 'medications', label: 'Medications', icon: Pill },
  { key: 'documents', label: 'Documents', icon: FileText },
  { key: 'review', label: 'Review findings', icon: ClipboardCheck },
  { key: 'workbuddy', label: 'WorkBuddy sync', icon: Bot },
]

type WorkspaceAppProps = {
  session: AuthSession
  onSignOut: () => void
}

function WorkspaceApp({ session, onSignOut }: WorkspaceAppProps) {
  const [activeView, setActiveView] = useState<ViewKey>(() => {
    const requestedView = new URLSearchParams(window.location.search).get('view')
    return navigation.some((item) => item.key === requestedView) ? requestedView as ViewKey : 'overview'
  })
  const [documents, setDocuments] = useState<SourceDocument[]>(demoDocuments)
  const [analysisDate, setAnalysisDate] = useState('2026-08-09')
  const [reviewedFlagIds, setReviewedFlagIds] = useState<string[]>([])
  const [approved, setApproved] = useState(false)
  const [sourceDocumentId, setSourceDocumentId] = useState<string>()
  const [fileIssues, setFileIssues] = useState<FileIssue[]>([])
  const [isReading, setIsReading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [workspaceHandle, setWorkspaceHandle] = useState<FileSystemDirectoryHandle>()
  const [workspaceName, setWorkspaceName] = useState<string>()
  const [workspaceError, setWorkspaceError] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)
  const [workBuddyArtifacts, setWorkBuddyArtifacts] = useState<WorkBuddyArtifacts>({})
  const [needsPermission, setNeedsPermission] = useState(false)
  const [taskWritten, setTaskWritten] = useState(false)
  const [watchStatus, setWatchStatus] = useState<{ checkedAt?: string; fileCount?: number; sawCalendar?: boolean; sawBriefing?: boolean; error?: string }>({})
  const lastOutputsRef = useRef<{ calendar?: string; briefing?: string }>({})

  const basePlan = useMemo(() => buildCarePlan(documents, analysisDate), [documents, analysisDate])
  const plan = useMemo(() => ({
    ...basePlan,
    flags: basePlan.flags.map((flag) => ({ ...flag, reviewed: reviewedFlagIds.includes(flag.id) })),
  }), [basePlan, reviewedFlagIds])
  const briefing = useMemo(() => buildAppointmentBriefing(plan, analysisDate), [plan, analysisDate])
  const selectedDocument = plan.documents.find((document) => document.id === sourceDocumentId)
  const isDemo = documents.length === demoDocuments.length && documents.every((document, index) => document.id === demoDocuments[index].id)
  const accountInitials = session.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()

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

  async function syncWorkspace(handle = workspaceHandle) {
    if (!handle) return

    setIsSyncing(true)
    setIsReading(true)
    setWorkspaceError('')

    try {
      const sourceFiles: File[] = []
      let calendar: string | undefined
      let briefingOutput: string | undefined

      for await (const entry of (handle as IterableDirectoryHandle).values()) {
        if (entry.kind !== 'file') continue
        const file = await (entry as FileSystemFileHandle).getFile()
        const lowerName = file.name.toLowerCase()

        if (lowerName === 'care_calendar.md') {
          calendar = await file.text()
        } else if (lowerName === 'briefing.md') {
          briefingOutput = await file.text()
        } else if (!['care_plan.json', 'task.md', 'readme.md'].includes(lowerName) && (/\.(txt|md|csv|json|pdf)$/i.test(file.name) || file.type.startsWith('image/'))) {
          sourceFiles.push(file)
        }
      }

      if (sourceFiles.length) {
        const result = await readSourceFiles(sourceFiles)
        setDocuments(result.documents)
        setFileIssues(result.issues)
        setAnalysisDate(new Date().toISOString().slice(0, 10))
        resetReviewState()
      } else {
        setWorkspaceError('No supported source documents were found in this folder.')
      }

      lastOutputsRef.current = { calendar, briefing: briefingOutput }
      setWorkBuddyArtifacts({
        calendar,
        briefing: briefingOutput,
        lastSynced: new Date().toISOString(),
      })
      setWorkspaceName(handle.name)
    } catch (error) {
      setWorkspaceError(error instanceof Error ? error.message : 'The care folder could not be read.')
    } finally {
      setIsReading(false)
      setIsSyncing(false)
    }
  }

  // Lightweight poll: read only the two WorkBuddy output files and update the
  // preview when they change, without touching source documents or review state.
  async function refreshArtifacts(handle: FileSystemDirectoryHandle) {
    try {
      let calendar: string | undefined
      let briefingOutput: string | undefined
      let fileCount = 0
      let sawCalendar = false
      let sawBriefing = false

      for await (const entry of (handle as IterableDirectoryHandle).values()) {
        if (entry.kind !== 'file') continue
        fileCount += 1
        const lowerName = entry.name.toLowerCase()
        if (lowerName === 'care_calendar.md') {
          sawCalendar = true
          calendar = await (await (entry as FileSystemFileHandle).getFile()).text()
        } else if (lowerName === 'briefing.md') {
          sawBriefing = true
          briefingOutput = await (await (entry as FileSystemFileHandle).getFile()).text()
        }
      }

      // Heartbeat: proves the watcher is alive and shows what it can see, so a
      // hidden .txt extension or empty file is obvious at a glance.
      setWatchStatus({ checkedAt: new Date().toISOString(), fileCount, sawCalendar, sawBriefing })

      const previous = lastOutputsRef.current
      if (calendar === previous.calendar && briefingOutput === previous.briefing) return

      lastOutputsRef.current = { calendar, briefing: briefingOutput }
      setWorkBuddyArtifacts({
        calendar,
        briefing: briefingOutput,
        lastSynced: new Date().toISOString(),
      })
    } catch (error) {
      setWatchStatus({ checkedAt: new Date().toISOString(), error: error instanceof Error ? error.message : 'Folder read failed.' })
    }
  }

  async function writeTaskToWorkspace(handle: FileSystemDirectoryHandle) {
    try {
      await writeWorkspaceFile(handle, 'TASK.md', buildTaskFile(plan.profile.preferredName))
      setTaskWritten(true)
    } catch {
      // Writing the task is a convenience; a read-only folder should not error out.
      setTaskWritten(false)
    }
  }

  // Shared path for a folder we already hold a handle to: persist it, drop the
  // task file in, and import whatever is already there.
  async function activateWorkspace(handle: FileSystemDirectoryHandle) {
    setNeedsPermission(false)
    setWorkspaceHandle(handle)
    setWorkspaceName(handle.name)
    await saveWorkspaceHandle(handle)
    await writeTaskToWorkspace(handle)
    await syncWorkspace(handle)
  }

  async function connectWorkspace() {
    // Returning caregiver whose stored folder just needs permission re-granted:
    // re-grant in place instead of making them find the folder again.
    if (workspaceHandle && needsPermission) {
      const granted = await verifyWorkspacePermission(workspaceHandle, true)
      if (granted) {
        await activateWorkspace(workspaceHandle)
        return
      }
      // Could not re-grant in place (older browser or denied): fall through and
      // let the caregiver re-pick the same folder instead of dead-ending.
    }

    const picker = (window as DirectoryPickerWindow).showDirectoryPicker
    if (!picker) {
      setWorkspaceError('Folder connection needs Chrome or Microsoft Edge. You can still upload files manually.')
      setActiveView('workbuddy')
      return
    }

    try {
      const handle = await picker({ mode: 'readwrite' })
      await activateWorkspace(handle)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setWorkspaceError(error instanceof Error ? error.message : 'Folder access was not granted.')
    }
  }

  // Restore a previously connected folder on load so returning caregivers skip
  // the picker. Skipped for the synthetic demo session so it is never overwritten.
  useEffect(() => {
    if (session.demo) return
    let cancelled = false
    void (async () => {
      const handle = await loadWorkspaceHandle()
      if (!handle || cancelled) return
      const granted = await verifyWorkspacePermission(handle, false)
      if (cancelled) return
      setWorkspaceHandle(handle)
      setWorkspaceName(handle.name)
      if (granted) {
        await writeTaskToWorkspace(handle)
        await syncWorkspace(handle)
      } else {
        setNeedsPermission(true)
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.demo])

  // While connected, watch the folder so WorkBuddy's results appear on their own.
  useEffect(() => {
    if (!workspaceHandle || needsPermission) return
    const kickoff = window.setTimeout(() => void refreshArtifacts(workspaceHandle), 0)
    const interval = window.setInterval(() => {
      void refreshArtifacts(workspaceHandle)
    }, 3000)
    return () => {
      window.clearTimeout(kickoff)
      window.clearInterval(interval)
    }
  }, [workspaceHandle, needsPermission])

  function removeDocument(documentId: string) {
    setDocuments((current) => current.filter((document) => document.id !== documentId))
    resetReviewState()
  }

  function loadDemo() {
    setDocuments(demoDocuments)
    setAnalysisDate('2026-08-09')
    setFileIssues([])
    setWorkspaceError('')
    resetReviewState()
    setActiveView('overview')
  }

  function clearWorkspace() {
    setDocuments([])
    setAnalysisDate(new Date().toISOString().slice(0, 10))
    setFileIssues([])
    setWorkBuddyArtifacts({})
    setWorkspaceHandle(undefined)
    setWorkspaceName(undefined)
    setWorkspaceError('')
    setNeedsPermission(false)
    setTaskWritten(false)
    lastOutputsRef.current = {}
    void clearWorkspaceHandle()
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
        return <DocumentsView plan={plan} issues={fileIssues} isReading={isReading} workspaceName={workspaceName} onConnectFolder={connectWorkspace} onFiles={handleFiles} onOpenSource={setSourceDocumentId} onRemove={removeDocument} />
      case 'review':
        return <ReviewView plan={plan} approved={approved} onToggleReviewed={(flagId) => { setReviewedFlagIds((current) => current.includes(flagId) ? current.filter((id) => id !== flagId) : [...current, flagId]); setApproved(false) }} onApprove={() => setApproved(true)} onOpenSource={setSourceDocumentId} />
      case 'workbuddy':
        return <WorkBuddyView plan={plan} artifacts={workBuddyArtifacts} workspaceName={workspaceName} error={workspaceError} isSyncing={isSyncing} watching={Boolean(workspaceHandle) && !needsPermission} needsPermission={needsPermission} taskWritten={taskWritten} watchStatus={watchStatus} onConnect={connectWorkspace} onSync={() => syncWorkspace()} onWriteTask={() => { if (workspaceHandle) void writeTaskToWorkspace(workspaceHandle) }} />
      default:
        return <Overview plan={plan} briefing={briefing} reviewedCount={reviewedFlagIds.length} workspaceName={workspaceName} onNavigate={navigate} onOpenSource={setSourceDocumentId} />
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
        <div className="sidebar-footer"><p>Tencent Cloud Hackathon 2026</p><span>Age Well &middot; AI Agent Track</span></div>
      </aside>
      {mobileMenuOpen && <button className="mobile-overlay" type="button" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)} />}

      <div className="app-main">
        <header className="topbar">
          <button className="menu-button" type="button" aria-label="Open navigation" onClick={() => setMobileMenuOpen(true)}><Menu size={21} /></button>
          <div className="workspace-identity">
            <span className="profile-avatar">TG</span>
            <div><strong>{plan.profile.preferredName}</strong><span>{plan.profile.age ? `${plan.profile.age} years` : 'Age not provided'} {'\u00b7'} {plan.profile.conditions.join(' \u00b7 ') || 'No conditions listed'}</span></div>
          </div>
          <div className="topbar-actions">
            <span className={`data-chip ${isDemo ? 'synthetic' : ''}`}><ShieldCheck size={14} />{isDemo ? 'Synthetic demo data' : workspaceName ? `${workspaceName} connected` : 'Local review session'}</span>
            <div className="export-menu">
              <button className="primary-button compact" type="button" onClick={() => setExportOpen((open) => !open)}><Download size={16} /> Export <ChevronDown size={14} /></button>
              {exportOpen && <div className="export-popover"><button type="button" onClick={() => { downloadText('care_calendar.md', careCalendarMarkdown(plan)); setExportOpen(false) }}>Care calendar (.md)</button><button type="button" onClick={() => { downloadText('briefing.md', appointmentBriefingMarkdown(plan)); setExportOpen(false) }}>Appointment briefing (.md)</button><button type="button" onClick={() => { downloadText('care_plan.json', JSON.stringify(plan, null, 2), 'application/json'); setExportOpen(false) }}>Evidence bundle (.json)</button></div>}
            </div>
            <button className="account-control" type="button" onClick={onSignOut} title={`Sign out ${session.email}`}><span>{accountInitials}</span><span><strong>{session.name}</strong><small>{session.demo ? 'Demo session' : 'Local account'}</small></span><LogOut size={16} /></button>
          </div>
        </header>
        <main className="content-area">{renderView()}</main>
        <footer className="app-footer"><span>AI-assisted administrative summary &middot; Verify against source documents</span><div><button type="button" onClick={loadDemo}><RefreshCcw size={13} /> Reset demo</button><button type="button" onClick={clearWorkspace}><Trash2 size={13} /> Clear workspace</button></div></footer>
      </div>
      <SourceDrawer document={selectedDocument} onClose={() => setSourceDocumentId(undefined)} />
    </div>
  )
}

function App() {
  const [session, setSession] = useState<AuthSession | undefined>(() => {
    const restoredSession = restoreSession()
    if (restoredSession) return restoredSession
    return new URLSearchParams(window.location.search).get('demo') === '1' ? createDemoSession() : undefined
  })

  if (!session) return <AuthScreen onAuthenticated={setSession} />

  return <WorkspaceApp session={session} onSignOut={() => { clearSession(); setSession(undefined) }} />
}

export default App
