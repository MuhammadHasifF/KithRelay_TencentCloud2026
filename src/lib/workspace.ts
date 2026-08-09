const databaseName = 'kithrelay.workspace.v1'
const storeName = 'handles'
const workspaceKey = 'care-folder'

export type WorkspacePermission = PermissionState | 'unsupported'

export type WorkspaceArtifact = {
  content: string
  filename: string
  lastModified: number
  size: number
}

export type WorkspaceSnapshot = {
  sourceFiles: File[]
  sourceSignature: string
  artifactSignature: string
  calendar?: WorkspaceArtifact
  briefing?: WorkspaceArtifact
}

type PermissionAwareDirectoryHandle = FileSystemDirectoryHandle & {
  queryPermission?: (descriptor?: { mode?: 'read' | 'readwrite' }) => Promise<PermissionState>
  requestPermission?: (descriptor?: { mode?: 'read' | 'readwrite' }) => Promise<PermissionState>
  values: () => AsyncIterableIterator<FileSystemHandle>
}

type ArtifactKind = 'calendar' | 'briefing'

type ArtifactCandidate = {
  file: File
  kind: ArtifactKind
}

function openDatabase() {
  if (typeof indexedDB === 'undefined') return Promise.resolve<IDBDatabase | undefined>(undefined)

  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1)

    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(storeName)) {
        request.result.createObjectStore(storeName)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('The saved workspace could not be opened.'))
  })
}

function runTransaction<T>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T>,
) {
  return openDatabase().then((database) => {
    if (!database) return undefined

    return new Promise<T>((resolve, reject) => {
      const transaction = database.transaction(storeName, mode)
      const request = action(transaction.objectStore(storeName))

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error ?? new Error('The saved workspace could not be updated.'))
      transaction.oncomplete = () => database.close()
      transaction.onerror = () => database.close()
      transaction.onabort = () => database.close()
    })
  })
}

export async function loadWorkspaceHandle() {
  const result = await runTransaction<FileSystemDirectoryHandle | undefined>('readonly', (store) => store.get(workspaceKey))
  return result
}

export async function saveWorkspaceHandle(handle: FileSystemDirectoryHandle) {
  await runTransaction<IDBValidKey>('readwrite', (store) => store.put(handle, workspaceKey))
}

export async function forgetWorkspaceHandle() {
  await runTransaction<undefined>('readwrite', (store) => store.delete(workspaceKey))
}

export async function queryWorkspacePermission(handle: FileSystemDirectoryHandle): Promise<WorkspacePermission> {
  const permissionHandle = handle as PermissionAwareDirectoryHandle
  if (!permissionHandle.queryPermission) return 'granted'
  return permissionHandle.queryPermission({ mode: 'read' })
}

export async function requestWorkspacePermission(handle: FileSystemDirectoryHandle): Promise<WorkspacePermission> {
  const permissionHandle = handle as PermissionAwareDirectoryHandle
  if (!permissionHandle.requestPermission) return 'granted'
  return permissionHandle.requestPermission({ mode: 'read' })
}

function identifyArtifact(filename: string): ArtifactKind | undefined {
  const normalizedName = filename.toLowerCase()
  if (/^care_calendar(?:[_-].+)?\.md$/.test(normalizedName)) return 'calendar'
  if (/^briefing(?:[_-].+)?\.md$/.test(normalizedName)) return 'briefing'
  return undefined
}

function isSupportedSource(file: File) {
  const normalizedName = file.name.toLowerCase()
  if (normalizedName === 'care_plan.json' || normalizedName === 'kithrelay_task.md') return false
  return /\.(txt|md|csv|json|pdf)$/i.test(file.name) || file.type.startsWith('image/')
}

function latestCandidate(candidates: ArtifactCandidate[], kind: ArtifactKind) {
  return candidates
    .filter((candidate) => candidate.kind === kind)
    .sort((left, right) => right.file.lastModified - left.file.lastModified || right.file.name.localeCompare(left.file.name))[0]
}

async function readArtifact(candidate?: ArtifactCandidate): Promise<WorkspaceArtifact | undefined> {
  if (!candidate) return undefined

  return {
    content: await candidate.file.text(),
    filename: candidate.file.name,
    lastModified: candidate.file.lastModified,
    size: candidate.file.size,
  }
}

export async function scanWorkspace(handle: FileSystemDirectoryHandle): Promise<WorkspaceSnapshot> {
  const sourceFiles: File[] = []
  const artifactCandidates: ArtifactCandidate[] = []

  for await (const entry of (handle as PermissionAwareDirectoryHandle).values()) {
    if (entry.kind !== 'file') continue

    const file = await (entry as FileSystemFileHandle).getFile()
    const artifactKind = identifyArtifact(file.name)

    if (artifactKind) {
      artifactCandidates.push({ file, kind: artifactKind })
    } else if (isSupportedSource(file)) {
      sourceFiles.push(file)
    }
  }

  sourceFiles.sort((left, right) => left.name.localeCompare(right.name))
  const calendarCandidate = latestCandidate(artifactCandidates, 'calendar')
  const briefingCandidate = latestCandidate(artifactCandidates, 'briefing')
  const [calendar, briefing] = await Promise.all([
    readArtifact(calendarCandidate),
    readArtifact(briefingCandidate),
  ])

  const sourceSignature = sourceFiles
    .map((file) => `${file.name}:${file.size}:${file.lastModified}`)
    .join('|')
  const artifactSignature = [calendar, briefing]
    .filter((artifact): artifact is WorkspaceArtifact => Boolean(artifact))
    .map((artifact) => `${artifact.filename}:${artifact.size}:${artifact.lastModified}`)
    .join('|')

  return {
    sourceFiles,
    sourceSignature,
    artifactSignature,
    calendar,
    briefing,
  }
}
