import { apiClient } from "@/api/axios";

import type { PlacePhotoParams } from "@/types/api";

const DEFAULT_PLACE_PHOTO_MAX_WIDTH_PX = 800;
const PLACE_PHOTO_CACHE_LIMIT = 100;

const placePhotoCache = new Map<string, string>();
const pendingPlacePhotos = new Map<string, Promise<string>>();

function getCacheKey(photoReference: string, maxWidthPx: number): string {
  return `${photoReference}:${maxWidthPx}`;
}

function getCachedPhotoUrl(cacheKey: string): string | null {
  const cachedUrl = placePhotoCache.get(cacheKey);

  if (!cachedUrl) {
    return null;
  }

  placePhotoCache.delete(cacheKey);
  placePhotoCache.set(cacheKey, cachedUrl);

  return cachedUrl;
}

function evictOldestPhoto(): void {
  if (placePhotoCache.size <= PLACE_PHOTO_CACHE_LIMIT) {
    return;
  }

  const oldestCacheKey = placePhotoCache.keys().next().value;

  if (!oldestCacheKey) {
    return;
  }

  const oldestUrl = placePhotoCache.get(oldestCacheKey);

  placePhotoCache.delete(oldestCacheKey);

  if (oldestUrl) {
    URL.revokeObjectURL(oldestUrl);
  }
}

/**
 * `Activity.photo_url` and `cover_image_url` already arrive as full endpoint paths
 * (`/places/photos/places/…/photos/…`), so they are requested as-is.
 *
 * The endpoint matches on `places/<id>/photos/<id>` with literal slashes, so a bare
 * reference is joined per segment — `encodeURIComponent` on the whole value would escape
 * the slashes and fail the server's pattern check.
 */
function toPhotoPath(photoReference: string): string {
  if (photoReference.startsWith("/places/photos/")) {
    return photoReference;
  }

  const segments = photoReference
    .replace(/^\/+/, "")
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `/places/photos/${segments}`;
}

async function fetchPlacePhotoUrl(
  photoReference: string,
  maxWidthPx: number,
  cacheKey: string,
): Promise<string> {
  const params: PlacePhotoParams = { max_width_px: maxWidthPx };
  const response = await apiClient.get<Blob>(toPhotoPath(photoReference), {
    params,
    responseType: "blob",
  });
  const objectUrl = URL.createObjectURL(response.data);

  placePhotoCache.set(cacheKey, objectUrl);
  evictOldestPhoto();

  return objectUrl;
}

// If auth moves to an HttpOnly cookie, a Next route handler could forward that server-readable
// credential and stream the image through a same-origin URL instead.
export function resolvePlacePhotoUrl(
  photoReference: string,
  params: PlacePhotoParams = {},
): Promise<string> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Place photos can only be resolved in the browser."));
  }

  const maxWidthPx = params.max_width_px ?? DEFAULT_PLACE_PHOTO_MAX_WIDTH_PX;
  const cacheKey = getCacheKey(photoReference, maxWidthPx);
  const cachedUrl = getCachedPhotoUrl(cacheKey);

  if (cachedUrl) {
    return Promise.resolve(cachedUrl);
  }

  const pendingPhoto = pendingPlacePhotos.get(cacheKey);

  if (pendingPhoto) {
    return pendingPhoto;
  }

  const photoPromise = fetchPlacePhotoUrl(photoReference, maxWidthPx, cacheKey).finally(() => {
    pendingPlacePhotos.delete(cacheKey);
  });

  pendingPlacePhotos.set(cacheKey, photoPromise);

  return photoPromise;
}

export function clearPlacePhotoCache(): void {
  placePhotoCache.forEach((objectUrl) => URL.revokeObjectURL(objectUrl));
  placePhotoCache.clear();
}
