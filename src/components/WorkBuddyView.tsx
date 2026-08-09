import {
  Bot,
  Check,
  CircleCheck,
  Clipboard,
  Download,
  ExternalLink,
  Eye,
  FolderCheck,
  FolderSync,
  Laptop,
  PackageCheck,
  RefreshCcw,
  Save,
  Waypoints,
} from 'lucide-react'
import { useState } from 'react'
import type { CarePlan } from '../types/care'
import { buildWorkBuddyTask } from '../lib/workbuddy'

export type WorkBuddyArtifacts = {
  calendar?: string
  briefing?: string
  lastSynced?: string
}

type WorkBuddyViewProps = {
  plan: CarePlan
  artifacts: WorkBuddyArtifacts
  workspaceName?: string
  error: string
  isSyncing: boolean
  watching?: boolean
  needsPermission?: boolean
  taskWritten?: boolean
  watchStatus?: { checkedAt?: string; fileCount?: number; sawCalendar?: boolean; sawBriefing?: boolean; error?: string }
  onConnect: () => void
  onSync: () => void
  onWriteTask?: () => void
}

export function WorkBuddyView({ plan, artifacts, workspaceName, error, isSyncing, watching, needsPermission, taskWritten, watchStatus, onConnect, onSync, onWriteTask }: WorkBuddyViewProps) {
  const [copied, setCopied] = useState(false)
  const prompt = buildWorkBuddyTask(plan.profile.preferredName)
  const connected = Boolean(workspaceName) && !needsPermission
  const outputsReady = Boolean(artifacts.calendar || artifacts.briefing)

  const heroTitle = needsPermission ? `Reconnect ${workspaceName}` : connected ? workspaceName : 'Connect the care folder once'
  const heroCopy = needsPermission
    ? 'Your care folder is remembered. Grant access again to resume automatic syncing.'
    : connected
      ? `${plan.documents.length} source documents are available in this website. Run WorkBuddy on the same folder and the results sync back here on their own.`
      : 'Choose the folder containing the care documents. KithRelay reads it in the browser, saves the task into it, and WorkBuddy can process that exact folder in the desktop app.'
  const connectLabel = needsPermission ? 'Reconnect folder' : connected ? 'Change folder' : 'Connect folder'

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="view-stack">
      <div className="view-heading">
        <div><p className="section-kicker"><Bot size={15} /> Desktop agent connection</p><h2>WorkBuddy sync</h2><p>KithRelay and WorkBuddy use the same care folder, so sources and generated results stay together.</p></div>
        <span className={`connection-badge ${connected ? 'connected' : ''}`}>{connected ? <CircleCheck size={15} /> : <FolderSync size={15} />}{connected ? 'Folder connected' : 'Setup needed'}</span>
      </div>

      <section className={`connection-hero ${connected ? 'connected' : ''}`}>
        <div className="connection-hero-icon">{connected ? <FolderCheck size={29} /> : <FolderSync size={29} />}</div>
        <div className="connection-hero-copy">
          <p className="overline">Shared workspace</p>
          <h3>{heroTitle}</h3>
          <p>{heroCopy}</p>
          {artifacts.lastSynced && <small>Last checked {new Date(artifacts.lastSynced).toLocaleString()}</small>}
          {error && <p className="connection-error" role="alert">{error}</p>}
        </div>
        <div className="connection-actions">
          <button className="primary-button" type="button" onClick={onConnect}><FolderSync size={17} />{connectLabel}</button>
          {connected && <button className="secondary-button" type="button" disabled={isSyncing} onClick={onSync}><RefreshCcw size={17} />{isSyncing ? 'Syncing…' : 'Check now'}</button>}
          <a className="secondary-button" href="workbuddy-ai://"><Laptop size={17} /> Open WorkBuddy</a>
        </div>
      </section>

      <section className="relay-flow" aria-label="Connected workflow">
        <div className={connected ? 'complete' : 'active'}><span>1</span><strong>Connect once</strong><small>Folder + task saved for you</small></div>
        <i />
        <div className={connected && !outputsReady ? 'active' : outputsReady ? 'complete' : ''}><span>2</span><strong>Run WorkBuddy</strong><small>Open the same folder</small></div>
        <i />
        <div className={outputsReady ? 'complete' : ''}><span>3</span><strong>Results sync automatically</strong><small>They appear below on their own</small></div>
      </section>

      <section className="workbuddy-grid">
        <article className="panel setup-card">
          <div className="panel-heading"><div><span className="panel-icon"><PackageCheck size={18} /></span><div><p className="overline">One-time setup</p><h3>KithRelay skill</h3></div></div><span className="status-chip current">Package ready</span></div>
          <ol className="compact-steps">
            <li><span>1</span><p><strong>Open WorkBuddy</strong>Select New Task and the connected folder.</p></li>
            <li><span>2</span><p><strong>Enable KithRelay</strong>Import the package first if the skill is not installed.</p></li>
            <li><span>3</span><p><strong>Run the saved task</strong>KithRelay already wrote it into the folder as TASK.md.</p></li>
            <li><span>4</span><p><strong>Leave it running</strong>KithRelay imports both results here automatically.</p></li>
          </ol>
          <div className="setup-links"><a className="secondary-button full" href="./downloads/kithrelay-workbuddy.zip" download><Download size={17} /> Download skill again</a><a className="text-link" href="https://www.workbuddy.ai/docs/workbuddy/Create-Task" target="_blank" rel="noreferrer">Official task guide <ExternalLink size={14} /></a></div>
        </article>

        <article className="panel prompt-card">
          <div className="panel-heading"><div><span className="panel-icon"><Clipboard size={18} /></span><div><p className="overline">Ready-made instruction</p><h3>Task for WorkBuddy</h3></div></div>{taskWritten && <span className="status-chip current"><Check size={14} /> Saved as TASK.md</span>}</div>
          <pre>{prompt}</pre>
          <p className="prompt-hint">When a folder is connected, KithRelay saves this into it as TASK.md, so there is nothing to paste.</p>
          <div className="prompt-actions">
            <button className="primary-button full" type="button" onClick={copyPrompt}>{copied ? <Check size={17} /> : <Clipboard size={17} />}{copied ? 'Copied to clipboard' : 'Copy task'}</button>
            {onWriteTask && <button className="secondary-button full" type="button" disabled={!connected} onClick={onWriteTask}>{taskWritten ? <Check size={17} /> : <Save size={17} />}{taskWritten ? 'Saved to folder' : 'Save task into folder'}</button>}
          </div>
        </article>
      </section>

      <section className="agent-results">
        <div className="panel-heading"><div><span className="panel-icon"><Waypoints size={18} /></span><div><p className="overline">Synced from the shared folder</p><h3>WorkBuddy results</h3></div></div><span className={`connection-badge ${outputsReady ? 'connected' : ''}`}>{outputsReady ? <><CircleCheck size={15} /> Results received</> : watching ? <><Eye size={15} /> Watching folder…</> : <><RefreshCcw size={15} /> Waiting for files</>}</span></div>
        {watching && (
          <p className={`watch-status ${watchStatus?.error ? 'error' : ''}`}>
            {watchStatus?.error
              ? `Watch error: ${watchStatus.error}`
              : watchStatus?.checkedAt
                ? `Watching · ${watchStatus.fileCount ?? 0} files in folder · care_calendar.md ${watchStatus.sawCalendar ? 'found ✓' : 'not found ✗'} · briefing.md ${watchStatus.sawBriefing ? 'found ✓' : 'not found ✗'} · last checked ${new Date(watchStatus.checkedAt).toLocaleTimeString()}`
                : 'Starting folder watch…'}
          </p>
        )}
        <div className="artifact-grid">
          <article className={artifacts.calendar ? 'ready' : ''}><strong>care_calendar.md</strong><span>{artifacts.calendar ? 'Synced and ready to review' : 'WorkBuddy has not written this file yet'}</span>{artifacts.calendar && <details><summary>Preview result</summary><pre>{artifacts.calendar}</pre></details>}</article>
          <article className={artifacts.briefing ? 'ready' : ''}><strong>briefing.md</strong><span>{artifacts.briefing ? 'Synced and ready to review' : 'WorkBuddy has not written this file yet'}</span>{artifacts.briefing && <details><summary>Preview result</summary><pre>{artifacts.briefing}</pre></details>}</article>
        </div>
      </section>

      <div className="agent-note"><Bot size={18} /><p><strong>How the connection works:</strong> browsers cannot silently control desktop applications, so the authorized folder is the secure bridge. KithRelay remembers it, writes the task into it as TASK.md, and imports WorkBuddy&apos;s results automatically. The documents never leave your computer.</p></div>
    </div>
  )
}
