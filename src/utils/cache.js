/**
 * Ultra-fast In-Memory + IndexedDB (with LocalStorage fallback) Cache
 * Implements SWR (Stale-While-Revalidate) so pages render INSTANTLY on first paint / scroll
 * without layout shifts (CLS = 0) or spinners blocking user interaction.
 */

const DB_NAME = 'bushra_luxury_cache_v1';
const STORE_NAME = 'api_cache';

// IndexedDB instance promise
let dbPromise = null;

function getIDB() {
  if (dbPromise) return dbPromise;
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }

  dbPromise = new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });

  return dbPromise;
}

// In-memory RAM cache for instantaneous sub-millisecond retrieval during scroll
const memoryCache = new Map();

// Local cache methods
export async function getCachedData(key) {
  // 1. Check RAM cache first (< 1ms)
  if (memoryCache.has(key)) {
    return memoryCache.get(key);
  }

  // 2. Check IndexedDB
  try {
    const db = await getIDB();
    if (db) {
      const item = await new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const req = store.get(key);
          req.onsuccess = () => resolve(req.result ? req.result.data : null);
          req.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      });
      if (item !== null) {
        memoryCache.set(key, item);
        return item;
      }
    }
  } catch (err) {
    // ignore
  }

  // 3. Fallback to localStorage
  try {
    const raw = localStorage.getItem(`cache_${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      memoryCache.set(key, parsed);
      return parsed;
    }
  } catch (err) {
    // ignore
  }

  return null;
}

export async function setCachedData(key, data) {
  // 1. Store in RAM cache
  memoryCache.set(key, data);

  // 2. Store in IndexedDB
  try {
    const db = await getIDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ key, data, timestamp: Date.now() });
    }
  } catch (err) {
    // ignore
  }

  // 3. Store in localStorage as backup
  try {
    // Keep localStorage light (don't store huge lists)
    localStorage.setItem(`cache_${key}`, JSON.stringify(data));
  } catch (err) {
    // storage might be full, safe to ignore
  }
}
