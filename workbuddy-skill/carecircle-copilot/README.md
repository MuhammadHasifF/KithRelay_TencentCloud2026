# CareCircle Copilot WorkBuddy Skill

This package extends Tencent WorkBuddy with a source-linked eldercare paperwork reconciliation workflow.

## Install

1. Run `npm run package:skill` from the repository root.
2. Open WorkBuddy and go to Skills.
3. Import `artifacts/carecircle-copilot-workbuddy.zip`.
4. Enable the skill for a new task.
5. Select a copy of `fixtures/mdm-tan` as the workspace.
6. Use the task prompt from the CareCircle web application's WorkBuddy page.

The package uses the `SKILL.md` format already accepted during the team's WorkBuddy prototype test. WorkBuddy's public documentation also describes YAML-based skills; if the import interface changes, use WorkBuddy's built-in "create a skill" task with this `SKILL.md` as the requirements source.

