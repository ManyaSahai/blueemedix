import { openDB } from 'idb';  // Import openDB from idb package
import getBaseUrl  from '../utils/baseURL';  // Import the backend base URL

const DB_NAME = 'SuperAdminDB';
const STORE_NAME = 'products';

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
      // console.log("Retrieved from IndexedDB:", request.result);
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

  // ✅ Normalize to array
  const items = Array.isArray(data) ? data : [data];

  items.forEach((item) => {
    if (item._id) {
      item.id = item._id;
      delete item._id;
    }

    if (!item.id) {
      console.error('Product does not have an id:', item);
      return;
    }

    store.put(item);
  });

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => {
      console.error("❌ Failed to store in IndexedDB:", e);
      reject("Failed to store in IndexedDB");
    };
  });
};


// Fetch products with Cache API + IndexedDB fallback
export const fetchAndCacheProducts = async () => {
  // Check if we have products in IndexedDB first
  const cachedDBData = await getFromIndexedDB();
  if (cachedDBData && cachedDBData.length > 0) {
    return cachedDBData;
  }

  // If no data in IndexedDB, try Cache API
  const cache = await caches.open('product-cache');
  const cachedResponse = await cache.match(`${getBaseUrl}/products`);
  if (cachedResponse) {
    const data = await cachedResponse.json();
    await storeInIndexedDB(data);  // Store the cached response in IndexedDB for future use
    return data;
  }

  // If no data in Cache, fetch from backend
  const response = await fetch(`${getBaseUrl}/products`);
  const responseClone = response.clone();  // Clone the response before reading
  const data = await response.json();

  // Cache the response for future use
  cache.put(`${getBaseUrl}/products`, responseClone);  // Cache the fetched products

  // Store the products in IndexedDB
  await storeInIndexedDB(data);

  return data;
};

// Add product to the backend and IndexedDB
export async function addProductToBackend(product) {
  const response = await fetch(`${getBaseUrl}/products/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) throw new Error('Failed to add product');
  return await response.json();
}

// Update product in the backend and IndexedDB
export async function updateProductInBackend(product) {
  const response = await fetch(`${getBaseUrl}/products/${product.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) throw new Error('Failed to update product');
  return await response.json();
}

// Delete product from the backend and IndexedDB
export async function deleteProductFromBackend(id) {
  const response = await fetch(`${getBaseUrl}/products/delete/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Failed to delete product');
  return await response.json();
}

// Add product to IndexedDB
export async function addProductToIndexedDB(product) {
  const db = await openDB(DB_NAME, 1);  // Open the DB with version 1
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.add(product);
  await tx.done;
  return product;
}

// Update product in IndexedDB
export async function updateProductInIndexedDB(product) {
  console.log('🧠 Entered updateProductInIndexedDB function');  // MUST SHOW THIS

  try {
    const db = await openDB(DB_NAME, 1);
    console.log('📦 DB opened:', db);

    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    console.log('📥 About to put product:', product);

    await store.put(product);
    await tx.done;

    console.log('✅ Product updated in IndexedDB');
    return product;
  } catch (err) {
    console.error('❌ Error in updateProductInIndexedDB:', err);
  }
}



// Delete product from IndexedDB
export async function deleteProductFromIndexedDB(id) {
  const db = await openDB(DB_NAME, 1);  // Open the DB with version 1
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.delete(id);
  await tx.done;
}
