/** Renders `duration_hours` the way the design does: "45 min", "2h", "1h 30 min". */
export function formatDuration(hours: number): string {
  if (!Number.isFinite(hours) || hours <= 0) {
    return "";
  }

  const totalMinutes = Math.round(hours * 60);

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const wholeHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${wholeHours}h`;
  }

  return `${wholeHours}h ${minutes} min`;
}
