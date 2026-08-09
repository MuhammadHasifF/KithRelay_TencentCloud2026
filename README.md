# CareCircle Copilot

CareCircle Copilot is a source-linked eldercare paperwork agent for family caregivers. It reconciles appointment letters, dated medication lists, and payment notices into a unified care calendar and a next-visit briefing—while requiring a human to verify important changes before sharing anything.

Built for the Tencent Cloud Hackathon 2026 “Age Well” AI Agent track.

## What the demo proves

- A rescheduled appointment becomes one active event, not two conflicting calendar entries.
- A medication change from Amlodipine 5mg to 10mg is surfaced with both source files.
- Explicitly discontinued and newly listed medicines are distinguished.
- A medicine that merely disappears is marked uncertain, never assumed stopped.
- Payment deadlines are merged into the same timeline.
- Every important finding links back to source evidence.
- Human approval stays locked until important findings are reviewed.

## Project components

| Component | Purpose |
|---|---|
| React companion app | Uploads/reviews text and text-layer PDFs, visualizes reconciliation, preserves evidence, and exports drafts |
| WorkBuddy skill | Gives WorkBuddy the domain workflow, output contracts, and healthcare safety boundaries |
| Deterministic reconciliation engine | Powers the live web demo and regression tests without requiring secrets or paid APIs |
| Synthetic fixture pack | Provides the Mdm Tan story and expected WorkBuddy outputs |
| Automated checks | Tests appointment merging, medication diffs, mixed-patient detection, exports, and review controls |

## Quick start

Requirements: Node.js 22 or newer.

```bash
npm install
npm run dev
```

Open the URL printed by Vite. The application starts with the synthetic Mdm Tan scenario already loaded.

## Validate everything

```bash
npm run check
```

This runs linting, 10 automated tests, the production build, and WorkBuddy skill packaging.

## WorkBuddy workflow

```bash
npm run package:skill
```

Then:

1. Import `artifacts/carecircle-copilot-workbuddy.zip` in WorkBuddy’s Skills area.
2. Select a copy of `fixtures/mdm-tan` as the task workspace.
3. Open the web app’s **WorkBuddy** page and copy the prepared task prompt.
4. Verify WorkBuddy’s `care_calendar.md` and `briefing.md` against `fixtures/expected`.

The skill ZIP is also copied to `public/downloads` so deployed copies of the companion app can provide it directly.

## Deploy

The application is static and needs no server or environment variables.

### Vercel

Import the GitHub repository and keep the detected Vite settings:

- Build command: `npm run build`
- Output directory: `dist`

### Netlify

Import the repository; `netlify.toml` contains the build settings.

### GitHub Pages

Run the **Deploy CareCircle to GitHub Pages** workflow manually after enabling Pages with “GitHub Actions” as its source.

## Safety position

This is an administrative organization tool, not a medical device or medical adviser. The public demo uses synthetic data only. WorkBuddy uses online AI model services, so do not claim that its processing is entirely local or on-device. See [Privacy and Safety](docs/PRIVACY_AND_SAFETY.md).

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Rules and assumptions](docs/RULES_AND_ASSUMPTIONS.md)
- [Evaluation plan](docs/EVALUATION.md)
- [Privacy and safety](docs/PRIVACY_AND_SAFETY.md)
- [Manual handoff steps](docs/MANUAL_STEPS.md)
- [Submission checklist](docs/SUBMISSION_CHECKLIST.md)

## Repository map

```text
src/                    Companion application and reconciliation engine
workbuddy-skill/        Importable CareCircle WorkBuddy skill source
fixtures/mdm-tan/       Synthetic input folder
fixtures/expected/      Reference outputs for WorkBuddy evaluation
artifacts/               Generated submission-ready skill ZIP
docs/                    Architecture, safety, and handoff documentation
scripts/                 Reproducible packaging utilities
```

## License

MIT
