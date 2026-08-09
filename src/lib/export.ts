import { formatDate, formatTime } from './date'
import { buildAppointmentBriefing } from './reconcile'
import type { CarePlan } from '../types/care'

function safe(value?: string) {
  return value?.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ') || 'Not stated'
}

export function careCalendarMarkdown(plan: CarePlan) {
  const rows = plan.timeline
    .filter((event) => event.status !== 'superseded')
    .map(
      (event) =>
        `| ${formatDate(event.date)} | ${event.time ? formatTime(event.time) : '—'} | ${safe(event.title)} | ${safe(event.detail)} | ${event.sources.map((source) => safe(source.documentName)).join(', ')} |`,
    )
    .join('\n')

  return `# ${plan.profile.preferredName}'s Care Calendar

Generated: ${new Date(plan.generatedAt).toLocaleString('en-SG')}

| Date | Time | Event | Details | Source document |
|---|---|---|---|---|
${rows || '| — | — | No dated events found | — | — |'}

## Reconciliation notes

${plan.flags.map((flag) => `- **${flag.title}:** ${flag.explanation}`).join('\n') || '- No reconciliation flags found.'}

> AI-assisted administrative summary. Verify every item against the original documents before acting.
`
}

export function appointmentBriefingMarkdown(plan: CarePlan) {
  const briefing = buildAppointmentBriefing(plan, plan.generatedAt.slice(0, 10))
  const appointment = briefing.appointment

  return `# Appointment Briefing — ${plan.profile.preferredName}

## Next appointment

${appointment ? `- **Date:** ${formatDate(appointment.date)} at ${formatTime(appointment.time)}
- **Clinic:** ${safe(appointment.clinic)}
- **Doctor/team:** ${safe(appointment.doctor)}
- **Location:** ${safe(appointment.location)}
- **Reason:** ${safe(appointment.reason)}
- **Reference:** ${safe(appointment.reference)}` : 'No upcoming appointment was found.'}

## Current documented medications

${briefing.medications.map((medication) => `- **${medication.name} ${medication.strength ?? ''}:** ${safe(medication.instructions)}${medication.indication ? ` — ${medication.indication}` : ''}`).join('\n') || '- No current medications were extracted.'}

## Changes and items to review

${briefing.reviewItems.map((item) => `- **${item.title}:** ${item.explanation}`).join('\n') || '- No changes were detected.'}

## Questions to ask

${briefing.suggestedQuestions.map((question, index) => `${index + 1}. ${question}`).join('\n')}

## Sources reviewed

${plan.documents.map((document) => `- ${document.name}`).join('\n')}

> ${briefing.disclaimer}
`
}

export function downloadText(filename: string, content: string, mimeType = 'text/markdown') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

