/**
 * =========================================================================
 * NEXUS CORE ENGINE (ZERO-TRUST) - FORTRESS EDITION
 * FILE: auth-fortress-house-of-chiefs-drive-service-worker.js
 * TARGET REPO: TITAN-CORE-OS-BUNDLE
 * SYSTEM CATEGORY: AUTH-FORTRESS
 * VERSION: GEN 11.2 V51.002.001
 * =========================================================================
 */
const CACHE_NAME = 'titan-core-os-vanguard-cache-v43.011.008';
const OFFLINE_URL = '/commitment-and-promises-crucible-forge.encryption.hub.html';

self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(OFFLINE_URL))
        );
    }
});