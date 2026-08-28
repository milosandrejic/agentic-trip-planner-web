"use client";

import {
  useState,
  useCallback,
  createContext,
  type PropsWithChildren,
} from "react";

import type {
  Hotel,
  Flight,
  Itinerary,
} from "@/types/itinerary";

/**
 * Payload each feature dialog needs when opened. Adding a dialog means adding an
 * entry here; `open()` is typed against it, so call sites cannot pass the wrong shape.
 */
export interface DialogPayloadMap {
  export: { itinerary: Itinerary; title: string };
  flights: { destination: string; flights: readonly Flight[] };
  hotels: { destination: string; hotels: readonly Hotel[] };
  map: { itinerary: Itinerary };
  share: { threadId: string; title: string };
}

export type DialogName = keyof DialogPayloadMap;

export type ActiveDialog = {
  [Name in DialogName]: { name: Name; payload: DialogPayloadMap[Name] };
}[DialogName];

interface DialogContextValue {
  activeDialog: ActiveDialog | null;
  close: () => void;
  open: <Name extends DialogName>(name: Name, payload: DialogPayloadMap[Name]) => void;
}

export const DialogContext = createContext<DialogContextValue | null>(null);

export function DialogProvider({ children }: PropsWithChildren) {
  const [activeDialog, setActiveDialog] = useState<ActiveDialog | null>(null);

  const open = useCallback(
    <Name extends DialogName>(name: Name, payload: DialogPayloadMap[Name]): void => {
      setActiveDialog({ name, payload } as ActiveDialog);
    },
    [],
  );

  const close = useCallback(() => setActiveDialog(null), []);

  return (
    <DialogContext.Provider
      value={{
        activeDialog,
        close,
        open,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
}
