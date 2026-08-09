import {
  Bot,
  Check,
  CircleCheck,
  Clipboard,
  Clock3,
  Download,
  ExternalLink,
  FolderCheck,
  FolderSync,
  Laptop,
  LoaderCircle,
  PackageCheck,
  RefreshCcw,
  ShieldCheck,
  Waypoints,
} from 'lucide-react'
import { useState } from 'react'
import type { CarePlan } from '../types/care'

export type WorkBuddyArtifacts = {
  calendar?: string
  calendarFilename?: string
  briefing?: string
  briefingFilename?: string
  lastChecked?: string
  receivedAt?: string
}

export type WorkspaceConnectionStatus = 'restoring' | 'disconnected' | 'permission-needed' | 'connected' | 'unsupported'

type WorkBuddyViewProps = {
  plan: CarePlan
  artifacts: WorkBuddyArtifacts
  workspaceName?: string
  workspaceStatus: WorkspaceConnectionStatus
  notice: string
  error: string
  isSyncing: boolean
  onConnect: () => void
  onReconnect: () => void
  onSync: () => void
}

export function WorkBuddyView({
  plan,
  artifacts,
  workspaceName,
  workspaceStatus,
  notice,
  error,
  isSyncing,
  onConnect,
  onReconnect,
  onSync,
}: WorkBuddyViewProps) {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState('')
  const prompt = `Use the installed kithrelay skill in this folder for ${plan.profile.preferredName}. Process every source document and write the required care calendar and briefing drafts. Stop and report uncertainty if the files may concern more than one senior.`
  const connected = workspaceStatus === 'connected'
  const permissionNeeded = workspaceStatus === 'permission-needed'
  const outputCount = Number(Boolean(artifacts.calendar)) + Number(Boolean(artifacts.briefing))
  const outputsReady = outputCount === 2
  const outputsPartial = outputCount === 1

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setCopyError('')
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopyError('Clipboard access was blocked. Select and copy the task text below.')
    }
  }

  function connectionBadge() {
    if (workspaceStatus === 'restoring') return <span className="connection-badge"><LoaderCircle className="spin" size={15} /> Restoring folder</span>
    if (permissionNeeded) return <span className="connection-badge attention"><Clock3 size={15} /> Reconnect needed</span>
    if (connected && outputsReady) return <span className="connection-badge connected"><CircleCheck size={15} /> Results ready</span>
    if (connected) return <span className="connection-badge connected"><RefreshCcw className="soft-spin" size={15} /> Auto-sync active</span>
    return <span className="connection-badge"><FolderSync size={15} /> Setup needed</span>
  }

  const heroTitle = permissionNeeded
    ? `Reconnect ${workspaceName ?? 'the remembered folder'}`
    : connected
      ? outputsReady
        ? 'Both WorkBuddy drafts are ready'
        : `Watching ${workspaceName}`
      : 'Connect the care folder once'

  const heroDescription = permissionNeeded
    ? 'KithRelay remembers this folder, but the browser requires a fresh permission check before reading it again.'
    : connected
      ? outputsReady
        ? 'KithRelay detected the latest calendar and briefing automatically. Open either draft below and verify it against the source documents.'
        : 'Keep this page open while WorkBuddy runs. KithRelay checks the folder every five seconds and imports the newest result files automatically.'
      : 'Choose the folder containing the care documents. KithRelay remembers the folder where supported and uses read-only browser access.'

  return (
    <div className="view-stack">
      <div className="view-heading">
        <div><p className="section-kicker"><Bot size={15} /> Desktop agent connection</p><h2>WorkBuddy sync</h2><p>One authorized folder connects KithRelay&apos;s review workspace with the installed WorkBuddy skill.</p></div>
        {connectionBadge()}
      </div>

      <section className={`connection-hero ${connected ? 'connected' : ''} ${permissionNeeded ? 'permission-needed' : ''}`}>
        <div className="connection-hero-icon">{connected ? <FolderCheck size={29} /> : permissionNeeded ? <Clock3 size={29} /> : <FolderSync size={29} />}</div>
        <div className="connection-hero-copy">
          <p className="overline">Remembered workspace</p>
          <h3>{heroTitle}</h3>
          <p>{heroDescription}</p>
          {artifacts.lastChecked && <small>Last automatic check {new Date(artifacts.lastChecked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</small>}
          {notice && <p className="connection-notice"><ShieldCheck size={14} /> {notice}</p>}
          {error && <p className="connection-error" role="alert">{error}</p>}
        </div>
        <div className="connection-actions">
          {permissionNeeded
            ? <button className="primary-button" type="button" onClick={onReconnect}><FolderCheck size={17} /> Reconnect folder</button>
            : <button className={connected ? 'secondary-button' : 'primary-button'} type="button" onClick={onConnect}><FolderSync size={17} />{connected ? 'Change folder' : 'Connect folder'}</button>}
          {connected && <button className="secondary-button" type="button" disabled={isSyncing} onClick={onSync}><RefreshCcw className={isSyncing ? 'spin' : ''} size={17} />{isSyncing ? 'Checking…' : 'Check now'}</button>}
          {connected && <a className="secondary-button" href="workbuddy-ai://" onClick={() => void copyPrompt()}><Laptop size={17} /> Copy task &amp; open</a>}
        </div>
      </section>

      <section className="relay-flow" aria-label="Connected workflow">
        <div className={connected ? 'complete' : 'active'}><span>1</span><strong>Connect once</strong><small>Folder remembered in this browser</small></div>
        <i />
        <div className={connected && !outputsReady ? 'active' : outputsReady ? 'complete' : ''}><span>2</span><strong>Run WorkBuddy</strong><small>One click copies the short task</small></div>
        <i />
        <div className={outputsReady ? 'complete' : outputsPartial ? 'active' : ''}><span>3</span><strong>Review results</strong><small>Newest drafts appear automatically</small></div>
      </section>

      <section className="workbuddy-grid">
        <article className="panel setup-card">
          <div className="panel-heading"><div><span className="panel-icon"><PackageCheck size={18} /></span><div><p className="overline">One-time setup</p><h3>Connected workflow</h3></div></div><span className="status-chip current">Skill installed once</span></div>
          <ol className="compact-steps">
            <li><span>1</span><p><strong>Connect the folder</strong>KithRelay remembers its handle where the browser permits.</p></li>
            <li><span>2</span><p><strong>Install KithRelay once</strong>The user-level skill remains available across WorkBuddy projects.</p></li>
            <li><span>3</span><p><strong>Copy task &amp; open</strong>Select the same folder in a new WorkBuddy task, paste, and start.</p></li>
            <li><span>4</span><p><strong>Leave this page open</strong>The latest two result drafts appear without another sync step.</p></li>
          </ol>
          <div className="setup-links"><a className="secondary-button full" href="./downloads/kithrelay-workbuddy.zip" download><Download size={17} /> Download skill package</a><a className="text-link" href="https://www.workbuddy.ai/docs/workbuddy/Create-Task" target="_blank" rel="noreferrer">Official task guide <ExternalLink size={14} /></a></div>
        </article>

        <article className="panel prompt-card">
          <div className="panel-heading"><div><span className="panel-icon"><Clipboard size={18} /></span><div><p className="overline">Skill-aware instruction</p><h3>Short task for WorkBuddy</h3></div></div></div>
          <p className="task-helper">The installed skill already contains the complete reconciliation workflow, evidence contract, and safety boundaries.</p>
          <pre>{prompt}</pre>
          <div className="prompt-actions">
            <a className="primary-button full" href="workbuddy-ai://" onClick={() => void copyPrompt()}><Laptop size={17} /> Copy task &amp; open WorkBuddy</a>
            <button className="secondary-button full" type="button" onClick={() => void copyPrompt()}>{copied ? <Check size={17} /> : <Clipboard size={17} />}{copied ? 'Copied to clipboard' : 'Copy only'}</button>
          </div>
          {copyError && <p className="connection-error" role="alert">{copyError}</p>}
        </article>
      </section>

      <section className={`agent-results ${outputsReady ? 'ready' : outputsPartial ? 'partial' : ''}`}>
        <div className="panel-heading"><div><span className="panel-icon"><Waypoints size={18} /></span><div><p className="overline">Automatically detected from the shared folder</p><h3>WorkBuddy results</h3></div></div><span className={`connection-badge ${outputsReady ? 'connected' : outputsPartial ? 'attention' : ''}`}>{outputsReady ? <CircleCheck size={15} /> : outputsPartial ? <Clock3 size={15} /> : <RefreshCcw size={15} />}{outputsReady ? '2 of 2 ready' : outputsPartial ? '1 of 2 ready' : 'Waiting for files'}</span></div>
        <div className="artifact-grid">
          <article className={artifacts.calendar ? 'ready' : ''}><strong>{artifacts.calendarFilename ?? 'care_calendar.md'}</strong><span>{artifacts.calendar ? 'Latest calendar draft detected' : 'Waiting for the care calendar draft'}</span>{artifacts.calendar && <details><summary>Preview result</summary><pre>{artifacts.calendar}</pre></details>}</article>
          <article className={artifacts.briefing ? 'ready' : ''}><strong>{artifacts.briefingFilename ?? 'briefing.md'}</strong><span>{artifacts.briefing ? 'Latest appointment briefing detected' : 'Waiting for the appointment briefing draft'}</span>{artifacts.briefing && <details><summary>Preview result</summary><pre>{artifacts.briefing}</pre></details>}</article>
        </div>
      </section>

      <div className="agent-note"><Bot size={18} /><p><strong>Connection boundary:</strong> KithRelay uses read-only browser permission and checks the authorized folder while this page is open. WorkBuddy still runs as the desktop agent and follows its own cloud-processing and privacy settings.</p></div>
    </div>
  )
}
