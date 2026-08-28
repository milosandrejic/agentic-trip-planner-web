"use client";

import { useContext } from "react";

import { DialogContext } from "@/context/dialog-context";

export function useDialog() {
  const dialog = useContext(DialogContext);

  if (!dialog) {
    throw new Error("useDialog must be used within a DialogProvider.");
  }

  return dialog;
}
