import initialPosts from './data/posts'

const POSTS_KEY      = 'qs_posts'
const CATS_KEY       = 'qs_categories'
const PEOPLE_KEY     = 'qs_people'
const TOLD_BY_KEY    = 'qs_told_by'
const TOLD_ABOUT_KEY = 'qs_told_about'
const PASS_KEY       = 'qs_password'

const DEFAULT_CATEGORIES = [
  'Golf', 'Polo & Equestrian', 'Wine', 'Farm & Village', 'Museum by Ando', 'The Land',
]

const DEFAULT_PEOPLE = [
  'Adrian Zecha', 'Nacho Figueras', 'Jonathan Breene', 'Ignacio Ramos Sr.',
  'Howard Backen', 'Ignacio Ramos Jr.', 'Tom Doak', 'Jean-Michel Gathy',
  'Tadao Ando', 'Kerry Hill',
]

const DEFAULT_TOLD_BY = [
  'Tom Doak', 'Nacho Figueras', 'Jonathan Breene', 'Howard Backen',
  'Tadao Ando', 'Kerry Hill', 'Jean-Michel Gathy',
]

const DEFAULT_TOLD_ABOUT = [
  'Adrian Zecha', 'Nacho Figueras', 'Ignacio Ramos Sr.', 'Ignacio Ramos Jr.',
  'Tom Doak', 'Jean-Michel Gathy', 'Kerry Hill', 'Howard Backen',
]

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getPosts()        { return load(POSTS_KEY, initialPosts) }
export function getCategories()  { return load(CATS_KEY, DEFAULT_CATEGORIES) }
export function getPeople()      { return load(PEOPLE_KEY, DEFAULT_PEOPLE) }
export function getToldBy()      { return load(TOLD_BY_KEY, DEFAULT_TOLD_BY) }
export function getToldAbout()   { return load(TOLD_ABOUT_KEY, DEFAULT_TOLD_ABOUT) }
export function getPassword()    { return localStorage.getItem(PASS_KEY) || 'admin123' }

export function savePosts(posts) {
  try {
    save(POSTS_KEY, posts)
    return true
  } catch (e) {
    // localStorage quota exceeded — strip images and retry
    const stripped = posts.map((p) => ({ ...p, images: (p.images || []).slice(0, 2) }))
    try { save(POSTS_KEY, stripped) } catch {}
    return false
  }
}
export function saveCategories(cats)       { save(CATS_KEY, cats) }
export function savePeople(people)         { save(PEOPLE_KEY, people) }
export function savePassword(pw)           { localStorage.setItem(PASS_KEY, pw) }

export function addPost(post) {
  const posts = getPosts()
  const newPost = { ...post, id: Date.now() }
  savePosts([...posts, newPost])
  return newPost
}

export function updatePost(updated) {
  savePosts(getPosts().map((p) => (p.id === updated.id ? updated : p)))
}

export function deletePost(id) {
  savePosts(getPosts().filter((p) => p.id !== id))
}
