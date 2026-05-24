/**
 * =========================================================================
 * NEXUS CORE ENGINE (ZERO-TRUST) - FORTRESS EDITION
 * FILE: auth-fortress-HOUSE-OF-CHIEFS-drive-service-worker.js
 * VERSION: GEN 11.2 V50.008.001
 * =========================================================================
 */

const CACHE_NAME = "titan-fortress-HOUSE-OF-CHIEFS-v50008001";

// CRITICAL: Assets that must ALWAYS be pulled fresh from the network (Never Cached)
const BYPASS_PATHS = [
    '/.netlify/functions/',
    '/fleet-manifest.json',
    'firebase',
    'identitytoolkit',
    'googleapis'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    console.log(`[TITAN VANGUARD] SW-HUB: HOUSE-OF-CHIEFS Shield Installed. (${CACHE_NAME})`);
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys.map(key => {
                // Instantly vaporise any old versions of this specific node's cache
                if (key !== CACHE_NAME && key.startsWith('titan-fortress-HOUSE-OF-CHIEFS')) {
                    console.log(`[TITAN VANGUARD] Vaporising old cache: ${key}`);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    // 1. OMNI-WASH & API BYPASS (Always go direct to network, never cache)
    if (BYPASS_PATHS.some(path => requestUrl.href.includes(path)) || event.request.method !== 'GET') {
        return; // Let the browser handle it natively
    }

    // 2. NETWORK-FIRST STRATEGY (With Bunker Fallback)
    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                // If we get a secure, healthy response, clone it to the Titan Cache
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // If offline or network fails, fallback to the local Bunker (Cache)
                return caches.match(event.request).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // If not in cache and offline, throw the generic offline shield
                    return new Response("TITAN VANGUARD: DOMAIN OFFLINE. SECURE CONNECTION SEVERED.", {
                        status: 503,
                        headers: { "Content-Type": "text/plain" }
                    });
                });
            })
    );
});