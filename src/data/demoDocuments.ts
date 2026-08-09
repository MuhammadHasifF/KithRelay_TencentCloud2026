import type { SourceDocument } from '../types/care'

const createdAt = '2026-08-09T08:00:00.000Z'

export const demoDocuments: SourceDocument[] = [
  {
    id: 'profile-mdm-tan',
    name: '0_senior_profile.txt',
    kind: 'profile',
    mimeType: 'text/plain',
    addedAt: createdAt,
    content: `SENIOR PROFILE
Patient Name: TAN GEOK HUAY
Preferred Name: Mdm Tan
Age: 78
Conditions: Hypertension, Type 2 Diabetes
Allergies: Penicillin
Care arrangement: Lives with her daughter and family in Singapore.`,
  },
  {
    id: 'appointment-original',
    name: '1_appointment_letter.txt',
    kind: 'appointment',
    mimeType: 'text/plain',
    addedAt: createdAt,
    content: `SINGHEALTH POLYCLINICS
Public Healthcare Appointment Notice

Patient Name: TAN GEOK HUAY
Appointment Date: 15 August 2026
Appointment Time: 10:30 AM
Institution: Singapore General Hospital
Clinic: Specialist Outpatient Clinic (SOC) - Cardiology
Doctor/Team: Dr. Lim Wei Ming, Cardiology Team B
Location: Block 1, Level 3, SOC Cardiology
Appointment Reference: CAR-2026-08152034
Reason for Referral: Follow-up review, hypertension and irregular heartbeat monitoring`,
  },
  {
    id: 'appointment-reschedule',
    name: '2_appointment_reschedule.txt',
    kind: 'appointment',
    mimeType: 'text/plain',
    addedAt: createdAt,
    content: `SINGHEALTH POLYCLINICS
Appointment Rescheduling Notice

Patient Name: TAN GEOK HUAY
Your appointment reference CAR-2026-08152034 (Cardiology, Dr. Lim Wei Ming) has been RESCHEDULED.
Original Date: 15 August 2026, 10:30 AM
New Date: 22 August 2026, 9:00 AM
Institution: Singapore General Hospital
Clinic: Specialist Outpatient Clinic (SOC) - Cardiology
Location: Block 1, Level 3, SOC Cardiology
Please disregard the original appointment letter. All other details remain unchanged.`,
  },
  {
    id: 'medication-june',
    name: '3_medication_list_june.txt',
    kind: 'medication',
    mimeType: 'text/plain',
    addedAt: createdAt,
    content: `SINGHEALTH - Patient Medication List
List Date: 1 June 2026
Patient Name: TAN GEOK HUAY
Conditions: Hypertension, Type 2 Diabetes
Allergies: Penicillin

Amlodipine 5mg | 1 tablet once daily, morning | Hypertension | Regular | SGH Cardiology
Metformin 500mg | 1 tablet twice daily, with meals | Diabetes | Regular | Polyclinic
Panadol 500mg | 1-2 tablets as needed for pain, max 8/day | Pain relief | PRN | Self/OTC

Notes: Patient reports occasional dizziness in the mornings.`,
  },
  {
    id: 'medication-july',
    name: '4_medication_list_july.txt',
    kind: 'medication',
    mimeType: 'text/plain',
    addedAt: createdAt,
    content: `SINGHEALTH - Patient Medication List
List Date: 20 July 2026
Patient Name: TAN GEOK HUAY
Conditions: Hypertension, Type 2 Diabetes
Allergies: Penicillin

Amlodipine 10mg | 1 tablet once daily, morning | Hypertension | Regular | SGH Cardiology | 20 Jul 2026 (dose increased from 5mg)
Metformin 500mg | 1 tablet twice daily, with meals | Diabetes | Regular | Polyclinic
Vitamin D3 1000IU | 1 tablet daily | Supplement | Regular | Polyclinic

Notes: Amlodipine increased due to persistent morning dizziness and elevated home BP readings. Panadol discontinued, no longer needed.`,
  },
  {
    id: 'hospital-bill',
    name: '5_hospital_bill.txt',
    kind: 'bill',
    mimeType: 'text/plain',
    addedAt: createdAt,
    content: `Singapore General Hospital - Payment Advice

Patient Name: TAN GEOK HUAY
Visit Date: 20 July 2026
Department: SOC Cardiology
Consultation Fee: SGD 75.00
Subsidy Applied (CHAS Blue): -SGD 45.00
Amount Payable: SGD 30.00
Payment Due: 19 August 2026
Next follow-up recommended: 6-8 weeks from this visit.`,
  },
  {
    id: 'appointment-endocrinology',
    name: '6_endocrinology_appointment.txt',
    kind: 'appointment',
    mimeType: 'text/plain',
    addedAt: createdAt,
    content: `SINGHEALTH POLYCLINICS
Public Healthcare Appointment Notice

Patient Name: TAN GEOK HUAY
Appointment Date: 6 September 2026
Appointment Time: 2:15 PM
Institution: Singapore General Hospital
Clinic: Specialist Outpatient Clinic (SOC) - Endocrinology
Doctor/Team: Dr. Sarah Koh, Endocrinology Team A
Location: Block 2, Level 4, SOC Endocrinology
Appointment Reference: END-2026-09062215
Reason for Referral: Annual diabetes review and HbA1c follow-up`,
  },
]

