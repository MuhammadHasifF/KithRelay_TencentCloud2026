# Synthetic demo fixtures

`mdm-tan` is a deliberately fictional dataset for the KithRelay demo. It contains one rescheduled appointment, one medication-strength change, one discontinuation, one newly listed medicine, and one payment deadline.

`expected` contains reference outputs for manual WorkBuddy evaluation. Wording may differ, but facts, reconciliation behavior, source links, and safety notices should match.

The repository does not include real patient information. The current browser demo reads text and text-layer PDFs. A genuine photo or scan should be processed through an approved OCR/WorkBuddy flow and then manually verified; renaming a text PDF to "scanned" is not a valid OCR test.
