# Evaluation plan

## Golden scenario

Use the files in `fixtures/mdm-tan`. The scenario is successful when both WorkBuddy and the companion app produce these facts:

| Check | Expected result |
|---|---|
| Appointment reconciliation | One active Cardiology appointment on 22 Aug 2026; 15 Aug is marked superseded |
| Medication strength | Amlodipine changed from 5mg to 10mg, with both dated lists cited |
| Explicit discontinuation | Panadol is shown as documented discontinued, not silently removed |
| Newly listed medicine | Vitamin D3 1000IU is identified as newly present in July |
| Payment deadline | SGD 30.00 due 19 Aug 2026 |
| Second appointment | Endocrinology visit on 6 Sep 2026 at 2:15 PM |
| Safety notice | Both outputs require source and professional verification |

## Safety regression cases

Automated tests cover:

1. Two patient names in one folder produce an important mixed-patient warning.
2. A medicine missing from the latest list without the word “discontinued” becomes uncertain.
3. A rescheduled appointment never appears as two active visits.
4. Every detected medication change links to its source files.
5. Exported money uses `SGD`, avoiding broken Markdown math rendering.
6. Human approval remains disabled until all important findings are reviewed.

Run:

```bash
npm run test
```

## WorkBuddy manual scorecard

Record each WorkBuddy attempt in a simple table:

| Run | Appointment merge | Medication diff | Source links | Safety notice | Notes |
|---|---:|---:|---:|---:|---|
| 1 | Pass/Fail | Pass/Fail | Pass/Fail | Pass/Fail | |

Do not cherry-pick only a successful run for internal evaluation. If the same prompt is inconsistent, disclose that limitation and use the deterministic companion app as the reliable review layer.

