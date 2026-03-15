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

export interface Message {
  id: string
  threadId: string
  sender: "human" | "agent"
  content: string
  createdAt: number
}

export interface Thread {
  id: string
  agentId: string
  agentName: string
  lastMessage: string
  updatedAt: number
}

const DB_NAME = "agents-hall"
const DB_VERSION = 2

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = (event) => {
      const db = request.result
      const oldVersion = event.oldVersion

      if (oldVersion < 1) {
        db.createObjectStore("profile", { keyPath: "id" })
        db.createObjectStore("feedback", { keyPath: "id" })
      }
      if (oldVersion < 2) {
        const threadStore = db.createObjectStore("threads", { keyPath: "id" })
        threadStore.createIndex("agentId", "agentId", { unique: false })
        const messageStore = db.createObjectStore("messages", { keyPath: "id" })
        messageStore.createIndex("threadId", "threadId", { unique: false })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Profile
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

// Feedback
export async function saveFeedback(entry: FeedbackEntry): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction("feedback", "readwrite")
    tx.objectStore("feedback").put(entry)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// Threads
export async function getOrCreateThread(agentId: string, agentName: string): Promise<Thread> {
  const db = await openDB()

  // Check for existing thread
  const existing = await new Promise<Thread | null>((resolve, reject) => {
    const tx = db.transaction("threads", "readonly")
    const index = tx.objectStore("threads").index("agentId")
    const request = index.getAll(agentId)
    request.onsuccess = () => resolve(request.result[0] || null)
    request.onerror = () => reject(request.error)
  })

  if (existing) return existing

  const thread: Thread = {
    id: `THR-${Date.now()}`,
    agentId,
    agentName,
    lastMessage: "",
    updatedAt: Date.now(),
  }

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("threads", "readwrite")
    tx.objectStore("threads").put(thread)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })

  return thread
}

export async function getThreads(): Promise<Thread[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction("threads", "readonly")
    const request = tx.objectStore("threads").getAll()
    request.onsuccess = () => {
      const threads = request.result as Thread[]
      threads.sort((a, b) => b.updatedAt - a.updatedAt)
      resolve(threads)
    }
    request.onerror = () => reject(request.error)
  })
}

// Messages
export async function saveMessage(message: Message, threadId: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["messages", "threads"], "readwrite")

    tx.objectStore("messages").put(message)

    // Update thread's lastMessage
    const threadReq = tx.objectStore("threads").get(threadId)
    threadReq.onsuccess = () => {
      const thread = threadReq.result as Thread
      if (thread) {
        thread.lastMessage = message.content.slice(0, 80)
        thread.updatedAt = message.createdAt
        tx.objectStore("threads").put(thread)
      }
    }

    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getMessages(threadId: string): Promise<Message[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction("messages", "readonly")
    const index = tx.objectStore("messages").index("threadId")
    const request = index.getAll(threadId)
    request.onsuccess = () => {
      const messages = request.result as Message[]
      messages.sort((a, b) => a.createdAt - b.createdAt)
      resolve(messages)
    }
    request.onerror = () => reject(request.error)
  })
}
