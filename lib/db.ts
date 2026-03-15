export interface HumanProfile {
  id: string
  name: string
  handle: string
  role: string
  skills: string[]
  availability: string
  collaborations: number
  rating: number
  bio: string
  seekingAgentType: string
  createdAt: number
}

export interface FeedbackEntry {
  id: string
  message: string
  rating: number
  createdAt: number
}

const DB_NAME = "agents-hall"
const DB_VERSION = 1

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains("profile")) {
        db.createObjectStore("profile", { keyPath: "id" })
      }
      if (!db.objectStoreNames.contains("feedback")) {
        db.createObjectStore("feedback", { keyPath: "id" })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveProfile(profile: HumanProfile): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction("profile", "readwrite")
    tx.objectStore("profile").put(profile)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getProfile(): Promise<HumanProfile | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction("profile", "readonly")
    const request = tx.objectStore("profile").getAll()
    request.onsuccess = () => resolve(request.result[0] || null)
    request.onerror = () => reject(request.error)
  })
}

export async function saveFeedback(entry: FeedbackEntry): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction("feedback", "readwrite")
    tx.objectStore("feedback").put(entry)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}
