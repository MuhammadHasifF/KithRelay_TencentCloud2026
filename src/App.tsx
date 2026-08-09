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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import {
  forgetWorkspaceHandle,
  loadWorkspaceHandle,
  queryWorkspacePermission,
  requestWorkspacePermission,
  saveWorkspaceHandle,
  scanWorkspace,
} from './lib/workspace'
import type { SourceDocument } from './types/care'

type ViewKey = 'overview' | 'calendar' | 'medications' | 'documents' | 'review' | 'workbuddy'

type DirectoryPickerWindow = Window & {
  showDirectoryPicker?: (options?: { mode?: 'read' | 'readwrite' }) => Promise<FileSystemDirectoryHandle>
}

type WorkspaceConnectionStatus = 'restoring' | 'disconnected' | 'permission-needed' | 'connected' | 'unsupported'

type WorkspaceSyncOptions = {
  background?: boolean
  forceSources?: boolean
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
  const [workspaceStatus, setWorkspaceStatus] = useState<WorkspaceConnectionStatus>('restoring')
  const [workspaceNotice, setWorkspaceNotice] = useState('')
  const [workspaceError, setWorkspaceError] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)
  const [workBuddyArtifacts, setWorkBuddyArtifacts] = useState<WorkBuddyArtifacts>({})
  const syncInFlightRef = useRef(false)
  const sourceSignatureRef = useRef('')
  const artifactSignatureRef = useRef('')

  const basePlan = useMemo(() => buildCarePlan(documents, analysisDate), [documents, analysisDate])
  const plan = useMemo(() => ({
    ...basePlan,
    flags: basePlan.flags.map((flag) => ({ ...flag, reviewed: reviewedFlagIds.includes(flag.id) })),
  }), [basePlan, reviewedFlagIds])
  const briefing = useMemo(() => buildAppointmentBriefing(plan, analysisDate), [plan, analysisDate])
  const selectedDocument = plan.documents.find((document) => document.id === sourceDocumentId)
  const isDemo = documents.length === demoDocuments.length && documents.every((document, index) => document.id === demoDocuments[index].id)
  const accountInitials = session.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
  const activeWorkspaceName = workspaceStatus === 'connected' ? workspaceName : undefined

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

  const syncWorkspace = useCallback(async (handle: FileSystemDirectoryHandle, options: WorkspaceSyncOptions = {}) => {
    if (syncInFlightRef.current) return

    syncInFlightRef.current = true
    if (!options.background) setIsSyncing(true)
    setWorkspaceError('')

    let readingSources = false

    try {
      const snapshot = await scanWorkspace(handle)
      const sourceChanged = options.forceSources || snapshot.sourceSignature !== sourceSignatureRef.current

      if (sourceChanged) {
        sourceSignatureRef.current = snapshot.sourceSignature

        if (snapshot.sourceFiles.length) {
          readingSources = true
          setIsReading(true)
          const result = await readSourceFiles(snapshot.sourceFiles)
          setDocuments(result.documents)
          setFileIssues(result.issues)
          setAnalysisDate(new Date().toISOString().slice(0, 10))
          setReviewedFlagIds([])
          setApproved(false)
        } else if (!options.background) {
          setWorkspaceError('No supported source documents were found in this folder.')
        }
      }

      const checkedAt = new Date().toISOString()
      const artifactsChanged = snapshot.artifactSignature !== artifactSignatureRef.current
      artifactSignatureRef.current = snapshot.artifactSignature
      setWorkBuddyArtifacts((current) => ({
        calendar: snapshot.calendar?.content,
        calendarFilename: snapshot.calendar?.filename,
        briefing: snapshot.briefing?.content,
        briefingFilename: snapshot.briefing?.filename,
        lastChecked: checkedAt,
        receivedAt: artifactsChanged && snapshot.artifactSignature ? checkedAt : current.receivedAt,
      }))
      setWorkspaceName(handle.name)
      setWorkspaceStatus('connected')
    } catch (error) {
      if (error instanceof DOMException && ['NotAllowedError', 'SecurityError'].includes(error.name)) {
        setWorkspaceStatus('permission-needed')
        setWorkspaceError('Folder permission expired. Reconnect the remembered folder to continue.')
      } else {
        setWorkspaceError(error instanceof Error ? error.message : 'The care folder could not be read.')
      }
    } finally {
      if (readingSources) setIsReading(false)
      if (!options.background) setIsSyncing(false)
      syncInFlightRef.current = false
    }
  }, [])

  useEffect(() => {
    let active = true

    async function restoreWorkspace() {
      try {
        const handle = await loadWorkspaceHandle()
        if (!active) return

        if (!handle) {
          setWorkspaceStatus('disconnected')
          return
        }

        setWorkspaceHandle(handle)
        setWorkspaceName(handle.name)
        const permission = await queryWorkspacePermission(handle)
        if (!active) return

        if (permission === 'granted') {
          setWorkspaceStatus('connected')
          setWorkspaceNotice('Remembered folder restored automatically in this browser.')
          await syncWorkspace(handle, { forceSources: true })
        } else {
          setWorkspaceStatus('permission-needed')
          setWorkspaceNotice('Folder remembered. Reconnect once to restore browser permission.')
        }
      } catch {
        if (!active) return
        setWorkspaceStatus('disconnected')
        setWorkspaceNotice('Folder memory is unavailable in this browser. You can still connect it for this session.')
      }
    }

    void restoreWorkspace()
    return () => { active = false }
  }, [syncWorkspace])

  useEffect(() => {
    if (!workspaceHandle || workspaceStatus !== 'connected') return

    const checkForUpdates = () => {
      if (document.visibilityState === 'visible') {
        void syncWorkspace(workspaceHandle, { background: true })
      }
    }
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') checkForUpdates()
    }
    const interval = window.setInterval(checkForUpdates, 5000)

    window.addEventListener('focus', checkForUpdates)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', checkForUpdates)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [syncWorkspace, workspaceHandle, workspaceStatus])

  // Drop the ready-to-run task into the connected folder so the caregiver never
  // has to paste it. Best-effort: a read-only folder simply skips this.
  async function writeTaskToWorkspace(handle: FileSystemDirectoryHandle) {
    try {
      await writeWorkspaceFile(handle, 'TASK.md', buildTaskFile(plan.profile.preferredName))
    } catch {
      // Writing the task is a convenience; a failure here should never block the app.
    }
  }

  async function connectWorkspace() {
    const picker = (window as DirectoryPickerWindow).showDirectoryPicker
    if (!picker) {
      setWorkspaceError('Folder connection needs Chrome or Microsoft Edge. You can still upload files manually.')
      setWorkspaceStatus('unsupported')
      setActiveView('workbuddy')
      return
    }

    try {
      // Request readwrite so KithRelay can drop TASK.md into the folder; reading
      // the results back only relies on the read half of that grant.
      const handle = await picker({ mode: 'readwrite' })
      setWorkspaceHandle(handle)
      setWorkspaceName(handle.name)
      setWorkspaceStatus('connected')
      setWorkspaceNotice('This folder will be remembered in this browser when supported.')
      try {
        await saveWorkspaceHandle(handle)
      } catch {
        setWorkspaceNotice('Folder connected for this session; this browser could not remember it.')
      }
      await writeTaskToWorkspace(handle)
      await syncWorkspace(handle, { forceSources: true })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setWorkspaceError(error instanceof Error ? error.message : 'Folder access was not granted.')
    }
  }

  async function reconnectWorkspace() {
    if (!workspaceHandle) {
      await connectWorkspace()
      return
    }

    try {
      const permission = await requestWorkspacePermission(workspaceHandle)
      if (permission !== 'granted') {
        setWorkspaceStatus('permission-needed')
        setWorkspaceError('Folder permission was not granted. Reconnect when you are ready.')
        return
      }

      setWorkspaceStatus('connected')
      setWorkspaceNotice('Remembered folder reconnected. Automatic result checks are active.')
      await syncWorkspace(workspaceHandle, { forceSources: true })
    } catch (error) {
      setWorkspaceError(error instanceof Error ? error.message : 'The remembered folder could not be reconnected.')
    }
  }

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

  async function clearWorkspace() {
    setDocuments([])
    setAnalysisDate(new Date().toISOString().slice(0, 10))
    setFileIssues([])
    setWorkBuddyArtifacts({})
    setWorkspaceHandle(undefined)
    setWorkspaceName(undefined)
    setWorkspaceStatus('disconnected')
    setWorkspaceNotice('')
    setWorkspaceError('')
    sourceSignatureRef.current = ''
    artifactSignatureRef.current = ''
    await forgetWorkspaceHandle().catch(() => undefined)
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
        return <DocumentsView plan={plan} issues={fileIssues} isReading={isReading} workspaceName={activeWorkspaceName} onConnectFolder={connectWorkspace} onFiles={handleFiles} onOpenSource={setSourceDocumentId} onRemove={removeDocument} />
      case 'review':
        return <ReviewView plan={plan} approved={approved} onToggleReviewed={(flagId) => { setReviewedFlagIds((current) => current.includes(flagId) ? current.filter((id) => id !== flagId) : [...current, flagId]); setApproved(false) }} onApprove={() => setApproved(true)} onOpenSource={setSourceDocumentId} />
      case 'workbuddy':
        return <WorkBuddyView plan={plan} artifacts={workBuddyArtifacts} workspaceName={workspaceName} workspaceStatus={workspaceStatus} notice={workspaceNotice} error={workspaceError} isSyncing={isSyncing} onConnect={connectWorkspace} onReconnect={reconnectWorkspace} onSync={() => workspaceHandle && syncWorkspace(workspaceHandle)} />
      default:
        return <Overview plan={plan} briefing={briefing} reviewedCount={reviewedFlagIds.length} workspaceName={activeWorkspaceName} onNavigate={navigate} onOpenSource={setSourceDocumentId} />
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
            <div><strong>{plan.profile.preferredName}</strong><span>{plan.profile.age ? `${plan.profile.age} years` : 'Age not provided'} {'·'} {plan.profile.conditions.join(' · ') || 'No conditions listed'}</span></div>
          </div>
          <div className="topbar-actions">
            <span className={`data-chip ${isDemo ? 'synthetic' : ''}`}><ShieldCheck size={14} />{isDemo ? 'Synthetic demo data' : activeWorkspaceName ? `${activeWorkspaceName} connected` : 'Local review session'}</span>
            <div className="export-menu">
              <button className="primary-button compact" type="button" onClick={() => setExportOpen((open) => !open)}><Download size={16} /> Export <ChevronDown size={14} /></button>
              {exportOpen && <div className="export-popover"><button type="button" onClick={() => { downloadText('care_calendar.md', careCalendarMarkdown(plan)); setExportOpen(false) }}>Care calendar (.md)</button><button type="button" onClick={() => { downloadText('briefing.md', appointmentBriefingMarkdown(plan)); setExportOpen(false) }}>Appointment briefing (.md)</button><button type="button" onClick={() => { downloadText('care_plan.json', JSON.stringify(plan, null, 2), 'application/json'); setExportOpen(false) }}>Evidence bundle (.json)</button></div>}
            </div>
            <button className="account-control" type="button" onClick={onSignOut} title={`Sign out ${session.email}`}><span>{accountInitials}</span><span><strong>{session.name}</strong><small>{session.demo ? 'Demo session' : 'Local account'}</small></span><LogOut size={16} /></button>
          </div>
        </header>
        <main className="content-area">{renderView()}</main>
        <footer className="app-footer"><span>AI-assisted administrative summary &middot; Verify against source documents</span><div><button type="button" onClick={loadDemo}><RefreshCcw size={13} /> Reset demo</button><button type="button" onClick={() => void clearWorkspace()}><Trash2 size={13} /> Clear workspace</button></div></footer>
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
