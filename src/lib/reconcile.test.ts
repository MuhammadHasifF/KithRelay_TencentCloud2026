// @vitest-environment node

import { describe, expect, it } from 'vitest'
import { demoDocuments } from '../data/demoDocuments'
import type { SourceDocument } from '../types/care'
import { appointmentBriefingMarkdown, careCalendarMarkdown } from './export'
import { buildAppointmentBriefing, buildCarePlan, inferDocumentKind } from './reconcile'

const analysisDate = '2026-08-09'

describe('CareCircle reconciliation', () => {
  it('merges the original and rescheduled appointment into one active visit', () => {
    const plan = buildCarePlan(demoDocuments, analysisDate)
    const cardiology = plan.appointments.find((appointment) => appointment.reference === 'CAR-2026-08152034')

    expect(plan.appointments).toHaveLength(2)
    expect(cardiology).toMatchObject({
      date: '2026-08-22',
      time: '09:00',
      originalDate: '2026-08-15',
      status: 'rescheduled',
    })
    expect(cardiology?.sources.map((source) => source.documentName)).toEqual([
      '1_appointment_letter.txt',
      '2_appointment_reschedule.txt',
    ])
  })

  it('detects medication increases, starts, and explicit discontinuations', () => {
    const plan = buildCarePlan(demoDocuments, analysisDate)
    const amlodipine = plan.medications.find((medication) => medication.name === 'Amlodipine')
    const vitaminD = plan.medications.find((medication) => medication.name === 'Vitamin D3')
    const panadol = plan.medications.find((medication) => medication.name === 'Panadol')

    expect(amlodipine?.change).toMatchObject({ type: 'increased', from: '5mg', to: '10mg' })
    expect(amlodipine?.change?.reason).toContain('persistent morning dizziness')
    expect(vitaminD?.change).toMatchObject({ type: 'started', to: '1000IU' })
    expect(panadol?.status).toBe('discontinued')
    expect(panadol?.sources.map((source) => source.documentName)).toContain('4_medication_list_july.txt')
  })

  it('does not assume a medication stopped when it merely disappears', () => {
    const latestList = demoDocuments.find((document) => document.id === 'medication-july')!
    const withoutDiscontinuation: SourceDocument = {
      ...latestList,
      content: latestList.content.replace('Panadol discontinued, no longer needed.', ''),
    }
    const documents = demoDocuments.map((document) =>
      document.id === latestList.id ? withoutDiscontinuation : document,
    )
    const plan = buildCarePlan(documents, analysisDate)
    const panadol = plan.medications.find((medication) => medication.name === 'Panadol')

    expect(panadol?.status).toBe('uncertain')
    expect(plan.flags.find((flag) => flag.title === 'Panadol status is uncertain')?.severity).toBe('important')
  })

  it('stops silent reconciliation when documents appear to mix patients', () => {
    const foreignDocument: SourceDocument = {
      id: 'foreign-patient',
      name: 'other_patient_appointment.txt',
      kind: 'appointment',
      mimeType: 'text/plain',
      addedAt: '2026-08-09T00:00:00.000Z',
      content: `Patient Name: LIM MEI LING\nAppointment Date: 30 August 2026\nClinic: Neurology`,
    }
    const plan = buildCarePlan([...demoDocuments, foreignDocument], analysisDate)

    expect(plan.flags.find((flag) => flag.id === 'flag-mixed-patient-folder')).toMatchObject({
      severity: 'important',
      category: 'data-quality',
    })
  })

  it('extracts the payment deadline and produces source-linked exports', () => {
    const plan = buildCarePlan(demoDocuments, analysisDate)
    const calendar = careCalendarMarkdown(plan)
    const briefing = appointmentBriefingMarkdown(plan)

    expect(plan.payments[0]).toMatchObject({ dueDate: '2026-08-19', amount: 30, status: 'upcoming' })
    expect(calendar).toContain('22 Aug 2026')
    expect(calendar).toContain('1_appointment_letter.txt')
    expect(briefing).toContain('Amlodipine 10mg')
    expect(briefing).toContain('qualified healthcare professional')
    expect(calendar).not.toContain('$30.00')
  })

  it('builds a neutral briefing for the next appointment', () => {
    const plan = buildCarePlan(demoDocuments, analysisDate)
    const briefing = buildAppointmentBriefing(plan, analysisDate)

    expect(briefing.appointment?.date).toBe('2026-08-22')
    expect(briefing.medications.map((medication) => medication.name)).toEqual([
      'Amlodipine',
      'Metformin',
      'Vitamin D3',
    ])
    expect(briefing.suggestedQuestions).toHaveLength(3)
    expect(briefing.disclaimer).toContain('AI-assisted administrative summary')
  })

  it('classifies common care document types', () => {
    expect(inferDocumentKind('notice.txt', 'Appointment Date: 1 August 2026')).toBe('appointment')
    expect(inferDocumentKind('list.txt', 'Metformin 500mg | twice daily')).toBe('medication')
    expect(inferDocumentKind('invoice.txt', 'Amount Payable: SGD 30.00')).toBe('bill')
    expect(inferDocumentKind('notes.txt', 'Family discussed transport.')).toBe('unknown')
  })
})
