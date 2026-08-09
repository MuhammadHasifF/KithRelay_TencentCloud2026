# KithRelay

**Every care detail, carried forward.**

KithRelay is a source-linked care coordination workspace for family caregivers, built for the Tencent Cloud Hackathon 2026 **Age Well AI Agent Track**.

## Live application

**[Open KithRelay](https://kithrelay.vercel.app/)**

The public demo includes a synthetic care story and requires no real patient information.

## What it does

- Organizes appointment letters, medication lists, bills, and profile notes in one care workspace.
- Reconciles rescheduled appointments and medication changes without hiding conflicting evidence.
- Links every important finding to its original source document.
- Requires caregiver review before the administrative plan is approved or shared.
- Exports a care calendar, next-appointment briefing, and evidence bundle.
- Remembers an authorized care folder in supported browsers and reconnects it with user permission.
- Detects the latest WorkBuddy calendar and briefing drafts automatically while the website is open.

## Using the website

1. Open the [live application](https://kithrelay.vercel.app/).
2. Create a browser-local caregiver account, sign in, or choose **Explore the demo instantly**.
3. Review the included synthetic scenario, upload individual files, or select **WorkBuddy sync**.
4. Choose **Connect folder** and grant read-only access to the folder containing the care documents. Chrome or Edge can remember the folder handle for later visits.
5. Choose **Copy task & open WorkBuddy**, create a task in that same folder, paste the copied instruction, and start the installed KithRelay skill.
6. Leave KithRelay open. It checks every five seconds and displays the newest `care_calendar*.md` and `briefing*.md` drafts automatically. **Check now** remains available as a fallback.

## How WorkBuddy connects

WorkBuddy is a desktop agent and does not publish a browser-embed API. KithRelay therefore uses an authorized shared folder as the connection:

```text
Care folder → KithRelay browser review
           → WorkBuddy + KithRelay skill
           → care_calendar.md + briefing.md
           → KithRelay automatic result detection
```

This follows WorkBuddy's documented task model: choose a working directory, let the agent read and write within it, and review the resulting artifacts. The website can also copy the concise task and launch an installed Windows copy of WorkBuddy through its registered `workbuddy-ai://` desktop link.

The browser connection is intentionally transparent rather than a claimed direct API. Folder handles are stored in browser IndexedDB when supported, permission is rechecked after reload, and visible tabs poll for updated artifacts every five seconds. KithRelay recognizes both the standard output names and timestamped drafts preserved by repeat WorkBuddy runs.

## Account and privacy model

- Prototype accounts use a salted password hash stored only in the current browser.
- The signed-in session lasts for the current browser tab.
- Selected care documents are processed in browser memory and are not uploaded by KithRelay.
- Folder access is read-only and can be removed with **Clear workspace**.
- WorkBuddy has separate cloud-processing terms when it processes the shared folder.
- KithRelay provides administrative organization, not diagnosis or medical advice.

## Project parts

| Part | Role |
|---|---|
| KithRelay web application | Account access, document review, reconciliation, evidence display, approval, and exports |
| Shared-folder connection | Remembers permission, monitors the open workspace, and imports the newest WorkBuddy drafts |
| KithRelay WorkBuddy skill | Gives the desktop agent its workflow, output contract, and safety boundaries |
| Deterministic reconciliation engine | Powers the fast browser demo and automated regression coverage |
| Synthetic Mdm Tan scenario | Demonstrates appointment, medication, and payment reconciliation safely |

The importable skill is available in `workbuddy-skill/kithrelay` and from the website's **WorkBuddy sync** page. Folder reconnection requires a user gesture when the browser expires permission, and automatic checking only runs while the website is open.

## Presentation and video kit

- [ChatGPT presentation prompt](submission/PRESENTATION_PROMPT.md)
- [Gemini clip-by-clip video prompts](submission/VIDEO_PROMPTS.md)
- [Ready-to-import video captions](submission/KITHRELAY_CAPTIONS.srt)
- [Synthetic-data screenshots](submission/assets)

## Safety

KithRelay is an administrative support prototype. Users must verify all outputs against the source documents and consult qualified professionals for medical decisions.

## License

MIT
