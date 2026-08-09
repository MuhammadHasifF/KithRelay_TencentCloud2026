# KithRelay demo-video plan and Gemini clip prompts

The recovered planning material lists a web link or Skill ZIP plus the Project Introduction Deck as the required AI Agent/Skills deliverables; it lists a demo video explicitly for the Game track. Treat this video as a high-value demonstration/social asset unless the live submission portal says it is mandatory. Finish the required deck and working links first.

## Recommended deliverable

- **Main version:** 16:9, 1920×1080, 30 fps, approximately 1 minute 50 seconds.
- **Social cut:** 9:16, 1080×1920, approximately 45–60 seconds, created only after the main version works.
- **Core rule:** Use real screen recordings for every claim that the product or WorkBuddy works. Use Gemini-generated footage only for the human opening, abstract transition, and emotional closing.

AI video generators often distort interface text. A generated imitation of the website is not evidence. Never ask Gemini to recreate KithRelay or WorkBuddy from memory.

## Assets to prepare

Already available:

- `assets/01-login.png`
- `assets/02-overview.png`
- `assets/03-workbuddy-sync.png`
- `assets/04-review-findings.png`
- `assets/05-mobile-overview.png`

Record manually:

1. The live website opening at `https://kithrelay.vercel.app/`.
2. Choosing **Explore the demo instantly**.
3. Navigating Overview → Documents → Review findings → WorkBuddy sync.
4. Selecting a clean copy of the synthetic `fixtures/mdm-tan` folder.
5. Clicking **Copy task & open WorkBuddy**, selecting the same folder in WorkBuddy Desktop, pasting the copied short task, and starting the installed KithRelay skill.
6. WorkBuddy visibly reading files, showing execution progress, and creating `care_calendar.md` plus `briefing.md`.
7. Returning to KithRelay and recording the two drafts appearing automatically within the five-second check window. Keep a separate take of **Check now** only as a fallback.
8. Reviewing source-linked findings and exporting a care calendar or briefing.

## Recording safety checklist

- Use only the synthetic Mdm Tan fixture folder.
- Remove personal browser profiles, bookmarks, email addresses, desktop notifications, unrelated tabs, and real filenames.
- Use a fresh local demo folder named `KithRelay-Demo`.
- Record at 1440×900 or 1920×1080, browser zoom 100%, cursor visible, 30 fps.
- Keep the browser and WorkBuddy windows maximized.
- Do not record password entry. Use **Explore the demo instantly** for the video.
- Do not show WorkBuddy account details, API keys, tokens, billing, private connectors, or other tasks.
- Let WorkBuddy complete a real run before editing. Do not fake execution progress.
- If a live step is slow, use a labelled time compression such as **“Processing condensed for time”** rather than pretending it was instantaneous.
- Verify the generated facts before recording the final result.
- Keep KithRelay open during the WorkBuddy run because automatic folder checks occur only in a visible page.
- If browser permission has expired, record the real **Reconnect folder** step rather than implying unattended access.

## Master visual prompt for Gemini-generated clips

Paste this style block at the beginning of every Gemini generation prompt:

```text
Create a premium Singapore public-health technology film in a calm documentary style. Bright high-key daylight, clean whites, soft clinical grey, restrained teal and coral accents, natural skin tones, realistic Singapore HDB environment, respectful and capable portrayal of ageing, precise cinematic composition, gentle controlled camera motion, 16:9 landscape, 1920x1080, 24 fps, no text rendered inside the video, no logos, no identifiable documents, no real medical data, no hospital emergency, no sadness-porn, no futuristic holograms, no sci-fi HUD, no robots, no neon green cast, no distorted hands, no extra fingers, no warped paper, no gibberish writing, no watermarks. Leave clear negative space for editor-added captions.
```

Maintain the same human continuity in generated clips:

- Caregiver: Singaporean Chinese woman, early-to-mid 40s, practical smart-casual clothing, calm but initially overloaded.
- Senior: Singaporean Chinese woman, late 70s, independent and engaged, not frail or passive.
- Home: bright, tidy Singapore HDB dining/living area with warm daylight and understated local realism.

## Editing system

- Typeface: Inter or Aptos.
- Main text: `#20343E`.
- Structural teal: `#007A78`.
- Action coral: `#E45C27`.
- Background: white `#FFFFFF` and grey `#F6F8F9`.
- Captions: white box at 92–96% opacity with dark text; avoid floating text directly over busy footage.
- Transitions: 6–10 frame cross-dissolve or clean match cut. No glitch, whip, spin, or flashy template transitions.
- Music: quiet modern documentary bed, warm piano/marimba pulse with subtle electronic texture, no dramatic trailer percussion.
- Voice: one calm Singaporean English narrator, confident and conversational, approximately 145 words per minute.
- Mix target: voice clearly above music; lower music by approximately 10–14 dB under narration.
- Add burned-in captions after voiceover is final.

## Clip-by-clip production plan

### Clip 1 — The invisible workload

**Timeline:** 00:00–00:07  
**Type:** Gemini-generated human B-roll  
**Purpose:** Emotional hook without claiming a product outcome.

**Gemini prompt:**

```text
[MASTER VISUAL PROMPT]
A medium-wide shot in a bright Singapore HDB dining area. The same caregiver sits at a clean table sorting a small, believable set of fictional appointment letters, medication lists, a bill, and a paper calendar. She compares two dates and makes a careful note. Her expression shows concentration and mild overload, never despair. The camera makes a slow 10-centimetre lateral move from the document stack toward her face. Papers contain only soft unreadable lines and abstract blocks, with absolutely no legible words, logos, numbers, barcodes, or medical identifiers. Natural morning light, restrained composition, negative space at upper left for editor-added text.
```

**Editor-added text:** `Caregiving includes invisible admin.`  
**Voiceover:** “Family caregiving is not only hands-on care. It is also hours spent comparing letters, medicine lists, dates, and bills.”  
**Audio:** Soft paper movement; music starts quietly.

### Clip 2 — Evidence-based scale

**Timeline:** 00:07–00:14  
**Type:** Editor-built motion graphic, not generated text  
**Purpose:** Establish Singapore relevance.

**Build instructions:**

- White background with three clean statistic tiles animating upward by 12 pixels.
- Tile 1: `33 hours / week` — average primary informal caregiving time.
- Tile 2: `SGD 1.28B / year` — estimated value of informal caregiving for seniors aged 75+.
- Tile 3: `1 in 4 by 2030` — Singapore citizens expected to be aged 65+.
- Footer: `Source: Duke-NUS Medical School, 2024`.
- Do not ask Gemini to render these numbers.

**Voiceover:** “In Singapore, primary informal caregivers provide an average of 33 hours of care each week. That workload will matter even more as the population ages.”

### Clip 3 — Introduce KithRelay

**Timeline:** 00:14–00:22  
**Type:** Real website screen recording  
**Purpose:** Prove a deployed product exists.

**Capture:**

1. Start on the live KithRelay login screen.
2. Pause for one second so the brand is readable.
3. Click **Explore the demo instantly**.
4. Let the overview finish loading.

**Optional Gemini image-to-video fallback:** Upload `assets/01-login.png` and use the prompt below only if real recording is impossible.

```text
Use the uploaded screenshot as an exact immutable pixel reference. Do not redraw, replace, regenerate, restyle, blur, or alter any word, icon, colour, control, spacing, or logo. Create only a very subtle 2% camera push-in over six seconds around the static screenshot. Every UI pixel and every line of text must remain perfectly stable and readable. No new UI elements, no cursor, no reflections, no depth warp, no screen flicker.
```

**Editor-added lower third:** `KithRelay — source-linked care coordination`  
**Voiceover:** “KithRelay turns that fragmented paperwork into one source-linked care handoff a family can verify.”

### Clip 4 — The complete care overview

**Timeline:** 00:22–00:33  
**Type:** Real website screen recording  
**Purpose:** Demonstrate product quality and the golden scenario.

**Capture:**

- Slowly move the cursor across the four summary cards.
- Pause on the rescheduled Cardiology appointment.
- Pause on **What changed**.
- Keep the full interface visible; do not zoom so far that navigation disappears.

**Editor callouts:**

- `7 source documents`
- `1 active rescheduled appointment`
- `3 current medicines`
- `5 review findings`

**Voiceover:** “Seven synthetic documents become one current timeline. KithRelay keeps the new appointment, surfaces medication changes, finds the payment deadline, and preserves the evidence.”

### Clip 5 — Source-linked human review

**Timeline:** 00:33–00:44  
**Type:** Real website screen recording  
**Purpose:** Show safety and explainability.

**Capture:**

1. Open **Review findings**.
2. Hover over or click the source badges for the appointment change.
3. Show that the 15 Aug notice is superseded by 22 Aug and both filenames remain attached.
4. Briefly show Amlodipine 5 mg → 10 mg with both dated medication files.
5. Do not mark everything reviewed yet.

**Editor-added text:** `Evidence, not just an answer.`  
**Voiceover:** “This is not a black-box summary. Every important change links back to the exact source files, and approval stays locked until a caregiver reviews the evidence.”

### Clip 6 — Connect the desktop agent

**Timeline:** 00:44–00:56  
**Type:** Real website screen recording  
**Purpose:** Explain the real WorkBuddy connection honestly.

**Capture:**

1. Open **WorkBuddy sync**.
2. For the first-use take, click **Connect folder** and select the synthetic `KithRelay-Demo` folder. For a second take after refresh, show the truthful remembered or reconnect-permission state.
3. Pause on **Auto-sync active** and the message that KithRelay checks every five seconds while the page is open.
4. Click **Copy task & open WorkBuddy**. The button copies the concise task and launches the registered desktop protocol in one user action.
5. If the desktop protocol confirmation appears, accept it on camera or cut cleanly to the already-open WorkBuddy window.

**Editor-added diagram:** `Website review ↔ read-only authorized folder ↔ WorkBuddy task`

**Editor-added micro-label:** `Remembered where supported · Permission remains user-controlled`
**Voiceover:** “The browser and desktop agent share one caregiver-authorized folder. KithRelay remembers the connection where supported, copies the short task, and opens WorkBuddy without claiming a hidden API.”

### Clip 7 — WorkBuddy autonomous execution

**Timeline:** 00:56–01:12  
**Type:** Real WorkBuddy Desktop recording — essential proof shot  
**Purpose:** Earn the 40-point AI-tool criterion.

**Capture:**

- Show KithRelay enabled.
- Show the selected working directory.
- Paste/start the prepared task.
- Record WorkBuddy inventorying or opening files, showing execution progress, and producing artifacts.
- If processing is long, compress the middle to 250–400% speed and add `Processing condensed for time`.
- Keep at least one normal-speed moment showing a real file/tool action.
- Never expose private account information.

**Editor-added side labels timed to real actions only:**

1. `Inventory every file`
2. `Classify and extract`
3. `Reconcile dates and medicines`
4. `Check every claim has evidence`
5. `Write two review drafts`

**Voiceover:** “Inside WorkBuddy, the KithRelay skill defines the goal and safety boundaries. WorkBuddy plans the folder task, invokes file operations, reconciles evidence across documents, checks traceability, and writes two review drafts.”

**Do not say:** multi-agent, four parallel agents, fully local, diagnosis, clinical accuracy, or automatic calendar update.

### Clip 8 — Artifacts return to KithRelay

**Timeline:** 01:12–01:24  
**Type:** Real WorkBuddy + website recording  
**Purpose:** Close the connected loop.

**Capture:**

1. In WorkBuddy or the folder, show `care_calendar.md` and `briefing.md` exist.
2. Open one briefly and show the verification notice.
3. Return to KithRelay.
4. Keep the cursor still and record the status changing from **Waiting for files** to **2 of 2 ready** within the real five-second check window.
5. Expand one result preview in the website and show the detected filename. If automatic detection does not occur during the take, use **Check now** and label it `Manual fallback`.

**Editor-added text:** `care_calendar.md + briefing.md`  
**Voiceover:** “The agent writes a care calendar and next-visit briefing into the same folder. While the page is open, KithRelay detects the newest drafts automatically and brings them back for review.”

### Clip 9 — Caregiver stays in control

**Timeline:** 01:24–01:35  
**Type:** Real website screen recording  
**Purpose:** Demonstrate the final safety interaction and export.

**Capture:**

1. Return to **Review findings**.
2. Mark the important findings reviewed.
3. Show the approval button becoming enabled.
4. Approve the administrative plan.
5. Open the Export menu and show calendar, briefing, and evidence bundle options.

**Editor-added text:** `Human-reviewed before sharing`  
**Voiceover:** “KithRelay never makes the care decision. The caregiver verifies important details first, then exports a plan that stays attached to its sources.”

### Clip 10 — Human outcome

**Timeline:** 01:35–01:43  
**Type:** Gemini-generated human B-roll  
**Purpose:** Return from technology to dignity and family confidence.

**Gemini prompt:**

```text
[MASTER VISUAL PROMPT]
Continue with the exact same caregiver and senior in the same bright Singapore HDB home. They sit side by side at the dining table, calmly reviewing one neat single-page care schedule together. The senior points to an appointment row and the caregiver listens; both appear informed, capable, and collaborative rather than relieved by a magical technology. Keep all paper text abstract and unreadable. The camera slowly pulls back by 15 centimetres, revealing a tidy table with the earlier document stack now organised in one folder. Warm natural late-morning light. Leave clean negative space on the right for an editor-added closing phrase.
```

**Editor-added text:** `Better prepared. Still human-led.`  
**Voiceover:** “The result is not automated care. It is a better-prepared family, with less context lost between documents.”

### Clip 11 — Closing card

**Timeline:** 01:43–01:50  
**Type:** Editor-built title card  
**Purpose:** Memorable finish and clear call to action.

**Build instructions:**

- White background.
- KithRelay node mark in teal with one coral node.
- Main line: `Every care detail, carried forward.`
- Supporting line: `Source-linked · Human-reviewed · WorkBuddy-connected`
- URL: `kithrelay.vercel.app`
- Small label: `Tencent Cloud Hackathon 2026 — Age Well AI Agent Track`
- Optional QR code to the live product.
- Do not generate the URL or QR code with Gemini; add them in the editor.

**Voiceover:** “KithRelay. Every care detail, carried forward—with its source.”

## Full narration script

Use this as the base voiceover and adjust only for natural timing:

```text
Family caregiving is not only hands-on care. It is also hours spent comparing letters, medicine lists, dates, and bills.

In Singapore, primary informal caregivers provide an average of 33 hours of care each week. That workload will matter even more as the population ages.

KithRelay turns that fragmented paperwork into one source-linked care handoff a family can verify.

Seven synthetic documents become one current timeline. KithRelay keeps the new appointment, surfaces medication changes, finds the payment deadline, and preserves the evidence.

This is not a black-box summary. Every important change links back to the exact source files, and approval stays locked until a caregiver reviews the evidence.

The browser and desktop agent share one caregiver-authorized folder. KithRelay remembers the connection where supported, copies the short task, and opens WorkBuddy without claiming a hidden API.

Inside WorkBuddy, the KithRelay skill defines the goal and safety boundaries. WorkBuddy plans the folder task, invokes file operations, reconciles evidence across documents, checks traceability, and writes two review drafts.

The agent writes a care calendar and next-visit briefing into the same folder. While the page is open, KithRelay detects the newest drafts automatically and brings them back for review.

KithRelay never makes the care decision. The caregiver verifies important details first, then exports a plan that stays attached to its sources.

The result is not automated care. It is a better-prepared family, with less context lost between documents.

KithRelay. Every care detail, carried forward—with its source.
```

## Final Gemini/editor instruction

Paste this after all clips are uploaded to Gemini or the editor:

```text
Assemble the supplied clips into a 16:9, 1920x1080, approximately 110-second documentary-style product demo. Preserve all real screen recordings exactly; do not regenerate, restyle, replace, or alter their interface text. Use generated human B-roll only at the opening and near the close. Follow the supplied timeline, narration, caption text, and colour system. Use clean cuts or short cross-dissolves, restrained documentary music, and readable burned-in captions. Keep the product demonstration as the visual majority of the film. Do not add new product features, statistics, testimonials, logos, hospital endorsements, medical claims, fake WorkBuddy actions, fake UI, or real patient information. Do not use sci-fi AI imagery, green colour washes, glitch effects, dramatic medical footage, or template watermarks. Export H.264 MP4, 1080p, 30 fps, high quality, with voice centred and music at least 10 dB lower than narration. Before export, inspect every frame containing UI for warped text, changed numbers, hallucinated buttons, cropped controls, exposed personal data, cursor mistakes, and unreadable captions. If any UI frame has been regenerated or distorted, replace it with the original screen recording.
```

## Final video QA

- No previous working name appears.
- KithRelay spelling and URL are correct in every title and caption.
- At least 60% of the runtime is real product or WorkBuddy footage.
- The WorkBuddy task shown is a real completed run using the synthetic fixture folder.
- The automatic result-detection shot is a real continuous capture, not an edited status change.
- No unsupported feature or impact claim appears.
- No generated clip contains legible fake paperwork or UI.
- The 33-hour statistic is attributed to Duke-NUS, 2024.
- “Synthetic demo data” is visible or stated.
- Human review and the administrative-only boundary are visible.
- The video never implies event-driven background watching, automatic WorkBuddy task initiation, or fully local AI processing.
- The video is under 2 minutes.
- Captions remain inside title-safe margins on both desktop and mobile playback.
- Voiceover is understandable without music; captions make it understandable without sound.
- The final MP4 plays from start to end on a second device before submission.

## Optional social version

After the main video is approved, create a 9:16 cut using Clips 1, 3, 5, 7, 9, and 11. Keep it below 60 seconds. Reframe screen recordings inside a full-width phone-safe canvas rather than cropping away navigation or evidence. Verify the organizer's exact required caption and hashtags before posting; the planning material listed `#CodeBuddy`, `#WorkBuddy`, `#Miora`, and `#TencentCloudHackathon`, but do not verbally claim use of a tool that the project did not actually use.
