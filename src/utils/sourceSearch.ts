/**
 * Source search functionality
 */

export class SourceSearchManager {
  private searchInput: HTMLInputElement;
  private sourcesGrid: HTMLElement;
  private noResults: HTMLElement;
  private sourceCards: NodeListOf<HTMLElement>;

  constructor(
    searchInputId: string,
    sourcesGridId: string,
    noResultsId: string,
    sourceCardSelector: string = ".source-card",
  ) {
    const searchInput = document.getElementById(
      searchInputId,
    ) as HTMLInputElement;
    const sourcesGrid = document.getElementById(sourcesGridId);
    const noResults = document.getElementById(noResultsId);
    const sourceCards = document.querySelectorAll(
      sourceCardSelector,
    ) as NodeListOf<HTMLElement>;

    if (!searchInput || !sourcesGrid || !noResults) {
      throw new Error("Required elements not found");
    }

    this.searchInput = searchInput;
    this.sourcesGrid = sourcesGrid;
    this.noResults = noResults;
    this.sourceCards = sourceCards;

    this.init();
  }

  private init(): void {
    this.searchInput.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      this.handleSearch(target.value);
    });
  }

  private handleSearch(searchTerm: string): void {
    const normalizedTerm = searchTerm.toLowerCase().trim();
    let visibleCount = 0;

    this.sourceCards.forEach((card) => {
      const sourceName = card.getAttribute("data-source-name") || "";
      const sourceKind = card.getAttribute("data-source-kind") || "";

      const matches =
        sourceName.includes(normalizedTerm) ||
        sourceKind.includes(normalizedTerm);

      if (matches) {
        card.style.display = "";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    this.toggleNoResults(visibleCount === 0 && normalizedTerm !== "");
  }

  private toggleNoResults(show: boolean): void {
    if (show) {
      this.sourcesGrid.style.display = "none";
      this.noResults.style.display = "block";
    } else {
      this.sourcesGrid.style.display = "grid";
      this.noResults.style.display = "none";
    }
  }

  reset(): void {
    this.searchInput.value = "";
    this.sourceCards.forEach((card) => {
      card.style.display = "";
    });
    this.toggleNoResults(false);
  }

  onDialogClose(callback: () => void): void {
    // Find parent dialog element
    const dialog = this.searchInput.closest("dialog");
    if (dialog) {
      dialog.addEventListener("close", () => {
        this.reset();
        callback();
      });
    }
  }
}
