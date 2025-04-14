
const DB_NAME = 'EcommerceOrdersDB';
const STORE_NAME = 'orders';

export const openOrdersDB = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = (e) => reject(e);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: '_id' });
      }
    };
  });

export const storeInIndexedDB = async (key, value) => {
  const db = await openOrdersDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put({ ...value, _id: key });
  return tx.complete;
};

export const getFromIndexedDB = async (filterFn = null) => {
  const db = await openOrdersDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const all = request.result;
      resolve(filterFn ? all.filter(filterFn) : all);
    };
    request.onerror = (e) => reject(e);
  });
};

export const updateInIndexedDB = async (id, updates) => {
  const db = await openOrdersDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const existing = await new Promise((res) => {
    const req = store.get(id);
    req.onsuccess = () => res(req.result);
  });
  if (existing) {
    const updated = { ...existing, ...updates };
    store.put(updated);
  }
  return tx.complete;
};

export const deleteFromIndexedDB = async (id) => {
  const db = await openOrdersDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).delete(id);
  return tx.complete;
};
