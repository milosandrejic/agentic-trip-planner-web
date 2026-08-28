"use client";

import { useDialog } from "@/hooks/use-dialog";

import { FlightsDialog } from "@/components/dialogs/flights-dialog";

/**
 * Single mount point for the feature dialogs, rendered once in the app providers.
 *
 * Each dialog adds its own case as it lands — flights (8.2), hotels (8.3), map (8.4),
 * export (8.5) and share (8.6) — so no workspace component owns open/close state.
 */
export function DialogHost() {
  const { activeDialog, close } = useDialog();

  if (!activeDialog) {
    return null;
  }

  if (activeDialog.name === "flights") {
    return (
      <FlightsDialog
        destination={activeDialog.payload.destination}
        flights={activeDialog.payload.flights}
        onClose={close}
      />
    );
  }

  return null;
}
