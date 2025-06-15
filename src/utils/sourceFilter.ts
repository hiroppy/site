/**
 * Source filtering utilities based on subscription status
 */

import { SubscriptionManager } from "./subscriptionManager";
import type { Source, ServiceGroup, Article } from "./articlesApi";

export class SourceFilter {
  private subscriptionManager: SubscriptionManager;

  constructor() {
    this.subscriptionManager = new SubscriptionManager();
  }

  /**
   * Filter sources based on subscription status
   */
  async filterSources(
    sources: Source[],
    showUnsubscribed: boolean = true,
  ): Promise<Source[]> {
    if (showUnsubscribed) {
      return sources;
    }

    const allSourceIds = sources.map((s) => s.id);
    const subscribedSourceIds =
      await this.subscriptionManager.getSubscribedItems("source", allSourceIds);
    return sources.filter((source) => subscribedSourceIds.includes(source.id));
  }

  /**
   * Filter service groups based on subscription status
   */
  async filterServiceGroups(
    serviceGroups: Record<string, ServiceGroup>,
    showUnsubscribed: boolean = true,
  ): Promise<Record<string, ServiceGroup>> {
    if (showUnsubscribed) {
      return serviceGroups;
    }

    const allSourceIds = Object.values(serviceGroups).flatMap((group) =>
      group.sources.map((s) => s.id),
    );
    const subscribedSourceIds =
      await this.subscriptionManager.getSubscribedItems("source", allSourceIds);
    const filteredGroups: Record<string, ServiceGroup> = {};

    for (const [serviceName, serviceGroup] of Object.entries(serviceGroups)) {
      const filteredSources = serviceGroup.sources.filter((source) =>
        subscribedSourceIds.includes(source.id),
      );

      if (filteredSources.length > 0) {
        filteredGroups[serviceName] = {
          ...serviceGroup,
          sources: filteredSources,
        };
      }
    }

    return filteredGroups;
  }

  /**
   * Filter articles based on source subscription status
   */
  async filterArticles(
    articles: Article[],
    allSourceIds: string[],
    showUnsubscribed: boolean = true,
  ): Promise<Article[]> {
    if (showUnsubscribed) {
      return articles;
    }

    const subscribedSourceIds =
      await this.subscriptionManager.getSubscribedItems("source", allSourceIds);

    return articles.filter((article) => {
      // If article doesn't have source info, show it
      if (!article.source) {
        return true;
      }

      // Check if the article's source is subscribed
      return subscribedSourceIds.some(
        (sourceId) =>
          article.source?.includes(sourceId) ||
          article.domain?.includes(sourceId),
      );
    });
  }

  /**
   * Get subscription status for a source
   */
  async isSourceSubscribed(sourceId: string): Promise<boolean> {
    return this.subscriptionManager.isSubscribed("source", sourceId);
  }

  /**
   * Get all subscribed sources
   */
  async getSubscribedSources(allSourceIds: string[]): Promise<string[]> {
    return this.subscriptionManager.getSubscribedItems("source", allSourceIds);
  }
}
