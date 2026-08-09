// Shared WorkBuddy task text and a small helper to drop it into the connected
// care folder, so the caregiver no longer has to copy and paste the prompt.

type WritableFileHandle = FileSystemFileHandle & {
  createWritable: () => Promise<{
    write: (data: string) => Promise<void>
    close: () => Promise<void>
  }>
}

type WritableDirectoryHandle = FileSystemDirectoryHandle & {
  getFileHandle: (name: string, options?: { create?: boolean }) => Promise<FileSystemFileHandle>
}

export function buildWorkBuddyTask(preferredName: string): string {
  return `Use the kithrelay skill on this folder for ${preferredName}. Read every source document, reconcile repeated or rescheduled appointments, compare medication lists chronologically, identify payment deadlines, and write care_calendar.md plus briefing.md into this same folder. Preserve source filenames for every important item. Do not provide medical advice, do not guess when documents conflict, and require human review before anything is shared.`
}

// The full TASK.md dropped into the folder: a short header for a human, plus the
// exact instruction WorkBuddy should follow.
export function buildTaskFile(preferredName: string): string {
  return `# KithRelay task for WorkBuddy

Open this folder in WorkBuddy, enable the KithRelay skill, then run the instruction below.
KithRelay wrote this file automatically when you connected the folder, so there is nothing to copy.

## Instruction

${buildWorkBuddyTask(preferredName)}

## Expected outputs

- care_calendar.md
- briefing.md

Written back into this same folder for review inside KithRelay.
`
}

export async function writeWorkspaceFile(
  handle: FileSystemDirectoryHandle,
  filename: string,
  content: string,
): Promise<void> {
  const fileHandle = await (handle as WritableDirectoryHandle).getFileHandle(filename, { create: true })
  const writable = await (fileHandle as WritableFileHandle).createWritable()
  await writable.write(content)
  await writable.close()
}
