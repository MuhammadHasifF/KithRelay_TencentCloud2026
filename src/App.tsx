import { HeartHandshake } from 'lucide-react'

function App() {
  return (
    <main className="shell">
      <section className="welcome-card">
        <div className="brand-mark" aria-hidden="true">
          <HeartHandshake size={28} strokeWidth={1.8} />
        </div>
        <p className="eyebrow">Tencent Cloud Hackathon 2026</p>
        <h1>CareCircle Copilot</h1>
        <p>
          A safer way to turn scattered eldercare paperwork into one clear,
          traceable plan.
        </p>
      </section>
    </main>
  )
}

export default App

