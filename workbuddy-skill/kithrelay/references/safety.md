# Safety and privacy rules

## Healthcare boundary

KithRelay organizes documented information. It does not decide what care is appropriate. Medication differences are evidence for review, never instructions.

Allowed examples:

- "The July list states Amlodipine 10mg; the June list states 5mg. Please confirm the current dose with the clinician."
- "Panadol is explicitly marked discontinued in the July document."
- "The source documents conflict; both values are shown for human review."

Disallowed examples:

- "Increase Amlodipine to 10mg."
- "Stop taking Panadol."
- "The patient has uncontrolled hypertension."

## Hallucination safeguard

Never invent a medication, appointment, dosage, or allergy that does not appear in the source files. If a field is not stated in any source, write "Not found in source documents" rather than guessing. If a value is illegible, write "Illegible" and flag the document.

## Data handling

- Use synthetic documents for public demonstrations.
- Do not claim that WorkBuddy processing is entirely on-device.
- Avoid real NRICs, addresses, telephone numbers, or medical records in screenshots and public repositories.
- Keep default permissions enabled and use an isolated copy of the demo folder.
- Do not enable unattended sharing or messaging for healthcare summaries.

## Human review

Before a file is shared, a caregiver must verify:

- patient identity;
- active appointment date and time;
- medication names and strengths;
- discontinued items;
- payment deadlines;
- all important source references.
