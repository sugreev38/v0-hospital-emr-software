/// <reference lib="webworker" />

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.

declare const self: ServiceWorkerGlobalScope

const CACHE_NAME = "hospital-emr-cache-v1"
const OFFLINE_URL = "/offline"

// Add all the files to precache
const precacheResources = ["/", "/offline", "/patients", "/records", "/appointments"]

// Install event - precache resources
self.addEventListener("install", (event) => {
  console.log("Service worker installing...")

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service worker opened cache")
        return cache.addAll(precacheResources)
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting()
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service worker activating...")

  // Remove old caches
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Service worker removing old cache", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        // Tell the active service worker to take control of the page immediately
        return self.clients.claim()
      }),
  )
})

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // For navigation requests (HTML pages)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        // If offline, serve the offline page
        return caches.match(OFFLINE_URL)
      }),
    )
    return
  }

  // For other requests, use a "stale-while-revalidate" strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Use the cached version if it exists
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Update the cache with the new version
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone())
          })
          return networkResponse
        })
        .catch((error) => {
          console.error("Fetch failed:", error)
          // Return the cached version or offline fallback
          return cachedResponse
        })

      return cachedResponse || fetchPromise
    }),
  )
})

// Handle sync events for background syncing
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-data") {
    event.waitUntil(syncData())
  }
})

// Function to sync data with the server
async function syncData() {
  // This would normally communicate with your server
  console.log("Background sync started")

  // Get all clients
  const clients = await self.clients.matchAll()

  // Notify all clients that sync has started
  clients.forEach((client) => {
    client.postMessage({
      type: "SYNC_STARTED",
    })
  })

  // Simulate sync process
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Notify all clients that sync is complete
  clients.forEach((client) => {
    client.postMessage({
      type: "SYNC_COMPLETED",
    })
  })

  console.log("Background sync completed")
}

// This ensures the service worker takes control immediately
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
