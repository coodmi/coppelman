import initialPosts from './data/posts'

const API = '/api/data.php'

const DEFAULT_CATEGORIES = [
  'Golf', 'Polo & Equestrian', 'Wine', 'Farm & Village', 'Museum by Ando', 'The Land',
]

const DEFAULT_PEOPLE = [
  'Adrian Zecha', 'Nacho Figueras', 'Jonathan Breene', 'Ignacio Ramos Sr.',
  'Howard Backen', 'Ignacio Ramos Jr.', 'Tom Doak', 'Jean-Michel Gathy',
  'Tadao Ando', 'Kerry Hill',
]

// ── Async API calls ──────────────────────────────────────────────

export async function fetchAll() {
  try {
    const res = await fetch(`${API}?key=all`)
    const db  = await res.json()
    // Seed posts from initial data if server has none
    if (!db.posts || db.posts.length === 0) {
      db.posts = initialPosts
      await saveRemote('posts', initialPosts)
    }
    return db
  } catch {
    return {
      posts:      initialPosts,
      categories: DEFAULT_CATEGORIES,
      people:     DEFAULT_PEOPLE,
      password:   'admin123',
    }
  }
}

async function saveRemote(key, data) {
  try {
    await fetch(API, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ key, data }),
    })
  } catch (e) {
    console.error('Save failed', e)
  }
}

// ── Sync helpers (used by admin components) ──────────────────────
// These return cached values from the last fetchAll, stored in module-level cache

let _cache = null

export function setCache(db) { _cache = db }

export function getPosts()      { return _cache?.posts      ?? initialPosts }
export function getCategories() { return _cache?.categories ?? DEFAULT_CATEGORIES }
export function getPeople()     { return _cache?.people     ?? DEFAULT_PEOPLE }
export function getPassword()   { return _cache?.password   ?? 'admin123' }

export function getToldBy() {
  const posts = getPosts()
  return [...new Set(posts.map(p => p.author).filter(Boolean).map(n => n.trim()))].sort()
}

export function getToldAbout() {
  const posts = getPosts()
  return [...new Set(
    posts.flatMap(p => (p.related || '').split(/\s{2,}|\n|,/).map(n => n.trim())).filter(n => n.length > 0)
  )].sort()
}

export async function savePosts(posts) {
  _cache = { ..._cache, posts }
  await saveRemote('posts', posts)
  return true
}

export async function saveCategories(cats) {
  _cache = { ..._cache, categories: cats }
  await saveRemote('categories', cats)
}

export async function savePeople(people) {
  _cache = { ..._cache, people }
  await saveRemote('people', people)
}

export async function savePassword(pw) {
  _cache = { ..._cache, password: pw }
  await saveRemote('password', pw)
}

export async function addPost(post) {
  const posts  = getPosts()
  const newPost = { ...post, id: Date.now() }
  await savePosts([...posts, newPost])
  return newPost
}

export async function updatePost(updated) {
  await savePosts(getPosts().map(p => p.id === updated.id ? updated : p))
}

export async function deletePost(id) {
  await savePosts(getPosts().filter(p => p.id !== id))
}
