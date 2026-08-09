// Persists the caregiver's selected care folder so a returning visit does not
// require re-picking it, and re-checks permission without an extra prompt when
// the browser already granted it.

const DB_NAME = 'kithrelay'
const STORE_NAME = 'handles'
const HANDLE_KEY = 'workspace'

type PermissionCapableHandle = FileSystemDirectoryHandle & {
  queryPermission?: (descriptor: { mode: 'read' | 'readwrite' }) => Promise<PermissionState>
  requestPermission?: (descriptor: { mode: 'read' | 'readwrite' }) => Promise<PermissionState>
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveWorkspaceHandle(handle: FileSystemDirectoryHandle): Promise<void> {
  try {
    const database = await openDatabase()
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readwrite')
      transaction.objectStore(STORE_NAME).put(handle, HANDLE_KEY)
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
    database.close()
  } catch {
    // Persistence is a convenience; a failure here should never block the app.
  }
}

export async function loadWorkspaceHandle(): Promise<FileSystemDirectoryHandle | undefined> {
  try {
    const database = await openDatabase()
    const handle = await new Promise<FileSystemDirectoryHandle | undefined>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readonly')
      const request = transaction.objectStore(STORE_NAME).get(HANDLE_KEY)
      request.onsuccess = () => resolve(request.result as FileSystemDirectoryHandle | undefined)
      request.onerror = () => reject(request.error)
    })
    database.close()
    return handle
  } catch {
    return undefined
  }
}

export async function clearWorkspaceHandle(): Promise<void> {
  try {
    const database = await openDatabase()
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readwrite')
      transaction.objectStore(STORE_NAME).delete(HANDLE_KEY)
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
    database.close()
  } catch {
    // Ignore: clearing a convenience cache is best-effort.
  }
}

// Returns true when we already hold (or can silently obtain) the requested
// access. Pass requestIfNeeded=true from inside a user gesture to prompt.
export async function verifyWorkspacePermission(
  handle: FileSystemDirectoryHandle,
  requestIfNeeded: boolean,
  mode: 'read' | 'readwrite' = 'readwrite',
): Promise<boolean> {
  const capable = handle as PermissionCapableHandle
  const descriptor = { mode }
  if (capable.queryPermission && (await capable.queryPermission(descriptor)) === 'granted') {
    return true
  }
  if (requestIfNeeded && capable.requestPermission && (await capable.requestPermission(descriptor)) === 'granted') {
    return true
  }
  return false
}
