/**
 * Offline support for the installed app.
 *
 * Navigations are network-first so a new deploy is picked up as soon as the
 * device is online, with the cached shell as the offline fallback. Build assets
 * carry content hashes in their names, so they are safe to serve cache-first.
 */
const CACHE = 'resume-builder-v1'

/** Resolved against this script's own URL, so the worker works at the domain
 *  root in development and under a sub-path on GitHub Pages alike. */
const url = (path) => new URL(path, self.location.href).href
const APP_SHELL = url('./index.html')

const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
].map(url)

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      // One missing file must not fail the whole install.
      .then((cache) => Promise.allSettled(SHELL.map((path) => cache.add(path))))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

async function networkFirst(request) {
  try {
    const response = await fetch(request)
    const cache = await caches.open(CACHE)
    await cache.put(APP_SHELL, response.clone())
    return response
  } catch {
    return (await caches.match(APP_SHELL)) || Response.error()
  }
}

async function cacheFirst(request) {
  const hit = await caches.match(request)
  if (hit) return hit
  const response = await fetch(request)
  if (response.ok && response.type === 'basic') {
    const cache = await caches.open(CACHE)
    await cache.put(request, response.clone())
  }
  return response
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  if (new URL(request.url).origin !== self.location.origin) return

  event.respondWith(request.mode === 'navigate' ? networkFirst(request) : cacheFirst(request))
})
