import type { ComponentType } from "react";
import type {
  DialogName,
  DialogPayloadMap,
} from "@/context/dialog-context";

import { HotelsDialog } from "./hotels-dialog";
import { FlightsDialog } from "./flights-dialog";

/**
 * A dialog component receives its payload as props, plus `onClose`.
 *
 * Registering one is a single line below — the host needs no per-dialog branching.
 */
export type DialogComponent<Name extends DialogName> = ComponentType<
  DialogPayloadMap[Name] & { onClose: () => void }
>;

export type DialogRegistry = {
  [Name in DialogName]?: DialogComponent<Name>;
};

export const dialogRegistry: DialogRegistry = {
  flights: FlightsDialog,
  hotels: HotelsDialog,
};
