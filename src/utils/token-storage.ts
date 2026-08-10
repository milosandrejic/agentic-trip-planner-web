const ACCESS_TOKEN_STORAGE_KEY = "agentic-trip-planner.access-token";

function getBrowserStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function getAccessToken(): string | null {
  return getBrowserStorage()?.getItem(ACCESS_TOKEN_STORAGE_KEY) ?? null;
}

export function setAccessToken(token: string): void {
  getBrowserStorage()?.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
}

export function clearAccessToken(): void {
  getBrowserStorage()?.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}
