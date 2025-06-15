/**
 * Subscription management with IndexedDB for persistent storage
 * Supports multiple subscription types (sources, articles, etc.)
 */

export type SubscriptionType = "source" | "article" | "tag";

export interface IgnoredItem {
  id: string;
  type: SubscriptionType;
  createdAt: Date;
  updatedAt: Date;
}

export class SubscriptionManager {
  private dbName = "feedleSubscriptions";
  private dbVersion = 1;
  private storeName = "ignoredItems";
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, {
            keyPath: "key",
          });
          store.createIndex("type", "type", { unique: false });
        }
      };
    });
  }

  private getKey(type: SubscriptionType, id: string): string {
    return `${type}:${id}`;
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.initDB();
    }
    if (!this.db) {
      throw new Error("Database initialization failed");
    }
    return this.db;
  }

  async isSubscribed(type: SubscriptionType, id: string): Promise<boolean> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);

      return new Promise((resolve) => {
        const request = store.get(this.getKey(type, id));
        request.onsuccess = () => {
          const result = request.result;
          // If not in ignored list, then it's subscribed (default on)
          resolve(!result);
        };
        request.onerror = () => resolve(true); // Default to subscribed on error
      });
    } catch {
      return true; // Default to subscribed
    }
  }

  async subscribe(type: SubscriptionType, id: string): Promise<void> {
    // To subscribe, remove from ignored list
    const db = await this.ensureDB();
    const transaction = db.transaction([this.storeName], "readwrite");
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.delete(this.getKey(type, id));
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async unsubscribe(type: SubscriptionType, id: string): Promise<void> {
    // To unsubscribe, add to ignored list
    const db = await this.ensureDB();
    const transaction = db.transaction([this.storeName], "readwrite");
    const store = transaction.objectStore(this.storeName);

    const now = new Date();
    const item: IgnoredItem & { key: string } = {
      key: this.getKey(type, id),
      id,
      type,
      createdAt: now,
      updatedAt: now,
    };

    return new Promise((resolve, reject) => {
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async toggle(type: SubscriptionType, id: string): Promise<boolean> {
    const isCurrentlySubscribed = await this.isSubscribed(type, id);

    if (isCurrentlySubscribed) {
      await this.unsubscribe(type, id);
      return false;
    } else {
      await this.subscribe(type, id);
      return true;
    }
  }

  async getIgnoredItems(type: SubscriptionType): Promise<string[]> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const index = store.index("type");

      return new Promise((resolve, reject) => {
        const request = index.getAll(type);
        request.onsuccess = () => {
          const results = request.result;
          const ignoredIds = results.map((item) => item.id);
          resolve(ignoredIds);
        };
        request.onerror = () => reject(request.error);
      });
    } catch {
      return [];
    }
  }

  async getSubscribedItems(
    type: SubscriptionType,
    allItems: string[],
  ): Promise<string[]> {
    // Return all items except the ignored ones
    const ignoredItems = await this.getIgnoredItems(type);
    return allItems.filter((id) => !ignoredItems.includes(id));
  }

  async getAllIgnoredItems(): Promise<IgnoredItem[]> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);

      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
          const results = request.result;
          const items = results.map((item) => ({
            id: item.id,
            type: item.type,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          }));
          resolve(items);
        };
        request.onerror = () => reject(request.error);
      });
    } catch {
      return [];
    }
  }

  // Migration from old localStorage-based system
  async migrateFromLocalStorage(): Promise<void> {
    try {
      const hiddenSources = JSON.parse(
        localStorage.getItem("hiddenSources") || "[]",
      );

      // Convert hidden sources to ignored sources (they were already unsubscribed)
      for (const sourceId of hiddenSources) {
        await this.unsubscribe("source", sourceId);
      }

      // Clean up old localStorage
      localStorage.removeItem("hiddenSources");
    } catch (error) {
      console.warn("Failed to migrate from localStorage:", error);
    }
  }
}

// UI utility functions
export function updateSubscriptionState(
  element: HTMLElement,
  subscribedIcon: HTMLElement,
  unsubscribedIcon: HTMLElement,
  isSubscribed: boolean,
): void {
  if (isSubscribed) {
    element.style.opacity = "1";
    subscribedIcon.classList.remove("hidden");
    unsubscribedIcon.classList.add("hidden");
  } else {
    element.style.opacity = "0.5";
    subscribedIcon.classList.add("hidden");
    unsubscribedIcon.classList.remove("hidden");
  }
}
