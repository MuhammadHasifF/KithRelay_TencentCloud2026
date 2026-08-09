import { describe, expect, it, vi } from 'vitest'
import {
  queryWorkspacePermission,
  requestWorkspacePermission,
  scanWorkspace,
} from './workspace'

function createFile(name: string, content: string, lastModified: number) {
  const file = new File([content], name, { type: 'text/markdown', lastModified })
  Object.defineProperty(file, 'text', { value: async () => content })
  return file
}

function createDirectoryHandle(files: File[]) {
  const entries = files.map((file) => ({
    kind: 'file' as const,
    name: file.name,
    getFile: async () => file,
  }))

  return {
    kind: 'directory' as const,
    name: 'KithRelay-Demo',
    async *values() {
      for (const entry of entries) yield entry
    },
  } as unknown as FileSystemDirectoryHandle
}

describe('workspace bridge', () => {
  it('separates source documents from WorkBuddy result files', async () => {
    const handle = createDirectoryHandle([
      createFile('appointment.txt', 'Appointment source', 1),
      createFile('care_calendar.md', '# Calendar', 2),
      createFile('briefing.md', '# Briefing', 3),
    ])

    const snapshot = await scanWorkspace(handle)

    expect(snapshot.sourceFiles.map((file) => file.name)).toEqual(['appointment.txt'])
    expect(snapshot.calendar?.content).toBe('# Calendar')
    expect(snapshot.briefing?.content).toBe('# Briefing')
  })

  it('selects the latest timestamped draft preserved by the skill', async () => {
    const handle = createDirectoryHandle([
      createFile('care_calendar.md', 'Old calendar', 10),
      createFile('care_calendar_2026-08-09T143000.md', 'Newest calendar', 30),
      createFile('briefing_2026-08-09.md', 'Newest briefing', 25),
      createFile('briefing.md', 'Old briefing', 15),
    ])

    const snapshot = await scanWorkspace(handle)

    expect(snapshot.calendar?.filename).toBe('care_calendar_2026-08-09T143000.md')
    expect(snapshot.calendar?.content).toBe('Newest calendar')
    expect(snapshot.briefing?.filename).toBe('briefing_2026-08-09.md')
  })

  it('excludes KithRelay control files from the care-document set', async () => {
    const handle = createDirectoryHandle([
      createFile('KITHRELAY_TASK.md', 'Task instructions', 1),
      createFile('care_plan.json', '{}', 2),
      createFile('medication_list.md', 'Medication source', 3),
    ])

    const snapshot = await scanWorkspace(handle)

    expect(snapshot.sourceFiles.map((file) => file.name)).toEqual(['medication_list.md'])
  })

  it('queries and requests restored folder permission', async () => {
    const queryPermission = vi.fn().mockResolvedValue('prompt')
    const requestPermission = vi.fn().mockResolvedValue('granted')
    const handle = { queryPermission, requestPermission } as unknown as FileSystemDirectoryHandle

    await expect(queryWorkspacePermission(handle)).resolves.toBe('prompt')
    await expect(requestWorkspacePermission(handle)).resolves.toBe('granted')
    expect(queryPermission).toHaveBeenCalledWith({ mode: 'read' })
    expect(requestPermission).toHaveBeenCalledWith({ mode: 'read' })
  })
})
