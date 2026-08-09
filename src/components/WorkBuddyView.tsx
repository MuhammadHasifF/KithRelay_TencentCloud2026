import { Bot, Check, Clipboard, CodeXml, Download, ExternalLink, FolderOpen, PackageCheck, Play } from 'lucide-react'
import { useState } from 'react'
import type { CarePlan } from '../types/care'

type WorkBuddyViewProps = {
  plan: CarePlan
}

export function WorkBuddyView({ plan }: WorkBuddyViewProps) {
  const [copied, setCopied] = useState(false)
  const prompt = `Use the carecircle-copilot skill on the selected folder for ${plan.profile.preferredName}. Read every document, reconcile repeated or rescheduled appointments, compare medication lists chronologically, identify payment deadlines, and produce care_calendar.md plus briefing.md. Preserve source filenames for every important item. Do not provide medical advice, do not guess when documents conflict, and require human review before the outputs are shared.`

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="view-stack">
      <div className="view-heading">
        <div><p className="section-kicker"><Bot size={15} /> Agent handoff</p><h2>Run with WorkBuddy</h2><p>The web application is the review surface. WorkBuddy is the autonomous document-processing agent.</p></div>
      </div>
      <section className="agent-relationship">
        <div className="relationship-node"><CodeXml size={22} /><strong>GitHub repository</strong><span>App, skill, fixtures, tests</span></div>
        <span className="relationship-arrow">+</span>
        <div className="relationship-node primary"><Bot size={22} /><strong>WorkBuddy</strong><span>Plans, reads, reconciles, writes</span></div>
        <span className="relationship-arrow">→</span>
        <div className="relationship-node"><Check size={22} /><strong>Human review</strong><span>Verifies before sharing</span></div>
      </section>
      <section className="workbuddy-grid">
        <article className="panel setup-card">
          <p className="overline">One-time setup</p><h3>Install the CareCircle skill</h3>
          <ol className="setup-steps">
            <li><span><Download size={17} /></span><div><strong>Download the skill ZIP</strong><p>Use the packaged artifact from this repository.</p></div></li>
            <li><span><PackageCheck size={17} /></span><div><strong>Import in WorkBuddy</strong><p>Open Skills, choose Import, and select the ZIP.</p></div></li>
            <li><span><FolderOpen size={17} /></span><div><strong>Select a synthetic workspace</strong><p>Choose the folder containing the Mdm Tan demo files.</p></div></li>
            <li><span><Play size={17} /></span><div><strong>Run and verify</strong><p>Compare the generated files with the expected outputs.</p></div></li>
          </ol>
          <a className="primary-button full" href="./downloads/carecircle-copilot-workbuddy.zip" download><Download size={17} /> Download WorkBuddy skill</a>
        </article>
        <article className="panel prompt-card">
          <div className="panel-heading"><div><span className="panel-icon"><Clipboard size={18} /></span><div><p className="overline">Demo task</p><h3>Copy this into WorkBuddy</h3></div></div></div>
          <pre>{prompt}</pre>
          <button className="secondary-button full" type="button" onClick={copyPrompt}>{copied ? <Check size={17} /> : <Clipboard size={17} />}{copied ? 'Copied' : 'Copy task prompt'}</button>
          <a className="text-link" href="https://www.workbuddy.ai/docs/workbuddy/" target="_blank" rel="noreferrer">Official WorkBuddy documentation <ExternalLink size={14} /></a>
        </article>
      </section>
      <div className="agent-note"><Bot size={18} /><p><strong>What makes this an agent:</strong> the skill defines goals and safety boundaries; WorkBuddy chooses how to inspect the authorized files, reconciles evidence across them, and writes verifiable artifacts. The companion app makes those findings understandable and reviewable.</p></div>
    </div>
  )
}
