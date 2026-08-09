import {
  Bot,
  Check,
  CircleCheck,
  Clipboard,
  Download,
  ExternalLink,
  FolderCheck,
  FolderSync,
  Laptop,
  PackageCheck,
  RefreshCcw,
  Waypoints,
} from 'lucide-react'
import { useState } from 'react'
import type { CarePlan } from '../types/care'

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
  onConnect: () => void
  onSync: () => void
}

export function WorkBuddyView({ plan, artifacts, workspaceName, error, isSyncing, onConnect, onSync }: WorkBuddyViewProps) {
  const [copied, setCopied] = useState(false)
  const prompt = `Use the kithrelay skill on this folder for ${plan.profile.preferredName}. Read every source document, reconcile repeated or rescheduled appointments, compare medication lists chronologically, identify payment deadlines, and write care_calendar.md plus briefing.md into this same folder. Preserve source filenames for every important item. Do not provide medical advice, do not guess when documents conflict, and require human review before anything is shared.`
  const connected = Boolean(workspaceName)
  const outputsReady = Boolean(artifacts.calendar || artifacts.briefing)

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
          <h3>{connected ? workspaceName : 'Connect the care folder once'}</h3>
          <p>{connected ? `${plan.documents.length} source documents are available in this website. Run WorkBuddy on the same folder, then sync its two result files here.` : 'Choose the folder containing the care documents. KithRelay reads it in the browser; WorkBuddy can process that exact folder in the desktop app.'}</p>
          {artifacts.lastSynced && <small>Last checked {new Date(artifacts.lastSynced).toLocaleString()}</small>}
          {error && <p className="connection-error" role="alert">{error}</p>}
        </div>
        <div className="connection-actions">
          <button className="primary-button" type="button" onClick={onConnect}><FolderSync size={17} />{connected ? 'Change folder' : 'Connect folder'}</button>
          {connected && <button className="secondary-button" type="button" disabled={isSyncing} onClick={onSync}><RefreshCcw size={17} />{isSyncing ? 'Syncing…' : 'Sync results'}</button>}
          <a className="secondary-button" href="workbuddy-ai://"><Laptop size={17} /> Open WorkBuddy</a>
        </div>
      </section>

      <section className="relay-flow" aria-label="Connected workflow">
        <div className={connected ? 'complete' : 'active'}><span>1</span><strong>Connect folder</strong><small>Grant browser read access</small></div>
        <i />
        <div className={connected && !outputsReady ? 'active' : outputsReady ? 'complete' : ''}><span>2</span><strong>Run WorkBuddy</strong><small>Select the same folder</small></div>
        <i />
        <div className={outputsReady ? 'complete' : ''}><span>3</span><strong>Sync and review</strong><small>Results appear below</small></div>
      </section>

      <section className="workbuddy-grid">
        <article className="panel setup-card">
          <div className="panel-heading"><div><span className="panel-icon"><PackageCheck size={18} /></span><div><p className="overline">One-time setup</p><h3>KithRelay skill</h3></div></div><span className="status-chip current">Package ready</span></div>
          <ol className="compact-steps">
            <li><span>1</span><p><strong>Open WorkBuddy</strong>Select New Task and the connected folder.</p></li>
            <li><span>2</span><p><strong>Enable KithRelay</strong>Import the package first if the skill is not installed.</p></li>
            <li><span>3</span><p><strong>Paste the task</strong>WorkBuddy writes both outputs to the folder.</p></li>
            <li><span>4</span><p><strong>Return and sync</strong>KithRelay displays the latest results here.</p></li>
          </ol>
          <div className="setup-links"><a className="secondary-button full" href="./downloads/kithrelay-workbuddy.zip" download><Download size={17} /> Download skill again</a><a className="text-link" href="https://www.workbuddy.ai/docs/workbuddy/Create-Task" target="_blank" rel="noreferrer">Official task guide <ExternalLink size={14} /></a></div>
        </article>

        <article className="panel prompt-card">
          <div className="panel-heading"><div><span className="panel-icon"><Clipboard size={18} /></span><div><p className="overline">Ready-made instruction</p><h3>Task for WorkBuddy</h3></div></div></div>
          <pre>{prompt}</pre>
          <button className="primary-button full" type="button" onClick={copyPrompt}>{copied ? <Check size={17} /> : <Clipboard size={17} />}{copied ? 'Copied to clipboard' : 'Copy WorkBuddy task'}</button>
        </article>
      </section>

      <section className="agent-results">
        <div className="panel-heading"><div><span className="panel-icon"><Waypoints size={18} /></span><div><p className="overline">Synced from the shared folder</p><h3>WorkBuddy results</h3></div></div><span className={`connection-badge ${outputsReady ? 'connected' : ''}`}>{outputsReady ? <CircleCheck size={15} /> : <RefreshCcw size={15} />}{outputsReady ? 'Results received' : 'Waiting for files'}</span></div>
        <div className="artifact-grid">
          <article className={artifacts.calendar ? 'ready' : ''}><strong>care_calendar.md</strong><span>{artifacts.calendar ? 'Synced and ready to review' : 'WorkBuddy has not written this file yet'}</span>{artifacts.calendar && <details><summary>Preview result</summary><pre>{artifacts.calendar}</pre></details>}</article>
          <article className={artifacts.briefing ? 'ready' : ''}><strong>briefing.md</strong><span>{artifacts.briefing ? 'Synced and ready to review' : 'WorkBuddy has not written this file yet'}</span>{artifacts.briefing && <details><summary>Preview result</summary><pre>{artifacts.briefing}</pre></details>}</article>
        </div>
      </section>

      <div className="agent-note"><Bot size={18} /><p><strong>How the connection works:</strong> browsers cannot silently control desktop applications. The authorized folder is the secure bridge: both KithRelay and WorkBuddy read the same sources, and KithRelay imports WorkBuddy&apos;s generated files when you select Sync results.</p></div>
    </div>
  )
}
