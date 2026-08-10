const ACCESS_TOKEN_STORAGE_KEY = "agentic-trip-planner.access-token";
const accessTokenListeners = new Set<() => void>();

function getBrowserStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function getAccessToken(): string | null {
  return getBrowserStorage()?.getItem(ACCESS_TOKEN_STORAGE_KEY) ?? null;
}

function notifyAccessTokenListeners(): void {
  accessTokenListeners.forEach((listener) => listener());
}

export function setAccessToken(token: string): void {
  getBrowserStorage()?.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  notifyAccessTokenListeners();
}

export function clearAccessToken(): void {
  getBrowserStorage()?.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  notifyAccessTokenListeners();
}

export function subscribeAccessToken(listener: () => void): () => void {
  function handleStorage(event: StorageEvent): void {
    if (event.key === ACCESS_TOKEN_STORAGE_KEY) {
      listener();
    }
  }

  accessTokenListeners.add(listener);
  window.addEventListener("storage", handleStorage);

  return () => {
    accessTokenListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}
