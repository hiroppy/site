/**
 * Source visibility management utilities
 */

const STORAGE_KEY = "hiddenSources";

export class SourceVisibilityManager {
  private hiddenSources: Set<string>;

  constructor() {
    this.hiddenSources = new Set(this.loadFromStorage());
  }

  private loadFromStorage(): string[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.hiddenSources]));
  }

  isHidden(sourceId: string): boolean {
    return this.hiddenSources.has(sourceId);
  }

  toggle(sourceId: string): boolean {
    if (this.hiddenSources.has(sourceId)) {
      this.hiddenSources.delete(sourceId);
    } else {
      this.hiddenSources.add(sourceId);
    }
    this.saveToStorage();
    return this.hiddenSources.has(sourceId);
  }

  hide(sourceId: string): void {
    this.hiddenSources.add(sourceId);
    this.saveToStorage();
  }

  show(sourceId: string): void {
    this.hiddenSources.delete(sourceId);
    this.saveToStorage();
  }

  getHiddenSources(): string[] {
    return [...this.hiddenSources];
  }
}

export function updateVisibilityState(
  sourceCard: HTMLElement,
  eyeVisible: HTMLElement,
  eyeHidden: HTMLElement,
  isHidden: boolean,
): void {
  if (isHidden) {
    sourceCard.style.opacity = "0.5";
    sourceCard.style.pointerEvents = "none";
    eyeVisible.classList.add("hidden");
    eyeHidden.classList.remove("hidden");
  } else {
    sourceCard.style.opacity = "1";
    sourceCard.style.pointerEvents = "auto";
    eyeVisible.classList.remove("hidden");
    eyeHidden.classList.add("hidden");
  }
}
