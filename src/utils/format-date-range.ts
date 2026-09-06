import dayjs from "dayjs";

/**
 * "Sep 12 – Sep 19", or a single date when the range collapses.
 *
 * Null when there is no start, so the caller omits the element rather than rendering a
 * dash — trips created before the date fields existed have neither.
 */
export function formatDateRange(start: string | null, end: string | null): string | null {
  if (!start) {
    return null;
  }

  const startLabel = dayjs(start).format("MMM D");

  if (!end || end === start) {
    return startLabel;
  }

  return `${startLabel} – ${dayjs(end).format("MMM D")}`;
}
