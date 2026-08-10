"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  useState,
  useCallback,
  createContext,
  useSyncExternalStore,
  type PropsWithChildren,
} from "react";

import {
  useMe,
  useLogin,
  useRegister,
} from "@/hooks/use-auth-mutations";

import {
  getAccessToken,
  clearAccessToken,
  subscribeAccessToken,
} from "@/utils/token-storage";

import type {
  User,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";

interface AuthContextValue {
  closeAuthDialog: () => void;
  isAuthDialogOpen: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (request: LoginRequest) => Promise<void>;
  logout: () => void;
  openAuthDialog: () => void;
  register: (request: RegisterRequest) => Promise<void>;
  user: User | null;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function getServerAccessToken(): null {
  return null;
}

function subscribeHydration(): () => void {
  return () => undefined;
}

function getClientHydration(): true {
  return true;
}

function getServerHydration(): false {
  return false;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const isHydrated = useSyncExternalStore(
    subscribeHydration,
    getClientHydration,
    getServerHydration,
  );
  const accessToken = useSyncExternalStore(
    subscribeAccessToken,
    getAccessToken,
    getServerAccessToken,
  );
  const queryClient = useQueryClient();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const meQuery = useMe(Boolean(accessToken));
  const user = accessToken ? (meQuery.data ?? null) : null;
  const isLoading =
    !isHydrated ||
    loginMutation.isPending ||
    registerMutation.isPending ||
    (Boolean(accessToken) && meQuery.isPending);

  async function handleLogin(request: LoginRequest): Promise<void> {
    await loginMutation.mutateAsync(request);
    setIsAuthDialogOpen(false);
  }

  async function handleRegister(request: RegisterRequest): Promise<void> {
    await registerMutation.mutateAsync(request);
    setIsAuthDialogOpen(false);
  }

  function logout(): void {
    clearAccessToken();
    queryClient.removeQueries();
  }

  const openAuthDialog = useCallback(() => setIsAuthDialogOpen(true), []);
  const closeAuthDialog = useCallback(() => setIsAuthDialogOpen(false), []);

  return (
    <AuthContext.Provider
      value={{
        closeAuthDialog,
        isAuthDialogOpen,
        isAuthenticated: Boolean(user),
        isLoading,
        login: handleLogin,
        logout,
        openAuthDialog,
        register: handleRegister,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
