/** Offset from an ASCII letter to its regional-indicator symbol. */
const REGIONAL_INDICATOR_OFFSET = 0x1f1e6 - 0x41;

/**
 * Flag emoji for an ISO 3166-1 alpha-2 code, by regional-indicator arithmetic — no
 * lookup table and no dependency.
 *
 * Returns null for anything that is not two ASCII letters, so an unexpected value omits
 * the flag rather than rendering replacement glyphs. Platforms without flag glyphs
 * (notably Windows) show the two letters instead, which still reads as a country.
 */
export function getFlagEmoji(countryCode: string | null): string | null {
  if (!countryCode) {
    return null;
  }

  const code = countryCode.trim().toUpperCase();

  if (!/^[A-Z]{2}$/.test(code)) {
    return null;
  }

  return String.fromCodePoint(
    ...Array.from(code, (letter) => letter.charCodeAt(0) + REGIONAL_INDICATOR_OFFSET),
  );
}
