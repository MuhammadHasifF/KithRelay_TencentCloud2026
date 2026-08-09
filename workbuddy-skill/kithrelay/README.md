# KithRelay WorkBuddy Skill

An administrative copilot for a family caregiver managing one ageing relative's paperwork. It reconciles appointment letters, medication lists, and payment notices into a source-linked care calendar and doctor-visit briefing.

## What it does

Given a folder of care documents, the skill inventories, classifies, and reconciles them into two traceable drafts:

- **`care_calendar.md`** — Active appointments, medication changes, payment deadlines, and reconciliation notes with source filenames
- **`briefing.md`** — Next appointment summary, current medications, changes or conflicts, neutral questions for the clinician, and a complete source-file list

Both files end with a verification notice stating they are AI-assisted and must be verified against the original documents.

## How to use

1. Place the care documents you want to reconcile into a single folder.
2. Enable this skill for a new task in WorkBuddy.
3. Select that folder as the workspace.
4. Ask WorkBuddy to reconcile the documents and create the two draft files.

## Safety boundaries

- No diagnosis, prescription, or treatment recommendation
- No inference of missing medical facts
- Unclear conflicts are labeled, not silently resolved
- Every claim cites its source filename
- Every output includes a verification notice

## Install

Import `kithrelay-workbuddy.zip` from WorkBuddy's Skills area and enable KithRelay for a new task. If the desktop version uses user-level skill folders, place the extracted `kithrelay` folder in the WorkBuddy skills directory and restart WorkBuddy.
