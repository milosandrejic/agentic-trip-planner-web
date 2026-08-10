"use client";

import {
  useEffect,
  type ReactNode,
  type PropsWithChildren,
} from "react";

import { useAuth } from "@/hooks/use-auth";

interface RequireAuthProps extends PropsWithChildren {
  fallback?: ReactNode;
}

export function RequireAuth({ children, fallback = null }: RequireAuthProps) {
  const {
    isAuthenticated,
    isLoading,
    openAuthDialog,
  } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openAuthDialog();
    }
  }, [isAuthenticated, isLoading, openAuthDialog]);

  if (isLoading || !isAuthenticated) {
    return fallback;
  }

  return children;
}
