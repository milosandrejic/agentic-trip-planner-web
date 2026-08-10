"use client";

// prettier-ignore
import {
  useState,
  useEffect,
  type ComponentPropsWithoutRef,
} from "react";

import { resolvePlacePhotoUrl } from "@/services/places-service";

interface PlacePhotoProps extends Omit<ComponentPropsWithoutRef<"img">, "alt" | "src"> {
  alt: string;
  fallbackSrc?: string;
  maxWidthPx?: number;
  photoReference: string;
}

interface ResolvedPhoto {
  maxWidthPx?: number;
  photoReference: string;
  src: string;
}

export function PlacePhoto({
  alt,
  fallbackSrc,
  maxWidthPx,
  photoReference,
  ...imageProps
}: PlacePhotoProps) {
  const [resolvedPhoto, setResolvedPhoto] = useState<ResolvedPhoto | null>(null);
  const isResolvedPhotoCurrent =
    resolvedPhoto?.photoReference === photoReference && resolvedPhoto.maxWidthPx === maxWidthPx;
  const src = isResolvedPhotoCurrent ? resolvedPhoto.src : fallbackSrc;

  useEffect(() => {
    let isCurrent = true;

    async function loadPhoto(): Promise<void> {
      try {
        const photoUrl = await resolvePlacePhotoUrl(photoReference, {
          max_width_px: maxWidthPx,
        });

        if (isCurrent) {
          setResolvedPhoto({
            maxWidthPx,
            photoReference,
            src: photoUrl,
          });
        }
      } catch (error) {
        if (isCurrent) {
          console.error("Unable to load place photo.", error);
        }
      }
    }

    void loadPhoto();

    return () => {
      isCurrent = false;
    };
  }, [maxWidthPx, photoReference]);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- Blob URLs cannot be optimized by next/image.
    <img {...imageProps} alt={alt} src={src} />
  );
}
