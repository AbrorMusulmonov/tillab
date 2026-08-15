import { localStore } from "./local";
import type { StoreAdapter } from "./types";

export function getStore(): StoreAdapter {
  return localStore;
}

export { seededAlternatives } from "./local";
