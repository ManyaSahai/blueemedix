import { openDB } from 'idb'; // Import openDB from idb package

const DB_NAME = 'SuperAdminDB';
const STORE_NAME = 'products';
const FAKESTORE_API = 'https://fakestoreapi.com/products';

// Open IndexedDB
const openIndexedDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('Failed to open IndexedDB');
  });
};

// Get all products from IndexedDB
export const getFromIndexedDB = async () => {
  const db = await openIndexedDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      console.log("📦 Retrieved from IndexedDB:", request.result);
      resolve(request.result);
    };

    request.onerror = () => reject([]);
  });
};

// Store fetched products in IndexedDB
export const storeInIndexedDB = async (data) => {
  const db = await openIndexedDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);

  data.forEach((item) => {
    store.put(item); // `put` = add or update
  });

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      console.log("✅ Products stored in IndexedDB");
      resolve();
    };
    tx.onerror = (e) => {
      console.error("❌ Failed to store in IndexedDB:", e);
      reject("Failed to store in IndexedDB");
    };
  });
};

// Fetch with Cache API + IndexedDB fallback
export const fetchAndCacheProducts = async () => {
  const cachedDBData = await getFromIndexedDB();
  if (cachedDBData && cachedDBData.length > 0) {
    return cachedDBData;
  }

  const cache = await caches.open('product-cache');
  const cachedResponse = await cache.match(FAKESTORE_API);
  if (cachedResponse) {
    const data = await cachedResponse.json();
    await storeInIndexedDB(data);
    return data;
  }

  const response = await fetch(FAKESTORE_API);
  const responseClone = response.clone(); // ✅ clone before reading
  const data = await response.json();

  cache.put(FAKESTORE_API, responseClone); // ✅ safe now
  await storeInIndexedDB(data);
  return data;
};

// Add product to IndexedDB
export async function addProductToIndexedDB(product) {
  const db = await openDB(DB_NAME, 1); // Open the DB with version 1
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.add(product);
  await tx.done;
  return product;
}

// Update product in IndexedDB
export async function updateProductInIndexedDB(product) {
  const db = await openDB(DB_NAME, 1); // Open the DB with version 1
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.put(product);
  await tx.done;
  return product;
}

// Delete product from IndexedDB
export async function deleteProductFromIndexedDB(id) {
  const db = await openDB(DB_NAME, 1); // Open the DB with version 1
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.delete(id);
  await tx.done;
}
