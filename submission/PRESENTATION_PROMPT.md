# KithRelay presentation-generation prompt

## Before using this prompt

Upload these files to ChatGPT together with this prompt:

1. `assets/01-login.png`
2. `assets/02-overview.png`
3. `assets/03-workbuddy-sync.png` — refresh this after deployment so the remembered-folder and auto-sync states are visible
4. `assets/04-review-findings.png`
5. `assets/05-mobile-overview.png`
6. One real screenshot of the KithRelay skill enabled in WorkBuddy Desktop
7. One real screenshot showing WorkBuddy's completed task and the generated `care_calendar.md` and `briefing.md`

Replace these placeholders before sending:

- `[TEAM NAME]`
- `[TEAM MEMBER NAMES AND ROLES]`
- `[CONTACT EMAIL]`
- `[FINAL GITHUB URL]` if the repository is renamed

Do not upload or display real patient information. The supplied KithRelay screenshots use synthetic Mdm Tan data.

## Copy everything below into ChatGPT

```text
You are a senior pitch-deck strategist, information designer, and PowerPoint production specialist. Create a polished, editable Project Introduction Deck for a Singapore university hackathon entry in the Tencent Cloud Hackathon 2026 “Age Well” AI Agent/Skills track.

PROJECT
Name: KithRelay
Tagline: Every care detail, carried forward.
Team: [TEAM NAME]
Team members and roles: [TEAM MEMBER NAMES AND ROLES]
Contact: [CONTACT EMAIL]
Live product: https://kithrelay.vercel.app/
GitHub: https://github.com/MuhammadHasifF/TencentCloud2026_
Track: AI Agent/Skills
Core Tencent product: Tencent WorkBuddy

GOAL
Generate an actual editable .pptx file in 16:9 widescreen format. The deck must make the project understandable in under 6 minutes and explicitly earn points against this preliminary-round rubric:
- Use of AI Tools: 40 points — effectiveness and depth of autonomous planning and tool invocation.
- Impact & Relevance: 30 points — fit to “Age Well,” issue relevance, public engagement, and potential scope.
- Project Quality: 30 points — completeness, interactivity, creativity, technical execution, and overall appeal.

The deck must also contain team information, a clear project overview, and a truthful description of how AI was used.

SOURCE-OF-TRUTH PRODUCT FACTS
- KithRelay helps a family caregiver reconcile one ageing relative’s fragmented appointment letters, dated medication lists, profile notes, and payment notices.
- The WorkBuddy skill inventories every authorized file, checks that the folder concerns one senior, classifies readable files, extracts source-linked facts, reconciles repeated/rescheduled appointments, compares medication lists chronologically, extracts payment deadlines, runs a final evidence check, and writes exactly two review drafts: care_calendar.md and briefing.md.
- The skill does not diagnose, prescribe, recommend treatment, silently resolve uncertainty, contact third parties, or change calendars without explicit approval.
- The browser application provides account access, synthetic demo data, document review, deterministic reconciliation, evidence drawers, a human-review lock, exports, remembered-folder permission, and automatic WorkBuddy result detection while the page is open.
- WorkBuddy and the website connect through one caregiver-authorized shared folder. The website requests read-only access, stores the folder handle in browser IndexedDB where supported, rechecks permission after reload, and checks for new results every five seconds in a visible tab. There is no claim that WorkBuddy is embedded in the browser.
- WorkBuddy performs the agentic folder task. The web application is the reliable review and explanation layer.
- Prototype website accounts are browser-local, not production cloud authentication.
- Selected website files are processed in browser memory. WorkBuddy has separate cloud-processing terms.
- The public demo uses seven synthetic Mdm Tan source documents. Never imply that real patient records were used.
- The tested scenario produces one active Cardiology appointment on 22 Aug 2026, superseding 15 Aug 2026; identifies Amlodipine changing from 5 mg to 10 mg; identifies Vitamin D3 1000 IU as newly listed; records Panadol as explicitly discontinued; finds an SGD 30.00 payment due on 19 Aug 2026; and keeps every finding linked to its source filename.
- The repository currently has 15 passing automated tests covering account gating, appointment merging, medication changes, uncertainty, mixed-patient detection, payment extraction, evidence links, briefing generation, human-review controls, workspace output filtering, timestamped-draft selection, and folder permission recovery.

VERIFIED EXTERNAL EVIDENCE
Use only these supplied facts, with a small source footnote on the relevant slide:
1. A 2024 Duke-NUS study reported that primary informal caregivers in Singapore provided an average of 33 hours of care each week.
2. The same study valued informal caregiving for seniors aged 75+ at about SGD 1.28 billion annually.
3. The same Duke-NUS release states that by 2030 around one in four Singapore citizens, or 24.1%, will be aged 65 and above.
Source URL: https://www.duke-nus.edu.sg/newshub/media-releases/informal-caregiving-for-seniors-valued-at-s1.28-billion-annually

For WorkBuddy behavior, use this official documentation:
- WorkBuddy can take a natural-language goal, autonomously plan and execute, read/process files in a selected working directory, show execution progress, and display generated artifacts.
Source URL: https://www.workbuddy.ai/docs/workbuddy/Create-Task
- WorkBuddy supports creating and installing custom skills for repeatable workflows.
Source URL: https://www.workbuddy.ai/docs/workbuddy/From-Beginner-to-Expert-Guide/Practice-Cases/Create-Skills

DO NOT INVENT OR CLAIM
- Do not call KithRelay a medical device, clinician, diagnostic system, treatment recommender, or replacement for professional care.
- Do not claim clinical validation, hospital deployment, government endorsement, real users, measured time savings, accuracy percentages, market size, revenue, partnerships, or pilots unless explicitly supplied.
- Do not claim fully local or on-device WorkBuddy processing.
- Do not claim cloud-synced user accounts.
- Do not claim a direct WorkBuddy browser API.
- Do not claim event-driven filesystem watching, unattended background operation, a custom button inside WorkBuddy, or automatic task initiation. KithRelay polls only while the page is open, and the caregiver still starts the WorkBuddy task.
- Do not claim “four parallel agents,” multi-agent execution, OCR of every image, Telegram automation, subsidy matching, family-message sending, or automatic calendar changes. Those ideas appeared in early planning but are not proven by the current build.
- Do not fabricate testimonials, quotations, awards, screenshots, interface states, citations, logos, or metrics.
- Do not display real NRICs, phone numbers, addresses, medical record numbers, or patient data.

VISUAL DIRECTION
Create a credible Singapore public-health technology aesthetic inspired by the clarity of HealthHub and SingHealth, but do not copy their layouts, logos, trademarks, or illustrations.

Use this exact design system:
- Background: white #FFFFFF and soft clinical grey #F6F8F9.
- Main text: slate #20343E.
- Secondary text: #60727C.
- Structural teal: #007A78, used sparingly for labels, diagrams, and trust signals.
- Primary action/callout coral: #E45C27.
- Soft teal: #E9F6F4.
- Soft blue: #EDF6FB.
- Soft peach: #FFF1EB.
- Borders: #DCE4E8.
- Typeface: Inter if available; otherwise Aptos or Arial.
- Titles: 30–36 pt, semibold/bold. Body: 18–22 pt. Footnotes: never below 10 pt.
- Use a strict 12-column grid, generous white space, left-aligned content, and consistent 24–32 px internal spacing.
- Use flat cards, thin borders, subtle shadows, and 8–12 px corner radii.
- Use simple line icons from one consistent icon family.
- Never use dark full-slide backgrounds, neon green, decorative gradients, glassmorphism, 3D charts, sci-fi AI brains, robots, glowing circuits, random stock doctors, or generic “AI sparkle” imagery.
- Do not overcrowd slides. Maximum one headline, one clear visual argument, and roughly 35–45 visible words per slide, excluding source notes.
- Preserve uploaded screenshots exactly. Crop proportionally; never stretch, recolor, redraw, regenerate, or invent text inside them. Place screenshots inside clean browser/device frames with readable content.

BUILD 10 CORE SLIDES

SLIDE 1 — COVER
Headline: KithRelay
Subheadline: Every care detail, carried forward.
One-line pitch: “A WorkBuddy-powered care-document agent that turns fragmented paperwork into a source-linked plan a family can verify.”
Include [TEAM NAME], team members, AI Agent/Skills track, and a small live-link label.
Visual: Use the KithRelay node mark or a restrained abstract document-to-handoff line motif. No stock photo.
Speaker note objective: Introduce the invisible administrative burden and promise a working end-to-end demonstration.
Rubric role: Orientation.

SLIDE 2 — WHY THIS MATTERS IN SINGAPORE
Headline: Caregiving already consumes a working week.
Build a clean three-number composition:
- 33 hours/week: average time provided by primary informal caregivers.
- SGD 1.28B/year: estimated value of informal caregiving for seniors aged 75+.
- 1 in 4 by 2030: Singapore citizens expected to be aged 65+.
Add one sentence: “As families coordinate more care, fragmented paperwork becomes a quiet but compounding burden.”
Use a small Duke-NUS citation footer with the full URL in speaker notes and a shortened readable source label on-slide.
Do not turn these numbers into unsupported claims about paperwork specifically.
Speaker note objective: State that KithRelay targets the administrative layer within a broader, verified caregiving burden.
Rubric role: Impact & Relevance.

SLIDE 3 — THE UNSOLVED WORKFLOW GAP
Headline: The information exists. The handoff does not.
Show a before/after flow rather than a competitor attack.
Before: appointment letter + reschedule notice + two medication lists + bill + family profile → repeated dates, hidden changes, missed context.
After: one current calendar + one appointment briefing + source links + human review.
Use the synthetic Mdm Tan scenario and label it clearly as “Synthetic demonstration.”
Include the differentiation statement: “Portals help people access services and records. KithRelay reconciles the family’s own authorized document folder into a reviewable handoff.”
Do not claim that no other product can do this.
Speaker note objective: Explain the exact gap without disparaging HealthHub, LifeSG, AIC, Homage, or other services.
Rubric role: Impact & Relevance.

SLIDE 4 — THE PRODUCT IN ONE VIEW
Headline: One caregiver workspace from source to decision.
Use `02-overview.png` as the dominant visual, cropped so the hero, metrics, appointment, and “What changed” panel are readable.
Add three numbered callouts outside the screenshot:
1. Reconcile repeated events and dated medication lists.
2. Keep every important finding attached to source evidence.
3. Lock approval until the caregiver reviews important changes.
Include a small mobile inset from `05-mobile-overview.png` to prove responsive completeness.
Speaker note objective: Demonstrate that this is an interactive product, not a concept mock-up.
Rubric role: Project Quality.

SLIDE 5 — WHY THIS IS AN AGENT, NOT A CHATBOT
Headline: WorkBuddy plans across a folder, not one pasted message.
Create a left-to-right agent workflow diagram:
Authorized folder → inventory all files → single-senior safety check → classify → extract exact facts → reconcile appointments and medications → evidence check → write care_calendar.md + briefing.md.
Mark WorkBuddy actions as “planning” and “file/tool invocation.”
Include a small real WorkBuddy Desktop screenshot, not a fabricated interface.
Use the official WorkBuddy Create Task source in a footnote.
Do not say “multi-agent” or “parallel agents.”
Speaker note objective: Explicitly connect the demonstrated behavior to the rubric’s 40-point autonomous planning and tool-invocation criterion.
Rubric role: Use of AI Tools.

SLIDE 6 — CONNECTED ARCHITECTURE
Headline: The desktop agent and web reviewer share one authorized workspace.
Draw an accurate three-layer architecture:
Layer 1 — Caregiver-authorized folder: synthetic appointment, medication, profile, and bill documents.
Layer 2A — Tencent WorkBuddy + KithRelay skill: autonomous folder processing and two Markdown outputs.
Layer 2B — Deterministic browser engine: immediate reconciliation and regression-tested fallback/review layer.
Layer 3 — KithRelay web application: remembered read-only folder permission, five-second latest-draft checks while open, evidence display, human review, and export.
Show the shared folder as the bridge; do not draw a nonexistent direct API.
Use `03-workbuddy-sync.png` as a supporting visual.
Add a small tools strip: Tencent WorkBuddy (core agent), React + TypeScript, Vite, Vercel, automated tests.
Speaker note objective: Be transparent about which component performs which role and why the hybrid design is reliable.
Rubric role: Use of AI Tools + Project Quality.

SLIDE 7 — PROOF ON THE GOLDEN SCENARIO
Headline: It catches changes that a simple summary can miss.
Use `04-review-findings.png` as the main visual.
Build a concise evidence table with five rows:
- Appointment: 15 Aug superseded by 22 Aug; both files cited.
- Medication: Amlodipine 5 mg → 10 mg; both dated lists cited.
- New listing: Vitamin D3 1000 IU appears in July.
- Explicit stop: Panadol marked discontinued; not inferred from absence.
- Payment: SGD 30.00 due 19 Aug 2026; bill cited.
Add a proof badge: “15 automated tests passing.”
Do not add accuracy percentages.
Speaker note objective: Show cross-document reasoning, source traceability, and repeatable technical validation.
Rubric role: Project Quality + Use of AI Tools.

SLIDE 8 — SAFETY BY CONSTRUCTION
Headline: Helpful by design; cautious by default.
Create four restrained safety cards:
1. One-senior check: stop and flag possible mixed-patient folders.
2. Uncertainty preserved: missing medication is not assumed discontinued.
3. Human-review lock: important changes must be checked before approval.
4. Administrative boundary: no diagnosis, prescription, treatment, or automatic third-party action.
Add a small privacy note: website files stay in browser memory; public demo is synthetic; WorkBuddy has separate cloud terms.
Use `01-login.png` as a small supporting visual for account access and privacy messaging.
Do not use a shield-heavy cybersecurity visual cliché.
Speaker note objective: Establish trust without overstating compliance, certification, or clinical validation.
Rubric role: Project Quality.

SLIDE 9 — IMPACT PATH
Headline: Start with one family handoff; grow through trusted workflows.
Use a three-stage roadmap with no dates unless supplied:
Now — source-linked appointment, medication, and payment reconciliation for one senior.
Next — caregiver usability testing, multilingual plain-language output, stronger OCR/document support, and production authentication.
Later — consented integrations with calendars or care services, only after privacy/security review and user approval controls.
Add three non-numeric impact hypotheses clearly labeled “To validate”:
- Less time spent manually comparing documents.
- Fewer missed or duplicated administrative details.
- Better-prepared family and clinician conversations.
Do not present hypotheses as measured outcomes.
Speaker note objective: Show credible ambition while keeping the hackathon scope complete and honest.
Rubric role: Impact & Relevance.

SLIDE 10 — CLOSE AND RUBRIC RECAP
Headline: Every care detail, carried forward—with its source.
Use a simple 40 / 30 / 30 recap:
- 40 AI tools: WorkBuddy autonomously processes an authorized folder and writes traceable artifacts.
- 30 impact: reduces invisible administrative load around ageing and family care.
- 30 quality: deployed responsive product, installable skill, remembered shared-folder connection, automatic result detection, human review, exports, and 15 passing tests.
Place a QR code and readable URL for https://kithrelay.vercel.app/ plus the GitHub link and Skill ZIP availability.
End with: “KithRelay supports the caregiver. The caregiver stays in control.”
Speaker note objective: Give judges one memorable sentence and direct them to the working product.

APPENDIX SLIDES
A. Technical validation: summarize the 15 passing tests, supported browser file types, Chrome/Edge folder-handle support, five-second visible-tab polling, permission-reconnect behavior, and the manual WorkBuddy task-start limitation.
B. Sources and disclosures: full URLs for Duke-NUS and WorkBuddy documentation; synthetic-data disclosure; administrative-only statement.

SPEAKER NOTES
Write concise speaker notes for every core slide, targeting 25–35 seconds per slide and a total presentation time below 6 minutes. Use natural spoken English, not corporate jargon. Notes must explain the visual rather than repeat it. Include a short transition sentence between slides.

FINAL POWERPOINT QA — PERFORM BEFORE RETURNING THE FILE
1. Open/render every slide and inspect at 100%.
2. Confirm 16:9 dimensions and consistent margins.
3. Confirm no text is clipped, overlapped, overflowing, too small, or hidden behind images.
4. Confirm screenshots preserve aspect ratio and remain readable.
5. Confirm no generated image contains fake interface text.
6. Confirm every numerical claim has the supplied source.
7. Confirm no unsupported product, clinical, privacy, user, accuracy, partnership, or impact claim appears.
8. Confirm no previous working name appears anywhere, including metadata, notes, image captions, and alt text.
9. Confirm KithRelay is spelled consistently.
10. Confirm all slide text, diagrams, charts, QR code, and speaker notes are editable or high-resolution.
11. Confirm color contrast is readable and coral is reserved for emphasis/actions rather than large backgrounds.
12. Confirm there are no watermarks, template credits, placeholder labels, lorem ipsum, broken links, or missing fonts.

RETURN
- The editable .pptx.
- A PDF export for checking.
- A slide-by-slide text outline in the chat.
- A short list of any placeholders that still require team input.
If you cannot directly create a .pptx, produce a complete slide production specification with exact copy, layout coordinates, visual placement, and speaker notes—do not silently downgrade the deliverable.
```
