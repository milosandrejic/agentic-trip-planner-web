"use client";

import {
  useRef,
  useEffect,
} from "react";

import { useAuth } from "@/hooks/use-auth";

type ProtectedAction = () => void | Promise<void>;

async function runProtectedAction(action: ProtectedAction): Promise<void> {
  try {
    await action();
  } catch (error) {
    console.error("Protected action failed.", error);
  }
}

export function useRequireAuth() {
  const pendingActionRef = useRef<ProtectedAction | null>(null);
  const {
    isAuthenticated,
    isLoading,
    openAuthDialog,
  } = useAuth();

  useEffect(() => {
    const pendingAction = pendingActionRef.current;

    if (isLoading || !pendingAction) {
      return;
    }

    if (!isAuthenticated) {
      openAuthDialog();

      return;
    }

    pendingActionRef.current = null;
    void runProtectedAction(pendingAction);
  }, [isAuthenticated, isLoading, openAuthDialog]);

  function requireAuth(action: ProtectedAction): void {
    if (isLoading) {
      pendingActionRef.current = action;

      return;
    }

    if (!isAuthenticated) {
      pendingActionRef.current = action;
      openAuthDialog();

      return;
    }

    void runProtectedAction(action);
  }

  return requireAuth;
}
