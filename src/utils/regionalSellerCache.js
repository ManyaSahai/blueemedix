// src/utils/regionalSellerCache.js
import { openDB } from 'idb';

const DB_NAME = 'regional-admin-db';
const STORE_NAME = 'pending-sellers';

export const initSellerDB = async () => {
  return await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};

export const cachePendingSellers = async (sellers) => {
  const db = await initSellerDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  sellers.forEach((seller) => tx.store.put(seller));
  await tx.done;
};

export const getCachedPendingSellers = async () => {
  const db = await initSellerDB();
  return await db.getAll(STORE_NAME);
};

export const clearPendingSellerCache = async () => {
  const db = await initSellerDB();
  await db.clear(STORE_NAME);
};
