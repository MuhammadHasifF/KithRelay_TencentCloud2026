export type DocumentKind =
  | 'appointment'
  | 'medication'
  | 'bill'
  | 'profile'
  | 'unknown'

export type SourceDocument = {
  id: string
  name: string
  kind: DocumentKind
  content: string
  addedAt: string
  mimeType: string
}

export type SeniorProfile = {
  name: string
  preferredName: string
  age?: number
  conditions: string[]
  allergies: string[]
}

export type SourceReference = {
  documentId: string
  documentName: string
  excerpt: string
}

export type Appointment = {
  id: string
  reference?: string
  date: string
  time?: string
  institution?: string
  clinic?: string
  doctor?: string
  location?: string
  reason?: string
  status: 'scheduled' | 'rescheduled' | 'cancelled'
  originalDate?: string
  sources: SourceReference[]
}

export type Medication = {
  id: string
  name: string
  strength?: string
  instructions?: string
  indication?: string
  status: 'current' | 'discontinued' | 'uncertain'
  effectiveDate?: string
  change?: {
    type: 'started' | 'increased' | 'decreased' | 'discontinued'
    from?: string
    to?: string
    reason?: string
  }
  sources: SourceReference[]
}

export type Payment = {
  id: string
  description: string
  amount?: number
  dueDate: string
  status: 'upcoming' | 'overdue' | 'paid'
  sources: SourceReference[]
}

export type ReviewFlag = {
  id: string
  severity: 'information' | 'attention' | 'important'
  category: 'appointment' | 'medication' | 'payment' | 'data-quality'
  title: string
  explanation: string
  sourceIds: string[]
  reviewed: boolean
}

export type CareEvent = {
  id: string
  date: string
  time?: string
  type: 'appointment' | 'payment' | 'medication'
  title: string
  detail: string
  status: 'active' | 'superseded' | 'completed'
  sources: SourceReference[]
}

export type CarePlan = {
  generatedAt: string
  profile: SeniorProfile
  documents: SourceDocument[]
  appointments: Appointment[]
  medications: Medication[]
  payments: Payment[]
  flags: ReviewFlag[]
  timeline: CareEvent[]
}

export type AppointmentBriefing = {
  appointment?: Appointment
  medications: Medication[]
  reviewItems: ReviewFlag[]
  suggestedQuestions: string[]
  generatedAt: string
  disclaimer: string
}

