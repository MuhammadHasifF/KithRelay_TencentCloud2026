import { compareDates, parseDateValue, parseTimeValue, todayIso } from './date'
import type {
  Appointment,
  AppointmentBriefing,
  CareEvent,
  CarePlan,
  DocumentKind,
  Medication,
  Payment,
  ReviewFlag,
  SeniorProfile,
  SourceDocument,
  SourceReference,
} from '../types/care'

const fieldAliases = {
  patientName: ['Patient Name', 'Name'],
  preferredName: ['Preferred Name'],
  age: ['Age'],
  conditions: ['Conditions'],
  allergies: ['Allergies'],
  appointmentDate: ['Appointment Date'],
  appointmentTime: ['Appointment Time'],
  institution: ['Institution'],
  clinic: ['Clinic'],
  doctor: ['Doctor/Team', 'Doctor'],
  location: ['Location'],
  reference: ['Appointment Reference', 'Reference'],
  reason: ['Reason for Referral', 'Reason'],
  originalDate: ['Original Date'],
  newDate: ['New Date'],
  listDate: ['List Date'],
  amountPayable: ['Amount Payable', 'Balance Due'],
  paymentDue: ['Payment Due', 'Due Date'],
  department: ['Department'],
}

type MedicationSnapshot = {
  date?: string
  document: SourceDocument
  entries: MedicationEntry[]
  discontinuedNames: string[]
}

type MedicationEntry = {
  name: string
  strength?: string
  instructions?: string
  indication?: string
  excerpt: string
}

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function getField(content: string, aliases: readonly string[]) {
  const lines = content.split(/\r?\n/)
  for (const alias of aliases) {
    const matcher = new RegExp(`^\\s*${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:\\s*(.+)$`, 'i')
    const line = lines.find((candidate) => matcher.test(candidate))
    const value = line?.match(matcher)?.[1]?.trim()
    if (value) return value
  }
  return undefined
}

function sourceReference(document: SourceDocument, excerpt?: string): SourceReference {
  return {
    documentId: document.id,
    documentName: document.name,
    excerpt: excerpt?.trim() || document.content.split(/\r?\n/).find(Boolean) || document.name,
  }
}

function unique(values: Array<string | undefined>) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))]
}

export function inferDocumentKind(name: string, content: string): DocumentKind {
  const haystack = `${name}\n${content}`.toLowerCase()
  if (/medication|medicine|dosage|amlodipine|metformin/.test(haystack)) return 'medication'
  if (/appointment|specialist outpatient|reschedul/.test(haystack)) return 'appointment'
  if (/bill|payment due|amount payable|consultation fee/.test(haystack)) return 'bill'
  if (/senior profile|care arrangement|preferred name/.test(haystack)) return 'profile'
  return 'unknown'
}

function parseProfile(documents: SourceDocument[]): SeniorProfile {
  const profileDocument = documents.find((document) => document.kind === 'profile')
  const supportingDocument = documents.find((document) =>
    getField(document.content, fieldAliases.patientName),
  )
  const source = profileDocument ?? supportingDocument
  const name = source
    ? getField(source.content, fieldAliases.patientName) ?? 'Senior profile not provided'
    : 'Senior profile not provided'
  const preferredName = profileDocument
    ? getField(profileDocument.content, fieldAliases.preferredName) ?? name
    : name
  const ageValue = profileDocument && getField(profileDocument.content, fieldAliases.age)
  const conditions = unique(
    documents.flatMap((document) =>
      (getField(document.content, fieldAliases.conditions) ?? '')
        .split(',')
        .map((condition) => condition.trim()),
    ),
  )
  const allergies = unique(
    documents.flatMap((document) =>
      (getField(document.content, fieldAliases.allergies) ?? '')
        .split(',')
        .map((allergy) => allergy.trim()),
    ),
  )

  return {
    name,
    preferredName,
    age: ageValue ? Number(ageValue.match(/\d+/)?.[0]) : undefined,
    conditions,
    allergies,
  }
}

function appointmentReference(content: string) {
  return (
    getField(content, fieldAliases.reference) ??
    content.match(/appointment\s+reference\s+([A-Z0-9-]+)/i)?.[1]
  )
}

function parseAppointmentDocument(document: SourceDocument): Appointment | undefined {
  const isReschedule = /reschedul/i.test(document.content)
  const regularDateValue = getField(document.content, fieldAliases.appointmentDate)
  const newDateValue = getField(document.content, fieldAliases.newDate)
  const originalDateValue = getField(document.content, fieldAliases.originalDate)
  const date = parseDateValue(newDateValue ?? regularDateValue)
  if (!date) return undefined

  const reference = appointmentReference(document.content)
  const clinic = getField(document.content, fieldAliases.clinic)
  const doctor = getField(document.content, fieldAliases.doctor)

  return {
    id: `appointment-${slug(reference ?? `${date}-${clinic ?? document.name}`)}`,
    reference,
    date,
    time: parseTimeValue(newDateValue) ?? parseTimeValue(getField(document.content, fieldAliases.appointmentTime)),
    institution: getField(document.content, fieldAliases.institution),
    clinic,
    doctor,
    location: getField(document.content, fieldAliases.location),
    reason: getField(document.content, fieldAliases.reason),
    status: isReschedule ? 'rescheduled' : 'scheduled',
    originalDate: parseDateValue(originalDateValue),
    sources: [sourceReference(document, isReschedule ? newDateValue : regularDateValue)],
  }
}

function parseAppointments(documents: SourceDocument[]) {
  const parsed = documents
    .filter((document) => document.kind === 'appointment')
    .map(parseAppointmentDocument)
    .filter((appointment): appointment is Appointment => Boolean(appointment))

  const appointments = new Map<string, Appointment>()
  for (const appointment of parsed) {
    const key = (appointment.reference ?? appointment.id).toLowerCase()
    const existing = appointments.get(key)
    if (!existing) {
      appointments.set(key, appointment)
      continue
    }

    const preferred = appointment.status === 'rescheduled' ? appointment : existing
    const fallback = preferred === appointment ? existing : appointment
    appointments.set(key, {
      ...fallback,
      ...preferred,
      institution: preferred.institution ?? fallback.institution,
      clinic: preferred.clinic ?? fallback.clinic,
      doctor: preferred.doctor ?? fallback.doctor,
      location: preferred.location ?? fallback.location,
      reason: preferred.reason ?? fallback.reason,
      originalDate: preferred.originalDate ?? fallback.originalDate,
      sources: [...existing.sources, ...appointment.sources],
    })
  }

  return [...appointments.values()].sort((left, right) => compareDates(left.date, right.date))
}

function parseMedicationEntry(line: string): MedicationEntry | undefined {
  if (!line.includes('|')) return undefined
  const columns = line.split('|').map((column) => column.trim())
  const medicationMatch = columns[0].match(
    /^(.+?)\s+(\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|iu|units?))$/i,
  )
  if (!medicationMatch) return undefined

  return {
    name: medicationMatch[1].trim(),
    strength: medicationMatch[2].replace(/\s+/g, ''),
    instructions: columns[1],
    indication: columns[2],
    excerpt: line.trim(),
  }
}

function discontinuedNames(content: string) {
  const names: string[] = []
  for (const sentence of content.split(/[.\n]/)) {
    const match = sentence.match(/\b([A-Z][A-Za-z0-9]*(?:\s+[A-Z0-9][A-Za-z0-9]*){0,2})\s+discontinued\b/i)
    if (match) names.push(match[1].trim())
  }
  return unique(names)
}

function medicationReason(content: string, name: string) {
  const sentences = content.split(/[.\n]/).map((sentence) => sentence.trim())
  const sentence = sentences.find(
    (candidate) =>
      candidate.toLowerCase().includes(name.toLowerCase()) &&
      /due to|because|after|following/i.test(candidate),
  )
  if (!sentence) return undefined
  return sentence.match(/(?:due to|because|after|following)\s+(.+)$/i)?.[1]?.trim()
}

function compareStrength(
  previous?: string,
  current?: string,
): 'increased' | 'decreased' | undefined {
  if (!previous || !current || previous.toLowerCase() === current.toLowerCase()) return undefined
  const previousAmount = Number(previous.match(/[\d.]+/)?.[0])
  const currentAmount = Number(current.match(/[\d.]+/)?.[0])
  if (!Number.isFinite(previousAmount) || !Number.isFinite(currentAmount)) return undefined
  return currentAmount > previousAmount ? 'increased' : 'decreased'
}

function parseMedicationSnapshots(documents: SourceDocument[]): MedicationSnapshot[] {
  return documents
    .filter((document) => document.kind === 'medication')
    .map((document) => ({
      date: parseDateValue(getField(document.content, fieldAliases.listDate)),
      document,
      entries: document.content
        .split(/\r?\n/)
        .map(parseMedicationEntry)
        .filter((entry): entry is MedicationEntry => Boolean(entry)),
      discontinuedNames: discontinuedNames(document.content),
    }))
    .sort((left, right) => compareDates(left.date, right.date))
}

function parseMedications(documents: SourceDocument[]) {
  const snapshots = parseMedicationSnapshots(documents)
  if (snapshots.length === 0) return []

  const medicationNames = unique(
    snapshots.flatMap((snapshot) => [
      ...snapshot.entries.map((entry) => entry.name),
      ...snapshot.discontinuedNames,
    ]),
  )

  return medicationNames
    .map((name): Medication | undefined => {
      const history = snapshots
        .map((snapshot) => ({
          snapshot,
          entry: snapshot.entries.find(
            (candidate) => candidate.name.toLowerCase() === name.toLowerCase(),
          ),
        }))
        .filter((item) => item.entry)

      const latestSnapshot = snapshots.at(-1)!
      const latestHistory = history.find(
        ({ snapshot }) => snapshot.document.id === latestSnapshot.document.id,
      )
      const latestEntry = latestSnapshot.entries.find(
        (candidate) => candidate.name.toLowerCase() === name.toLowerCase(),
      )
      const previousEntry = latestEntry
        ? history.filter(({ snapshot }) => snapshot.document.id !== latestSnapshot.document.id).at(-1)?.entry
        : history.at(-1)?.entry
      const wasDiscontinued = latestSnapshot.discontinuedNames.some(
        (candidate) => candidate.toLowerCase() === name.toLowerCase(),
      )

      if (!latestEntry && !history.length) return undefined

      const strengthChange = compareStrength(previousEntry?.strength, latestEntry?.strength)
      const isNew = Boolean(latestEntry && !previousEntry && snapshots.length > 1)
      const change = wasDiscontinued
        ? {
            type: 'discontinued' as const,
            from: previousEntry?.strength ?? latestEntry?.strength,
            reason: medicationReason(latestSnapshot.document.content, name) ?? 'Document states it is no longer needed',
          }
        : strengthChange
          ? {
              type: strengthChange,
              from: previousEntry?.strength,
              to: latestEntry?.strength,
              reason: medicationReason(latestSnapshot.document.content, name),
            }
          : isNew
            ? {
                type: 'started' as const,
                to: latestEntry?.strength,
              }
            : undefined

      return {
        id: `medication-${slug(name)}`,
        name,
        strength: latestEntry?.strength ?? previousEntry?.strength,
        instructions: latestEntry?.instructions ?? previousEntry?.instructions,
        indication: latestEntry?.indication ?? previousEntry?.indication,
        status: wasDiscontinued ? 'discontinued' : latestEntry ? 'current' : 'uncertain',
        effectiveDate: latestHistory?.snapshot.date ?? history.at(-1)?.snapshot.date,
        change,
        sources: [
          ...history.map(({ snapshot, entry }) =>
            sourceReference(snapshot.document, entry?.excerpt),
          ),
          ...(wasDiscontinued && !history.some(({ snapshot }) => snapshot.document.id === latestSnapshot.document.id)
            ? [sourceReference(
                latestSnapshot.document,
                latestSnapshot.document.content
                  .split(/[.\n]/)
                  .find((sentence) => sentence.toLowerCase().includes(`${name.toLowerCase()} discontinued`)),
              )]
            : []),
        ],
      }
    })
    .filter((medication): medication is Medication => Boolean(medication))
    .sort((left, right) => left.name.localeCompare(right.name))
}

function parsePayments(documents: SourceDocument[], asOf: string): Payment[] {
  return documents
    .filter((document) => document.kind === 'bill')
    .map((document): Payment | undefined => {
      const dueDateValue = getField(document.content, fieldAliases.paymentDue)
      const dueDate = parseDateValue(dueDateValue)
      if (!dueDate) return undefined
      const amountValue = getField(document.content, fieldAliases.amountPayable)
      const amount = amountValue ? Number(amountValue.match(/[\d,.]+/)?.[0].replace(/,/g, '')) : undefined
      const department = getField(document.content, fieldAliases.department)

      return {
        id: `payment-${slug(`${document.name}-${dueDate}`)}`,
        description: department ? `${department} payment` : 'Healthcare payment',
        amount: Number.isFinite(amount) ? amount : undefined,
        dueDate,
        status: dueDate < asOf ? 'overdue' : 'upcoming',
        sources: [sourceReference(document, `${dueDateValue ?? ''} ${amountValue ?? ''}`)],
      }
    })
    .filter((payment): payment is Payment => Boolean(payment))
    .sort((left, right) => compareDates(left.dueDate, right.dueDate))
}

function buildFlags(
  appointments: Appointment[],
  medications: Medication[],
  payments: Payment[],
  documents: SourceDocument[],
): ReviewFlag[] {
  const flags: ReviewFlag[] = []

  const documentsByPatientName = documents
    .map((document) => ({
      document,
      patientName: getField(document.content, fieldAliases.patientName),
    }))
    .filter((item): item is { document: SourceDocument; patientName: string } => Boolean(item.patientName))
  const normalizedPatientNames = unique(
    documentsByPatientName.map((item) => item.patientName.toUpperCase().replace(/[^A-Z0-9]/g, '')),
  )

  if (normalizedPatientNames.length > 1) {
    flags.push({
      id: 'flag-mixed-patient-folder',
      severity: 'important',
      category: 'data-quality',
      title: 'Possible mixed-patient folder',
      explanation: `The documents contain ${normalizedPatientNames.length} different patient names. Separate and verify the files before using this plan.`,
      sourceIds: documentsByPatientName.map((item) => item.document.id),
      reviewed: false,
    })
  }

  if (documents.length > 0 && !documents.some((document) => document.kind === 'profile')) {
    flags.push({
      id: 'flag-profile-missing',
      severity: 'attention',
      category: 'data-quality',
      title: 'Senior profile not provided',
      explanation: 'Add a short profile with the senior’s preferred name, conditions, and allergies so the summary can be checked against the correct person.',
      sourceIds: [],
      reviewed: false,
    })
  }

  for (const appointment of appointments.filter((item) => item.status === 'rescheduled')) {
    flags.push({
      id: `flag-${appointment.id}-rescheduled`,
      severity: 'important',
      category: 'appointment',
      title: 'Appointment rescheduled',
      explanation: `The original ${appointment.originalDate ?? 'appointment date'} was replaced by ${appointment.date}. Only the new date appears in the active calendar.`,
      sourceIds: appointment.sources.map((source) => source.documentId),
      reviewed: false,
    })
  }

  for (const medication of medications.filter((item) => item.change)) {
    const change = medication.change!
    const summary = change.type === 'discontinued'
      ? `${medication.name} was marked as discontinued${change.reason ? `: ${change.reason}` : '.'}`
      : change.type === 'started'
        ? `${medication.name} ${change.to ?? ''} appears in the newest list but not the earlier list.`
        : `${medication.name} changed from ${change.from ?? 'an earlier dose'} to ${change.to ?? 'a new dose'}${change.reason ? ` because the document states: ${change.reason}` : '.'}`

    flags.push({
      id: `flag-${medication.id}-${change.type}`,
      severity: change.type === 'started' ? 'attention' : 'important',
      category: 'medication',
      title: `${medication.name} ${change.type}`,
      explanation: summary,
      sourceIds: medication.sources.map((source) => source.documentId),
      reviewed: false,
    })
  }

  for (const medication of medications.filter((item) => item.status === 'uncertain')) {
    flags.push({
      id: `flag-${medication.id}-uncertain`,
      severity: 'important',
      category: 'medication',
      title: `${medication.name} status is uncertain`,
      explanation: `${medication.name} appeared in an earlier list but is absent from the newest list without an explicit discontinuation statement. Do not assume it stopped; confirm against the source or with a qualified healthcare professional.`,
      sourceIds: medication.sources.map((source) => source.documentId),
      reviewed: false,
    })
  }

  for (const payment of payments) {
    flags.push({
      id: `flag-${payment.id}`,
      severity: payment.status === 'overdue' ? 'important' : 'information',
      category: 'payment',
      title: payment.status === 'overdue' ? 'Payment appears overdue' : 'Payment deadline found',
      explanation: `${payment.description} is due on ${payment.dueDate}${payment.amount ? ` for SGD ${payment.amount.toFixed(2)}` : ''}.`,
      sourceIds: payment.sources.map((source) => source.documentId),
      reviewed: false,
    })
  }

  for (const document of documents.filter((item) => item.kind === 'unknown')) {
    flags.push({
      id: `flag-${document.id}-unknown`,
      severity: 'attention',
      category: 'data-quality',
      title: 'Document needs manual classification',
      explanation: `${document.name} was read but its document type could not be identified reliably.`,
      sourceIds: [document.id],
      reviewed: false,
    })
  }

  return flags
}

function buildTimeline(
  appointments: Appointment[],
  medications: Medication[],
  payments: Payment[],
): CareEvent[] {
  const events: CareEvent[] = [
    ...appointments.map((appointment): CareEvent => ({
      id: `event-${appointment.id}`,
      date: appointment.date,
      time: appointment.time,
      type: 'appointment',
      title: appointment.clinic ?? 'Healthcare appointment',
      detail: [appointment.doctor, appointment.location, appointment.reason].filter(Boolean).join(' · '),
      status: 'active',
      sources: appointment.sources,
    })),
    ...payments.map((payment): CareEvent => ({
      id: `event-${payment.id}`,
      date: payment.dueDate,
      type: 'payment',
      title: payment.description,
      detail: payment.amount ? `SGD ${payment.amount.toFixed(2)} due` : 'Payment due',
      status: 'active',
      sources: payment.sources,
    })),
    ...medications
      .filter((medication) => medication.change && medication.effectiveDate)
      .map((medication): CareEvent => ({
        id: `event-${medication.id}`,
        date: medication.effectiveDate!,
        type: 'medication',
        title: `${medication.name} ${medication.change!.type}`,
        detail: medication.change?.reason ?? `${medication.change?.from ?? ''} ${medication.change?.to ? `→ ${medication.change.to}` : ''}`.trim(),
        status: 'completed',
        sources: medication.sources,
      })),
  ]

  return events.sort((left, right) => {
    const dateComparison = compareDates(left.date, right.date)
    return dateComparison || (left.time ?? '').localeCompare(right.time ?? '')
  })
}

export function buildCarePlan(inputDocuments: SourceDocument[], asOf = todayIso()): CarePlan {
  const documents = inputDocuments.map((document) => ({
    ...document,
    kind: document.kind === 'unknown'
      ? inferDocumentKind(document.name, document.content)
      : document.kind,
  }))
  const appointments = parseAppointments(documents)
  const medications = parseMedications(documents)
  const payments = parsePayments(documents, asOf)
  const flags = buildFlags(appointments, medications, payments, documents)

  return {
    generatedAt: new Date(`${asOf}T12:00:00`).toISOString(),
    profile: parseProfile(documents),
    documents,
    appointments,
    medications,
    payments,
    flags,
    timeline: buildTimeline(appointments, medications, payments),
  }
}

export function buildAppointmentBriefing(
  plan: CarePlan,
  asOf = todayIso(),
): AppointmentBriefing {
  const appointment = plan.appointments.find((item) => item.date >= asOf)
  const medications = plan.medications.filter((item) => item.status === 'current')
  const reviewItems = plan.flags.filter(
    (flag) => flag.category === 'medication' || flag.category === 'appointment',
  )
  const changedMedications = plan.medications.filter((medication) => medication.change)
  const suggestedQuestions = unique([
    changedMedications.length
      ? `Can we confirm the current medication list, including ${changedMedications.map((medication) => medication.name).join(', ')}?`
      : 'Can we confirm that the current medication list is complete?',
    changedMedications.find((medication) => medication.change?.reason)?.change?.reason
      ? `Do the documented symptoms or reasons for the recent medication change need any follow-up?`
      : undefined,
    appointment?.reason
      ? `What should the family monitor after this ${appointment.reason.toLowerCase()} visit?`
      : 'What should the family monitor after this visit?',
  ]).slice(0, 3)

  return {
    appointment,
    medications,
    reviewItems,
    suggestedQuestions,
    generatedAt: plan.generatedAt,
    disclaimer: 'AI-assisted administrative summary. Verify every item against the source documents and with a qualified healthcare professional before acting.',
  }
}
