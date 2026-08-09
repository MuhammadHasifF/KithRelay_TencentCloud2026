const monthNumbers: Record<string, string> = {
  jan: '01',
  january: '01',
  feb: '02',
  february: '02',
  mar: '03',
  march: '03',
  apr: '04',
  april: '04',
  may: '05',
  jun: '06',
  june: '06',
  jul: '07',
  july: '07',
  aug: '08',
  august: '08',
  sep: '09',
  sept: '09',
  september: '09',
  oct: '10',
  october: '10',
  nov: '11',
  november: '11',
  dec: '12',
  december: '12',
}

export function parseDateValue(value?: string): string | undefined {
  if (!value) return undefined

  const normalized = value.trim().replace(/,/g, ' ')
  const isoMatch = normalized.match(/\b(20\d{2})-(\d{1,2})-(\d{1,2})\b/)
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2].padStart(2, '0')}-${isoMatch[3].padStart(2, '0')}`
  }

  const dayFirstMatch = normalized.match(
    /\b(\d{1,2})\s+([A-Za-z]+)\s+(20\d{2})\b/,
  )
  if (dayFirstMatch) {
    const month = monthNumbers[dayFirstMatch[2].toLowerCase()]
    if (month) {
      return `${dayFirstMatch[3]}-${month}-${dayFirstMatch[1].padStart(2, '0')}`
    }
  }

  const numericMatch = normalized.match(/\b(\d{1,2})[/-](\d{1,2})[/-](20\d{2})\b/)
  if (numericMatch) {
    return `${numericMatch[3]}-${numericMatch[2].padStart(2, '0')}-${numericMatch[1].padStart(2, '0')}`
  }

  return undefined
}

export function parseTimeValue(value?: string): string | undefined {
  if (!value) return undefined

  const match = value.match(/\b(\d{1,2}):(\d{2})\s*(AM|PM)?\b/i)
  if (!match) return undefined

  let hour = Number(match[1])
  const meridiem = match[3]?.toUpperCase()
  if (meridiem === 'PM' && hour < 12) hour += 12
  if (meridiem === 'AM' && hour === 12) hour = 0

  return `${String(hour).padStart(2, '0')}:${match[2]}`
}

export function formatDate(date: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(new Date(`${date}T00:00:00`))
}

export function formatTime(time?: string) {
  if (!time) return 'Time not stated'
  const [hour, minute] = time.split(':').map(Number)
  const date = new Date(2026, 0, 1, hour, minute)
  return new Intl.DateTimeFormat('en-SG', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function compareDates(left?: string, right?: string) {
  if (!left && !right) return 0
  if (!left) return 1
  if (!right) return -1
  return left.localeCompare(right)
}

export function todayIso() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

