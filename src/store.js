import initialPosts from './data/posts'

const API = '/api/data.php'

const LS_KEY = 'qs_db'

const DEFAULTS = {
  posts:      initialPosts,
  categories: ['Golf','Polo & Equestrian','Wine','Farm & Village','Museum by Ando','The Land'],
  people:     ['Adrian Zecha','Nacho Figueras','Jonathan Breene','Ignacio Ramos Sr.','Howard Backen','Ignacio Ramos Jr.','Tom Doak','Jean-Michel Gathy','Tadao Ando','Kerry Hill'],
  password:   'admin123',
}

// ── In-memory cache ──────────────────────────────────────────────
let _cache = null

// ── localStorage helpers ─────────────────────────────────────────
function lsLoad() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function lsSave(db) {
  try {
    // Strip large images to avoid quota issues
    const safe = {
      ...db,
      posts: db.posts.map(p => ({ ...p, images: (p.images || []).slice(0, 3) }))
    }
    localStorage.setItem(LS_KEY, JSON.stringify(safe))
  } catch {}
}

// ── Remote API helpers ───────────────────────────────────────────
async function apiGet() {
  const res = await fetch(`${API}?key=all`, { cache: 'no-store' })
  if (!res.ok) throw new Error('API error')
  return res.json()
}

async function apiSet(key, data) {
  const res = await fetch(API, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ key, data }),
  })
  if (!res.ok) throw new Error('API save error')
}

// ── fetchAll: try API first, fall back to localStorage ───────────
export async function fetchAll() {
  try {
    const db = await apiGet()
    // Seed initial posts if server db is empty
    if (!db.posts || db.posts.length === 0) {
      const lsDb = lsLoad()
      db.posts = lsDb?.posts?.length ? lsDb.posts : initialPosts
      await apiSet('posts', db.posts)
    }
    _cache = { ...DEFAULTS, ...db }
    lsSave(_cache) // keep localStorage in sync as backup
    return _cache
  } catch {
    // API unavailable — use localStorage
    const lsDb = lsLoad()
    _cache = lsDb ? { ...DEFAULTS, ...lsDb } : { ...DEFAULTS }
    return _cache
  }
}

export function setCache(db) { _cache = db }

// ── Sync getters ─────────────────────────────────────────────────
export function getPosts()      { return _cache?.posts      ?? DEFAULTS.posts }
export function getCategories() { return _cache?.categories ?? DEFAULTS.categories }
export function getPeople()     { return _cache?.people     ?? DEFAULTS.people }
export function getPassword()   { return _cache?.password   ?? DEFAULTS.password }

export function getToldBy() {
  return [...new Set(getPosts().map(p => p.author).filter(Boolean).map(n => n.trim()))].sort()
}

export function getToldAbout() {
  return [...new Set(
    getPosts().flatMap(p => (p.related || '').split(/\s{2,}|\n|,/).map(n => n.trim())).filter(n => n.length > 0)
  )].sort()
}

// ── Save helpers: update cache + localStorage + API ──────────────
async function persist(key, data) {
  _cache = { ..._cache, [key]: data }
  lsSave(_cache)
  try { await apiSet(key, data) } catch {}
}

export async function savePosts(posts)       { await persist('posts', posts); return true }
export async function saveCategories(cats)   { await persist('categories', cats) }
export async function savePeople(people)     { await persist('people', people) }
export async function savePassword(pw)       { await persist('password', pw) }

export async function addPost(post) {
  const newPost = { ...post, id: Date.now() }
  await savePosts([...getPosts(), newPost])
  return newPost
}

export async function updatePost(updated) {
  await savePosts(getPosts().map(p => p.id === updated.id ? updated : p))
}

export async function deletePost(id) {
  await savePosts(getPosts().filter(p => p.id !== id))
}
