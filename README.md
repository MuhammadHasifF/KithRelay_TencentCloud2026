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
- Connects the browser workspace with the KithRelay skill in WorkBuddy Desktop.

## Using the website

1. Open the [live application](https://kithrelay.vercel.app/).
2. Create a browser-local caregiver account, sign in, or choose **Explore the demo instantly**.
3. Review the included synthetic scenario, upload individual files, or select **WorkBuddy sync**.
4. Choose **Connect folder** and grant access to the folder containing the care documents.
5. Open WorkBuddy, select that same folder, enable the KithRelay skill, and paste the prepared task.
6. Return to KithRelay and choose **Sync results** to display `care_calendar.md` and `briefing.md` inside the website.

## How WorkBuddy connects

WorkBuddy is a desktop agent and does not publish a browser-embed API. KithRelay therefore uses an authorized shared folder as the connection:

```text
Care folder → KithRelay browser review
           → WorkBuddy + KithRelay skill
           → care_calendar.md + briefing.md
           → KithRelay Sync results
```

This follows WorkBuddy's documented task model: choose a working directory, let the agent read and write within it, and review the resulting artifacts. The website can also launch an installed Windows copy of WorkBuddy through its registered `workbuddy-ai://` desktop link.

## Account and privacy model

- Prototype accounts use a salted password hash stored only in the current browser.
- The signed-in session lasts for the current browser tab.
- Selected care documents are processed in browser memory and are not uploaded by KithRelay.
- WorkBuddy has separate cloud-processing terms when it processes the shared folder.
- KithRelay provides administrative organization, not diagnosis or medical advice.

## Project parts

| Part | Role |
|---|---|
| KithRelay web application | Account access, document review, reconciliation, evidence display, approval, and exports |
| Shared-folder connection | Moves selected sources and WorkBuddy results through one caregiver-authorized workspace |
| KithRelay WorkBuddy skill | Gives the desktop agent its workflow, output contract, and safety boundaries |
| Deterministic reconciliation engine | Powers the fast browser demo and automated regression coverage |
| Synthetic Mdm Tan scenario | Demonstrates appointment, medication, and payment reconciliation safely |

The importable skill is available in `workbuddy-skill/kithrelay` and from the website's **WorkBuddy sync** page.

## Safety

KithRelay is an administrative support prototype. Users must verify all outputs against the source documents and consult qualified professionals for medical decisions.

## License

MIT
