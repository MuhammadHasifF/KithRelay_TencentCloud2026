# Manual handoff steps

These steps require your accounts, organizer access, or visual judgment and cannot be completed safely by the coding agent alone.

## 1. Confirm the organizer rules

- Open the original handbook or submission portal.
- Confirm the exact cutoff time, required filenames, and whether the main artifact is a live web link, Skill ZIP, or both.
- Save the organizer’s answer about GitHub/full-software submissions in the repository or team drive.

## 2. Push the committed repository

```bash
git push origin main
```

Review the commit history first. It contains separate application, reconciliation, interface, WorkBuddy, testing, and documentation milestones.

## 3. Import and run the WorkBuddy skill

1. Open WorkBuddy and sign in.
2. Go to **Skills** and import `artifacts/kithrelay-workbuddy.zip`.
3. Confirm the skill is enabled.
4. Copy `fixtures/mdm-tan` to an isolated demo folder.
5. Start a new task using that folder and default permissions.
6. In the web app, open **WorkBuddy** and copy the prepared task prompt.
7. Run the task.
8. Compare the generated files with `fixtures/expected` and complete the table in `docs/EVALUATION.md`.
9. Capture screenshots only after verifying the output.

If WorkBuddy rejects the ZIP, create a skill from natural language and provide `workbuddy-skill/kithrelay/SKILL.md` as the requirements source. Export the accepted package and replace the ZIP artifact.

## 4. Deploy the companion app

Recommended fastest route:

1. Import the GitHub repository into Vercel.
2. Confirm framework preset **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Deploy and open every navigation view on desktop and phone.
6. Verify the **Download WorkBuddy skill** button works from the deployed URL.

Tencent EdgeOne is also suitable if the organizers prefer Tencent deployment. Upload the contents of `dist` after running `npm run build`.

## 5. Items owned by you

- Presentation deck.
- Demo/video recording.
- Team member names and final branding.
- Social-media bonus post, if still part of the rules.
- Final portal upload and confirmation receipt.
