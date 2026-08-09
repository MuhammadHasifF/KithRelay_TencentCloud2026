# Privacy and safety

## Demo rule

Use only synthetic documents in the repository, screen recording, deployed website, and WorkBuddy task. Do not substitute a relative’s real appointment or medication record.

## WorkBuddy is not fully local

WorkBuddy operates on local files, but its current privacy policy says inputs are processed by third-party language models and remote copies of inputs/outputs may be retained for a limited period. Therefore:

- do not claim “medical records never leave the computer”;
- do not claim “fully on-device processing”;
- keep model-training contribution disabled;
- use default permissions and an isolated demo workspace;
- review the latest policy before any real-world pilot.

References:

- <https://www.workbuddy.ai/document/privacy-policy>
- <https://www.workbuddy.ai/document/acceptable-use-policy>
- <https://www.workbuddy.ai/document/term>

## Healthcare boundary

CareCircle performs administrative organization only. It may state what documents say and show how those statements changed over time. It must not:

- diagnose a condition;
- recommend treatment;
- decide whether a medicine should be taken;
- automatically send healthcare instructions;
- replace a caregiver’s or clinician’s judgment.

## Human oversight

The interface requires review of important findings before approval. A production implementation would additionally require authenticated reviewer identity, consent records, audit logs, and a defined escalation path for discrepancies.

## Companion app behavior

The deployed browser app:

- starts with synthetic data;
- processes added text in browser memory;
- has no analytics, account system, database, or API endpoint;
- clears user-added data on page refresh;
- rejects image-only PDFs instead of pretending OCR succeeded.

External font files may be requested from Google Fonts. If a fully offline demonstration is needed, replace the font import in `src/styles.css` with system fonts before deployment.

