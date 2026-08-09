export type AuthSession = {
  id: string
  name: string
  email: string
  demo: boolean
}

type LocalAccount = {
  id: string
  name: string
  email: string
  passwordHash: string
  salt: string
}

const accountsKey = 'kithrelay.accounts.v1'
const sessionKey = 'kithrelay.session.v1'

function readAccounts(): LocalAccount[] {
  try {
    return JSON.parse(localStorage.getItem(accountsKey) ?? '[]') as LocalAccount[]
  } catch {
    return []
  }
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function hashPassword(password: string, salt: string) {
  const input = new TextEncoder().encode(`${salt}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', input)
  return bytesToHex(new Uint8Array(digest))
}

export function restoreSession(): AuthSession | undefined {
  try {
    const session = sessionStorage.getItem(sessionKey)
    return session ? JSON.parse(session) as AuthSession : undefined
  } catch {
    return undefined
  }
}

export function saveSession(session: AuthSession) {
  sessionStorage.setItem(sessionKey, JSON.stringify(session))
}

export function clearSession() {
  sessionStorage.removeItem(sessionKey)
}

export function createDemoSession(): AuthSession {
  return {
    id: 'demo-caregiver',
    name: 'Demo Caregiver',
    email: 'demo@kithrelay.app',
    demo: true,
  }
}

export async function createLocalAccount(name: string, email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()
  const accounts = readAccounts()

  if (accounts.some((account) => account.email === normalizedEmail)) {
    throw new Error('An account with this email already exists on this browser.')
  }

  const saltBytes = crypto.getRandomValues(new Uint8Array(16))
  const salt = bytesToHex(saltBytes)
  const account: LocalAccount = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: await hashPassword(password, salt),
    salt,
  }

  localStorage.setItem(accountsKey, JSON.stringify([...accounts, account]))
  return { id: account.id, name: account.name, email: account.email, demo: false } satisfies AuthSession
}

export async function signInLocalAccount(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()
  const account = readAccounts().find((candidate) => candidate.email === normalizedEmail)

  if (!account || await hashPassword(password, account.salt) !== account.passwordHash) {
    throw new Error('Email or password is incorrect for this browser.')
  }

  return { id: account.id, name: account.name, email: account.email, demo: false } satisfies AuthSession
}
