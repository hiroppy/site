/**
 * UI filtering utilities for subscription-based content filtering
 */

import {
  ClientSubscriptionManager,
  type SubscriptionType,
} from "./subscriptionManager";

export interface FilteringOptions {
  onFilterComplete?: (visibleCount: number, totalCount: number) => void;
  onError?: (error: Error) => void;
  debug?: boolean;
}

export class UIFiltering {
  private subscriptionManager: ClientSubscriptionManager;

  constructor() {
    this.subscriptionManager = ClientSubscriptionManager.getInstance();
  }

  /**
   * Filter sidebar sources based on subscription status
   */
  public async filterSidebarSources(
    options: FilteringOptions = {},
  ): Promise<void> {
    try {
      const servicesList = document.getElementById("sidebar-services");
      const sourcesCount = document.getElementById("sources-count");

      if (!servicesList) {
        if (options.debug) console.warn("Sidebar services list not found");
        return;
      }

      // Select all service links with data-source-id (excluding the "All" link)
      const serviceItems = servicesList.querySelectorAll("a[data-source-id]");
      let visibleCount = 0;

      if (options.debug)
        console.log("Found sidebar service items:", serviceItems.length);

      for (const item of serviceItems) {
        const sourceId = (item as HTMLElement).dataset.sourceId;

        if (sourceId) {
          const subscribed = await this.subscriptionManager.isSubscribed(
            "source",
            sourceId,
          );
          if (options.debug)
            console.log(`Source ${sourceId} subscribed:`, subscribed);

          if (subscribed) {
            (item as HTMLElement).style.display = "";
            visibleCount++;
          } else {
            (item as HTMLElement).style.display = "none";
          }
        }
      }

      if (options.debug)
        console.log(`Visible sources in sidebar: ${visibleCount}`);

      // Update count
      if (sourcesCount) {
        sourcesCount.textContent = `Sources (${visibleCount})`;
      }

      options.onFilterComplete?.(visibleCount, serviceItems.length);
    } catch (error) {
      if (options.debug)
        console.error("Error filtering sidebar sources:", error);
      options.onError?.(error as Error);
    }
  }

  /**
   * Filter articles based on source subscription status
   */
  public async filterArticles(options: FilteringOptions = {}): Promise<void> {
    try {
      const articlesGrid = document.getElementById("articles-grid");
      if (!articlesGrid) {
        if (options.debug) console.warn("Articles grid not found");
        return;
      }

      const articleCards = articlesGrid.querySelectorAll(".article-card");
      let visibleCount = 0;

      if (options.debug)
        console.log("Found article cards:", articleCards.length);

      for (const card of articleCards) {
        const sourceId = (card as HTMLElement).dataset.articleSourceId;

        if (sourceId) {
          const subscribed = await this.subscriptionManager.isSubscribed(
            "source",
            sourceId,
          );
          if (subscribed) {
            (card as HTMLElement).style.display = "";
            visibleCount++;
          } else {
            (card as HTMLElement).style.display = "none";
          }
        } else {
          // Show articles without source ID
          (card as HTMLElement).style.display = "";
          visibleCount++;
        }
      }

      if (options.debug)
        console.log(
          `Filtered articles: ${visibleCount} visible out of ${articleCards.length} total`,
        );

      options.onFilterComplete?.(visibleCount, articleCards.length);
    } catch (error) {
      if (options.debug) console.error("Error filtering articles:", error);
      options.onError?.(error as Error);
    }
  }

  /**
   * Update subscription button UI state
   */
  public updateSubscriptionButtonState(
    _button: HTMLElement,
    subscribedIcon: HTMLElement,
    unsubscribedIcon: HTMLElement,
    parentCard: HTMLElement,
    isSubscribed: boolean,
  ): void {
    if (isSubscribed) {
      parentCard.style.opacity = "1";
      subscribedIcon.classList.remove("hidden");
      unsubscribedIcon.classList.add("hidden");
    } else {
      parentCard.style.opacity = "0.5";
      subscribedIcon.classList.add("hidden");
      unsubscribedIcon.classList.remove("hidden");
    }
  }

  /**
   * Setup subscription toggle for a button element
   */
  public async setupSubscriptionToggle(
    button: HTMLElement,
    sourceId: string,
    type: SubscriptionType = "source",
    options: {
      onToggle?: (newState: boolean) => void;
      onError?: (error: Error) => void;
      debug?: boolean;
    } = {},
  ): Promise<void> {
    try {
      const sourceCard = button.closest(".source-card") as HTMLElement;
      const subscribedIcon = button.querySelector(
        ".subscribed-icon",
      ) as HTMLElement;
      const unsubscribedIcon = button.querySelector(
        ".unsubscribed-icon",
      ) as HTMLElement;

      if (!sourceCard || !subscribedIcon || !unsubscribedIcon) {
        if (options.debug)
          console.warn(
            `Missing elements for toggle button with source: ${sourceId}`,
          );
        return;
      }

      // Set initial state
      const initialState = await this.subscriptionManager.isSubscribed(
        type,
        sourceId,
      );
      this.updateSubscriptionButtonState(
        button,
        subscribedIcon,
        unsubscribedIcon,
        sourceCard,
        initialState,
      );

      if (options.debug) {
        console.log(`=== Setting initial state for ${sourceId} ===`);
        console.log(`Subscribed: ${initialState}`);
        console.log(`Card opacity: ${sourceCard.style.opacity}`);
        console.log(`=== End initial state ===`);
      }

      // Add click handler
      button.addEventListener("click", async (e) => {
        if (options.debug)
          console.log("Subscription button clicked!", sourceId);
        e.preventDefault();
        e.stopPropagation();

        try {
          const newSubscriptionState = await this.subscriptionManager.toggle(
            type,
            sourceId,
          );
          if (options.debug)
            console.log("New subscription state:", newSubscriptionState);

          this.updateSubscriptionButtonState(
            button,
            subscribedIcon,
            unsubscribedIcon,
            sourceCard,
            newSubscriptionState,
          );

          // Dispatch event to notify other components
          window.dispatchEvent(
            new CustomEvent("subscriptionChanged", {
              detail: { sourceId, subscribed: newSubscriptionState, type },
            }),
          );

          options.onToggle?.(newSubscriptionState);
        } catch (error) {
          if (options.debug)
            console.error("Failed to toggle subscription:", error);
          options.onError?.(error as Error);
        }
      });
    } catch (error) {
      if (options.debug)
        console.warn(`Failed to set initial state for ${sourceId}:`, error);
      options.onError?.(error as Error);
    }
  }

  /**
   * Initialize all subscription toggles in a container
   */
  public async initializeSubscriptionToggles(
    container: HTMLElement | Document = document,
    options: {
      onSetupComplete?: (count: number) => void;
      onError?: (error: Error) => void;
      debug?: boolean;
    } = {},
  ): Promise<void> {
    try {
      const subscriptionToggles = container.querySelectorAll(
        ".subscription-toggle",
      );
      if (options.debug)
        console.log("Found subscription toggles:", subscriptionToggles.length);

      let setupCount = 0;
      for (const [index, toggle] of subscriptionToggles.entries()) {
        const sourceId = (toggle as HTMLElement).getAttribute("data-source-id");

        if (sourceId) {
          await this.setupSubscriptionToggle(
            toggle as HTMLElement,
            sourceId,
            "source",
            {
              debug: options.debug,
              onError: options.onError,
            },
          );
          setupCount++;
        } else if (options.debug) {
          console.warn(`Missing source ID for toggle ${index}`);
        }
      }

      options.onSetupComplete?.(setupCount);
    } catch (error) {
      if (options.debug)
        console.error("Error initializing subscription toggles:", error);
      options.onError?.(error as Error);
    }
  }

  /**
   * Listen for subscription changes and trigger filtering
   */
  public setupSubscriptionEventListener(
    callbacks: {
      onSidebarFilter?: () => void;
      onArticleFilter?: () => void;
      debug?: boolean;
    } = {},
  ): void {
    window.addEventListener("subscriptionChanged", (event) => {
      const customEvent = event as CustomEvent;
      if (callbacks.debug) {
        console.log("Subscription changed:", customEvent.detail);
      }

      // Trigger filtering
      if (callbacks.onSidebarFilter) {
        callbacks.onSidebarFilter();
      } else {
        this.filterSidebarSources({ debug: callbacks.debug });
      }

      if (callbacks.onArticleFilter) {
        callbacks.onArticleFilter();
      } else {
        this.filterArticles({ debug: callbacks.debug });
      }
    });
  }
}

// Create singleton instance for global access
export const uiFiltering = new UIFiltering();

// Global debug utilities
declare global {
  interface Window {
    debugFeedleDB: {
      showIgnoredItems: () => Promise<void>;
      clearAllIgnored: () => Promise<void>;
      testSubscription: (sourceId: string) => Promise<boolean>;
    };
  }
}

// Setup global debug utilities
export function setupGlobalDebugUtils(): void {
  const manager = ClientSubscriptionManager.getInstance();

  window.debugFeedleDB = {
    async showIgnoredItems() {
      await manager.debugContents();
    },
    async clearAllIgnored() {
      await manager.clear();
      console.log("All ignored items cleared");
      location.reload();
    },
    async testSubscription(sourceId: string) {
      const result = await manager.isSubscribed("source", sourceId);
      console.log(`Source ${sourceId} is subscribed:`, result);
      return result;
    },
  };

  console.log(
    "Debug commands available: window.debugFeedleDB.showIgnoredItems(), window.debugFeedleDB.clearAllIgnored(), window.debugFeedleDB.testSubscription(sourceId)",
  );
}
