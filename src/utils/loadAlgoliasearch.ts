import algoliasearch from "algoliasearch/lite";
import instantsearch from "instantsearch.js";
import { connectAutocomplete } from "instantsearch.js/es/connectors";

export const algolia = {
  algoliasearch,
  instantsearch,
  connectAutocomplete,
};
