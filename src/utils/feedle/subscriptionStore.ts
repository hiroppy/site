const DB_NAME = "feedleSubscriptions";
const STORE_NAME = "ignoredItems";
const DB_VERSION = 1;

type SubscriptionType = "source";

type SubscriptionRecord = {
  key: string;
  type: SubscriptionType;
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

let dbPromise: Promise<IDBDatabase | null> | null = null;
let cachedDb: IDBDatabase | null = null;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof indexedDB !== "undefined";
}

function openDatabase(): Promise<IDBDatabase | null> {
  if (!isBrowser()) {
    return Promise.resolve(null);
  }

  if (cachedDb) {
    return Promise.resolve(cachedDb);
  }

  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise<IDBDatabase | null>((resolve) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const connection = (event.target as IDBOpenDBRequest).result;
      if (!connection.objectStoreNames.contains(STORE_NAME)) {
        connection.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };

    request.onsuccess = () => {
      cachedDb = request.result;
      resolve(cachedDb);
    };

    request.onerror = () => {
      console.warn("Feedle subscriptions DB failed to open", request.error);
      resolve(null);
    };
  });

  return dbPromise;
}

async function getStore(
  mode: IDBTransactionMode,
): Promise<IDBObjectStore | null> {
  const db = await openDatabase();
  if (!db) return null;

  try {
    const tx = db.transaction(STORE_NAME, mode);
    return tx.objectStore(STORE_NAME);
  } catch (error) {
    console.warn("Feedle subscription store unavailable", error);
    return null;
  }
}

function normalizeKey(type: SubscriptionType, id: string) {
  return `${type}:${id}`;
}

export async function readIgnoredSourceIds(): Promise<Set<string>> {
  const store = await getStore("readonly");
  if (!store) {
    return new Set();
  }

  return new Promise((resolve) => {
    const request = store.getAllKeys();
    request.onsuccess = () => {
      const keys = request.result as string[] | undefined;
      const ids = new Set<string>();
      keys?.forEach((key) => {
        const [, id] = key.split(":");
        if (id) ids.add(id);
      });
      resolve(ids);
    };
    request.onerror = () => resolve(new Set());
  });
}

export async function toggleSourceSubscription(
  type: SubscriptionType,
  id: string,
): Promise<boolean> {
  const store = await getStore("readwrite");
  if (!store) {
    return true;
  }

  const key = normalizeKey(type, id);

  return new Promise((resolve) => {
    const getRequest = store.get(key);

    getRequest.onsuccess = () => {
      const existed = !!getRequest.result;

      if (existed) {
        const deleteRequest = store.delete(key);
        deleteRequest.onsuccess = () => resolve(true);
        deleteRequest.onerror = () => resolve(false);
      } else {
        const record: SubscriptionRecord = {
          key,
          type,
          id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const putRequest = store.put(record);
        putRequest.onsuccess = () => resolve(false);
        putRequest.onerror = () => resolve(true);
      }
    };

    getRequest.onerror = () => resolve(true);
  });
}

export const SUBSCRIPTION_TYPE = {
  SOURCE: "source",
} as const;

export const SUBSCRIPTION_CHANGED_EVENT = "feedle:subscription-change";
export const ARTICLE_PREVIEW_EVENT = "feedle:article-preview";
