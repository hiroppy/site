/**
 * Client-side subscription manager for browser environments
 * Handles subscription state with IndexedDB persistence
 */

export type SubscriptionType = "source" | "article" | "tag";

export interface IgnoredItem {
  id: string;
  type: SubscriptionType;
  createdAt: Date;
  updatedAt: Date;
}

export class ClientSubscriptionManager {
  private static instance: ClientSubscriptionManager;
  private dbName = "feedleSubscriptions";
  private dbVersion = 1;
  private storeName = "ignoredItems";
  private db: IDBDatabase | null = null;

  private constructor() {
    this.initDB();
  }

  public static getInstance(): ClientSubscriptionManager {
    if (!ClientSubscriptionManager.instance) {
      ClientSubscriptionManager.instance = new ClientSubscriptionManager();
    }
    return ClientSubscriptionManager.instance;
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error("IndexedDB error:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log("Database opened successfully");
        resolve();
      };

      request.onupgradeneeded = (event) => {
        console.log("Database upgrade needed");
        const database = (event.target as IDBOpenDBRequest).result;

        // Remove existing store if it exists
        if (database.objectStoreNames.contains(this.storeName)) {
          database.deleteObjectStore(this.storeName);
        }

        // Create new store
        const store = database.createObjectStore(this.storeName, {
          keyPath: "key",
        });
        store.createIndex("type", "type", { unique: false });
        console.log("Object store created:", this.storeName);
      };
    });
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

  private getKey(type: SubscriptionType, id: string): string {
    return `${type}:${id}`;
  }

  public async isSubscribed(
    type: SubscriptionType,
    id: string,
  ): Promise<boolean> {
    try {
      const db = await this.ensureDB();

      if (!db.objectStoreNames.contains(this.storeName)) {
        return true; // Default to subscribed
      }

      const transaction = db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);

      return new Promise((resolve) => {
        const request = store.get(this.getKey(type, id));
        request.onsuccess = () => {
          // If not in ignored list, then it's subscribed (default on)
          resolve(!request.result);
        };
        request.onerror = () => {
          console.warn(
            "Failed to read subscription status, defaulting to subscribed",
          );
          resolve(true);
        };
      });
    } catch (error) {
      console.warn("isSubscribed error:", error);
      return true; // Default to subscribed
    }
  }

  public async subscribe(type: SubscriptionType, id: string): Promise<void> {
    try {
      const db = await this.ensureDB();

      if (!db.objectStoreNames.contains(this.storeName)) {
        console.warn("Store not found, cannot subscribe");
        return;
      }

      const transaction = db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);

      return new Promise((resolve, reject) => {
        const request = store.delete(this.getKey(type, id));
        request.onsuccess = () => {
          console.log("Successfully subscribed to:", id);
          resolve();
        };
        request.onerror = () => {
          console.error("Failed to subscribe:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("Subscribe error:", error);
      throw error;
    }
  }

  public async unsubscribe(type: SubscriptionType, id: string): Promise<void> {
    try {
      const db = await this.ensureDB();

      if (!db.objectStoreNames.contains(this.storeName)) {
        console.warn("Store not found, cannot unsubscribe");
        return;
      }

      const transaction = db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);

      const item = {
        key: this.getKey(type, id),
        id,
        type,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return new Promise((resolve, reject) => {
        const request = store.put(item);
        request.onsuccess = () => {
          console.log("Successfully unsubscribed from:", id);
          resolve();
        };
        request.onerror = () => {
          console.error("Failed to unsubscribe:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("Unsubscribe error:", error);
      throw error;
    }
  }

  public async toggle(type: SubscriptionType, id: string): Promise<boolean> {
    try {
      const currentlySubscribed = await this.isSubscribed(type, id);

      if (currentlySubscribed) {
        await this.unsubscribe(type, id);
        return false;
      } else {
        await this.subscribe(type, id);
        return true;
      }
    } catch (error) {
      console.error("Toggle subscription error:", error);
      return true; // Default to subscribed on error
    }
  }

  public async getIgnoredItems(type: SubscriptionType): Promise<string[]> {
    try {
      const db = await this.ensureDB();

      if (!db.objectStoreNames.contains(this.storeName)) {
        return [];
      }

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

  public async getAllIgnoredItems(): Promise<IgnoredItem[]> {
    try {
      const db = await this.ensureDB();

      if (!db.objectStoreNames.contains(this.storeName)) {
        return [];
      }

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

  public async clear(): Promise<void> {
    try {
      const db = await this.ensureDB();

      if (!db.objectStoreNames.contains(this.storeName)) {
        return;
      }

      const transaction = db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);

      return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => {
          console.log("All ignored items cleared");
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("Failed to clear ignored items:", error);
      throw error;
    }
  }

  // Debug utilities
  public async debugContents(): Promise<void> {
    try {
      const items = await this.getAllIgnoredItems();
      console.log("=== Current DB Contents ===");
      console.log("Ignored items:", items);
      console.log("=== End DB Contents ===");
    } catch (error) {
      console.error("Error reading DB contents:", error);
    }
  }
}
