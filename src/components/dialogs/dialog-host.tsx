"use client";

import type { ActiveDialog } from "@/context/dialog-context";

import {
  createElement,
  type ComponentType,
} from "react";

import { useDialog } from "@/hooks/use-dialog";

import { dialogRegistry } from "@/components/dialogs/dialog-registry";

/**
 * Shape the host renders through. Registration in `dialogRegistry` is checked against
 * each dialog's own payload type; this is only the dynamic lookup boundary, where the
 * name and payload have already been paired by `ActiveDialog`.
 */
type ResolvedDialog = ComponentType<Record<string, unknown> & { onClose: () => void }>;

interface DialogRendererProps {
  activeDialog: ActiveDialog;
  onClose: () => void;
}

function DialogRenderer({ activeDialog, onClose }: DialogRendererProps) {
  const Dialog = dialogRegistry[activeDialog.name] as ResolvedDialog | undefined;

  if (!Dialog) {
    return null;
  }

  return createElement(Dialog, {
    ...activeDialog.payload,
    onClose,
  });
}

/**
 * Single mount point for the feature dialogs, rendered once in the app providers.
 *
 * Adding a dialog means adding one entry to `dialogRegistry` — nothing here changes.
 */
export function DialogHost() {
  const { activeDialog, close } = useDialog();

  if (!activeDialog) {
    return null;
  }

  return (
    <DialogRenderer
      activeDialog={activeDialog}
      onClose={close}
    />
  );
}
