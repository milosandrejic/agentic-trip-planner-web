function requirePublicEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getApiBaseUrl(): string {
  return requirePublicEnv(process.env.NEXT_PUBLIC_API_BASE_URL, "NEXT_PUBLIC_API_BASE_URL");
}

export function getGoogleMapsApiKey(): string {
  return requirePublicEnv(
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
  );
}
