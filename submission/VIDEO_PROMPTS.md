# KithRelay demo-video plan and Gemini clip prompts

The recovered planning material lists a web link or Skill ZIP plus the Project Introduction Deck as the required AI Agent/Skills deliverables; it lists a demo video explicitly for the Game track. Treat this video as a high-value demonstration/social asset unless the live submission portal says it is mandatory. Finish the required deck and working links first.

## Recommended deliverable

- **Main version:** 16:9, 1920×1080, 30 fps, approximately 1 minute 50 seconds.
- **Social cut:** 9:16, 1080×1920, approximately 45–60 seconds, created only after the main version works.
- **Core rule:** Use real screen recordings for every claim that the product or WorkBuddy works. Use Gemini-generated footage only for the human opening and emotional closing.

AI video generators often distort interface text. A generated imitation of the website is not evidence. Never ask Gemini to recreate KithRelay or WorkBuddy from memory.

## Non-negotiable production workflow

Do not ask one generative-video model to create the clips, narration, product interface, captions, and final edit together. That workflow causes changing voices, misspelled text, and invented UI. Use this order:

1. Record all KithRelay and WorkBuddy product footage from the real applications.
2. Generate only Clips 1 and 10 as silent human B-roll in Gemini.
3. Assemble a silent picture cut in a timeline editor at the exact timings below.
4. Generate the full narration once as one continuous audio file. Never generate narration clip by clip.
5. Add titles, statistics, callouts, filenames, captions, logos, and the URL as native editor text layers only.
6. Add music and sound effects after the narrator track is locked.
7. Export once, then inspect every word and every UI frame at 100% scale.

If Gemini creates any dialogue, narration, lip-sync, captions, signs, logos, UI, or document text inside a generated clip, mute and reject that clip. Do not try to repair generated words.

## Voice continuity lock

- Produce exactly one narration file covering 00:00–01:50. Cut that single file on the editing timeline if necessary; never regenerate individual sentences.
- Use one adult Singaporean English female narrator throughout: approximately 35–45 years old, warm, calm, capable, and documentary-like.
- Keep the same accent, vocal identity, microphone distance, room tone, pitch, and energy from the first word to the last.
- Target 112–118 words per minute. Do not speed up individual sections to force them into a clip.
- Avoid character acting, sales energy, exaggerated emotion, whispering, newsreader delivery, British/American accent drift, or switching between male and female voices.
- Use no dialogue from the caregiver or senior. Their generated clips must show no visible speaking.
- If the tool exposes a voice name, reference audio, seed, style strength, or consistency control, lock it once and reuse the identical setting.
- If any sentence sounds like a different speaker, regenerate the entire narration in one pass rather than patching that sentence.

## Text integrity lock

- Gemini must render zero critical text. All product text comes from real screen recordings; all other text is typed manually in the editor.
- Disable automatic rewriting, translation, caption styling, logo generation, and AI interface enhancement.
- Import `KITHRELAY_CAPTIONS.srt` after the final voice track is placed. Adjust cue timing only; do not rewrite its wording.
- Use Inter Semibold, 42–46 px at 1080p, no more than two caption lines, and approximately 38 characters per line.
- Keep captions inside a 10% title-safe margin and place them in a 94% opaque white box with `#20343E` text.
- Copy these spellings exactly: `KithRelay`, `WorkBuddy`, `Tencent Cloud`, `care_calendar.md`, `briefing.md`, `Mdm Tan`, `Amlodipine`, `Vitamin D3`, `Panadol`, `SGD`.
- Never use generative fill, motion interpolation, image-to-video, or AI restyling on real website or WorkBuddy recordings.

## Assets to prepare

Already available:

- `assets/01-login.png`
- `assets/02-overview.png`
- `assets/03-workbuddy-sync.png`
- `assets/04-review-findings.png`
- `assets/05-mobile-overview.png`
- `KITHRELAY_CAPTIONS.srt`

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
VISUAL-ONLY SILENT CLIP. Generate no narration, dialogue, lip-sync, music, ambient audio, captions, labels, signs, logos, interface text, or legible document text. Create a premium Singapore public-health technology film in a calm documentary style. Bright high-key daylight, clean whites, soft clinical grey, restrained teal and coral accents, natural skin tones, realistic Singapore HDB environment, respectful and capable portrayal of ageing, precise cinematic composition, gentle controlled camera motion, 16:9 landscape, 1920x1080, 30 fps, no real medical data, no hospital emergency, no sadness-porn, no futuristic holograms, no sci-fi HUD, no robots, no neon green cast, no distorted hands, no extra fingers, no warped paper, no gibberish writing, no watermarks. Nobody speaks or mouths words. Leave clear negative space for editor-added captions. Return one silent visual clip only.
```

Maintain the same human continuity in generated clips:

- Caregiver: Singaporean Chinese woman, early-to-mid 40s, practical smart-casual clothing, calm but initially overloaded.
- Senior: Singaporean Chinese woman, late 70s, independent and engaged, not frail or passive.
- Home: bright, tidy Singapore HDB dining/living area with warm daylight and understated local realism.
- Generate Clip 1 first and export a clean reference still of both people and the room. Upload that still as the character-and-location reference for Clip 10; do not rely on a text description alone to preserve faces and clothing.

## Editing system

- Typeface: Inter or Aptos.
- Main text: `#20343E`.
- Structural teal: `#007A78`.
- Action coral: `#E45C27`.
- Background: white `#FFFFFF` and grey `#F6F8F9`.
- Captions: white box at 92–96% opacity with dark text; avoid floating text directly over busy footage.
- Transitions: 6–10 frame cross-dissolve or clean match cut. No glitch, whip, spin, or flashy template transitions.
- Music: quiet modern documentary bed, warm piano/marimba pulse with subtle electronic texture, no dramatic trailer percussion.
- Voice: one continuous locked Singaporean English narrator track, confident and conversational, 112–118 words per minute.
- Mix target: voice clearly above music; lower music by approximately 10–14 dB under narration.
- Mute every Gemini-generated clip before adding sound effects.
- Add burned-in captions from `KITHRELAY_CAPTIONS.srt` only after voiceover is final.

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
**Voiceover:** “Caregiving also means comparing appointment letters, medicine lists, dates, and bills.”

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

**Voiceover:** “In Singapore, primary informal caregivers provide an average of 33 care hours each week.”

### Clip 3 — Introduce KithRelay

**Timeline:** 00:14–00:22  
**Type:** Real website screen recording  
**Purpose:** Prove a deployed product exists.

**Capture:**

1. Start on the live KithRelay login screen.
2. Pause for one second so the brand is readable.
3. Click **Explore the demo instantly**.
4. Let the overview finish loading.

**Safe fallback if recording is impossible:** Place `assets/01-login.png` directly in the timeline editor and keyframe scale from 100% to 102%. Do not send the screenshot through Gemini or any image-to-video model.

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

**Voiceover:** “Seven synthetic documents become one current timeline: the latest appointment, medication changes, a payment deadline, and every supporting source.”

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
**Voiceover:** “Every important change links to its exact source file, while approval remains locked until the caregiver reviews the evidence.”

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
**Voiceover:** “KithRelay and WorkBuddy share one authorized folder. The website remembers access where supported, copies the task, and opens the desktop agent.”

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

**Voiceover:** “The installed skill gives WorkBuddy the workflow and safety boundaries. It inventories the folder, reconciles dates and medicines, verifies traceability, and writes two drafts.”

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
**Voiceover:** “When the files appear, KithRelay detects the newest calendar and briefing automatically, then brings them back into the review workspace.”

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
**Voiceover:** “The caregiver verifies important details before approval, then exports the calendar, briefing, or source-linked evidence bundle.”

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
**Voiceover:** “The outcome is not automated care. It is a better-prepared family with less context lost.”

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

## Single master narration generation

Paste the following prompt once. Generate one continuous narration file; do not submit each paragraph separately:

```text
Create one continuous voiceover for a 110-second documentary-style technology demo.

Use exactly one narrator for the entire recording: an adult Singaporean English woman, approximately 35 to 45 years old, with a warm, calm, capable, and conversational documentary delivery. Keep the identical vocal identity, accent, pitch, cadence, microphone distance, room tone, and emotional energy from beginning to end. Speak at 112 to 118 words per minute with brief natural pauses between paragraphs. Do not sound like an advertisement, news broadcast, virtual assistant, or dramatic trailer. Do not switch speakers, accents, age, gender, recording space, or vocal character. Do not add music, sound effects, introductions, commentary, or alternative takes.

Pronounce KithRelay as “KITH relay.” Pronounce WorkBuddy as “Work Buddy.” Read 33 as “thirty-three.”

Read the script exactly as written. Do not paraphrase, add words, remove words, expand product names, or speak the timing labels. Return one clean WAV file, 48 kHz, mono, with no processing other than gentle loudness normalization. If one sentence fails, regenerate the complete file using this same prompt; do not create a replacement sentence with a new voice.
```

Use this exact script and do not adjust its wording:

```text
Caregiving also means comparing appointment letters, medicine lists, dates, and bills.

In Singapore, primary informal caregivers provide an average of 33 care hours each week.

KithRelay turns fragmented paperwork into one source-linked care handoff a family can verify.

Seven synthetic documents become one current timeline: the latest appointment, medication changes, a payment deadline, and every supporting source.

Every important change links to its exact source file, while approval remains locked until the caregiver reviews the evidence.

KithRelay and WorkBuddy share one authorized folder. The website remembers access where supported, copies the task, and opens the desktop agent.

The installed skill gives WorkBuddy the workflow and safety boundaries. It inventories the folder, reconciles dates and medicines, verifies traceability, and writes two drafts.

When the files appear, KithRelay detects the newest calendar and briefing automatically, then brings them back into the review workspace.

The caregiver verifies important details before approval, then exports the calendar, briefing, or source-linked evidence bundle.

The outcome is not automated care. It is a better-prepared family with less context lost.

KithRelay. Every care detail, carried forward—with its source.
```

## Silent picture-assembly instruction

Use this only to produce a picture-only rough cut. Add the locked voice, text, captions, and music afterward in a normal timeline editor:

```text
Create a SILENT, PICTURE-ONLY rough cut from the supplied clips in the exact 00:00–01:50 timeline. Output 16:9, 1920x1080, 30 fps. Preserve every real KithRelay and WorkBuddy screen recording exactly as supplied. Do not regenerate, redraw, sharpen with AI, restyle, crop away controls, replace text, create reflections, or alter interface pixels. Use generated human B-roll only at 00:00–00:07 and 01:35–01:43. Use clean cuts or 6–10 frame cross-dissolves. Keep product and WorkBuddy footage as the visual majority. Generate no narration, dialogue, music, sound effects, captions, titles, labels, statistics, logos, URLs, QR codes, filenames, or interface overlays. Do not invent product features, testimonials, hospital endorsements, medical claims, WorkBuddy actions, patient information, or UI. Do not use sci-fi imagery, green washes, glitches, dramatic medical footage, or template watermarks. Return one silent visual master only. All text and audio will be added later as locked editor layers.
```

## Final video QA

- No previous working name appears.
- KithRelay spelling and URL are correct in every title and caption.
- At least 60% of the runtime is real product or WorkBuddy footage.
- The WorkBuddy task shown is a real completed run using the synthetic fixture folder.
- The automatic result-detection shot is a real continuous capture, not an edited status change.
- No unsupported feature or impact claim appears.
- No generated clip contains legible fake paperwork or UI.
- Exactly one continuous narrator voice is used; no sentence sounds recorded by a different speaker.
- Generated B-roll is muted and contains no visible speaking or lip-sync.
- Every title, statistic, filename, caption, URL, and logo is an editor layer, never AI-rendered video text.
- Captions match `KITHRELAY_CAPTIONS.srt` exactly with no automatic paraphrasing or misspelling.
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
