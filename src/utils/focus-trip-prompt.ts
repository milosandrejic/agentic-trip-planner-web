export function focusTripPrompt(): void {
  const prompt = document.getElementById("trip-prompt");

  if (!(prompt instanceof HTMLElement)) {
    return;
  }

  prompt.scrollIntoView({ block: "center" });
  prompt.focus();
}
