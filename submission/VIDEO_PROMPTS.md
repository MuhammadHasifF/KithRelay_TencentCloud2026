# KithRelay — short rubric-focused video prompt

## Final format

- Length: approximately 80 seconds.
- Format: 16:9, 1920×1080, 30 fps.
- Footage: real KithRelay and WorkBuddy screen recordings only.
- Audio: one continuous narrator recording plus quiet background music.
- No subtitles, captions, lower thirds, statistic cards, labels, title cards, generated text, generated UI, or human B-roll.
- Keep only actions that demonstrate Impact & Relevance, Use of AI Tools, and Project Quality.

## Record these six clips

### Clip 1 — Problem and product

**Time:** 00:00–00:08
**Rubric:** Impact & Relevance

1. Open `https://kithrelay.vercel.app/`.
2. Hold on the real login screen for two seconds.
3. Click **Explore the demo instantly**.

### Clip 2 — Reconciled overview

**Time:** 00:08–00:20
**Rubric:** Impact & Relevance + Project Quality

1. Show the loaded Overview page.
2. Move slowly across the source-document, appointment, medication, and review metrics.
3. Pause on the rescheduled Cardiology appointment and **What changed** panel.

### Clip 3 — Evidence and human review

**Time:** 00:20–00:32
**Rubric:** Project Quality

1. Open **Review findings**.
2. Open a real source badge for the rescheduled appointment.
3. Show both source filenames and the 15 Aug → 22 Aug change.
4. Show the disabled approval control before review.

### Clip 4 — WorkBuddy connection

**Time:** 00:32–00:44
**Rubric:** Use of AI Tools + Project Quality

1. Open **WorkBuddy sync**.
2. Show the connected synthetic folder and **Auto-sync active** state.
3. Click **Copy task & open WorkBuddy**.
4. Cut directly to the real WorkBuddy desktop window.

### Clip 5 — WorkBuddy execution

**Time:** 00:44–01:04
**Rubric:** Use of AI Tools — most important clip

1. Show the KithRelay skill enabled and the correct synthetic working folder.
2. Paste and start the copied task.
3. Show real file inventory or file-reading activity at normal speed.
4. Show WorkBuddy planning or execution progress.
5. Show `care_calendar.md` and `briefing.md` being produced.
6. Compress only the slow middle section if necessary; do not fake actions.

### Clip 6 — Results and control

**Time:** 01:04–01:20
**Rubric:** Project Quality + complete workflow

1. Return to KithRelay while the page remains open.
2. Record the real status changing to **2 of 2 ready**.
3. Open one generated draft preview.
4. Return to **Review findings**, complete review, and show approval becoming available.
5. Open the Export menu and finish with the KithRelay interface visible.

## One-voice narration prompt

Generate this narration once as one continuous audio file. Never generate separate voices for separate clips.

```text
Create one continuous 80-second voiceover using exactly one adult Singaporean English female narrator. Her voice is warm, calm, capable, and documentary-like. Keep the identical speaker identity, accent, pitch, pace, microphone distance, and energy from the first word to the last. Speak naturally at approximately 108 to 114 words per minute. Do not use a sales voice, character acting, multiple speakers, accent changes, or dramatic delivery. Add no music or sound effects. Pronounce KithRelay as “KITH relay” and WorkBuddy as “Work Buddy.” Read the supplied script exactly without rewriting it. Return one clean audio file. If any sentence sounds like another speaker, regenerate the entire file instead of replacing that sentence.
```

## Exact narration script

```text
Family caregivers often coordinate appointments, medication changes, and bills across scattered documents. KithRelay creates one verifiable handoff.

Seven synthetic documents become one current timeline. Rescheduled appointments, medicine changes, and payment deadlines remain linked to their original evidence.

The caregiver opens each source, reviews important changes, and must approve them before export. KithRelay supports decisions; it does not make them.

KithRelay and WorkBuddy share one authorized folder. The installed skill defines the workflow, output contract, and safety boundaries.

WorkBuddy inventories the files, checks they concern one senior, extracts source-linked facts, reconciles dates and medicines, verifies traceability, and writes a care calendar plus appointment briefing.

KithRelay detects both drafts automatically and returns them for human review. The result is a deployed, tested workflow that keeps evidence visible and the caregiver in control.

KithRelay. Every care detail, carried forward—with its source.
```

## Gemini assembly prompt

```text
Assemble the six supplied real screen recordings into one 80-second, 16:9, 1920×1080, 30 fps product demonstration using the exact clip order and timings provided. Preserve every KithRelay and WorkBuddy interface pixel exactly. Do not regenerate, redraw, restyle, sharpen with AI, replace, crop away, or alter any interface text or control. Use only clean cuts and short cross-dissolves. Add no subtitles, captions, labels, lower thirds, statistic cards, title cards, logos, URLs, QR codes, generated text, generated UI, stock footage, human B-roll, or additional product claims. Do not create or change voices. Keep the supplied single narration track unchanged and lower quiet documentary background music by 12 dB beneath it. The WorkBuddy execution must remain the longest and clearest section. Return one H.264 MP4 with no watermarks.
```

## Final checks

- Exactly six clips and approximately 80 seconds.
- One narrator voice from beginning to end.
- Zero subtitles, captions, or added on-screen text.
- Only real KithRelay and WorkBuddy footage.
- The WorkBuddy run is genuine and clearly visible.
- Synthetic demo data is visible in the real interface.
- Human review and evidence links are shown.
- No medical, clinical-validation, fully-local, direct-API, or automatic-task-start claims.
- No personal WorkBuddy account details or real patient information.
- Test the final video on a second device before sharing.
