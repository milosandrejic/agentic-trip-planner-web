// prettier-ignore
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { setAccessToken } from "@/utils/token-storage";

import { queryKeys } from "@/api/query-keys";
// prettier-ignore
import {
  getMe,
  login,
  register,
} from "@/services/auth-service";

// prettier-ignore
import type {
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      queryClient.removeQueries();
      setAccessToken(response.access_token);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: RegisterRequest) => {
      const user = await register(request);
      const loginRequest: LoginRequest = {
        email: request.email,
        password: request.password,
      };
      const session = await login(loginRequest);

      return { session, user };
    },
    onSuccess: ({ session, user }) => {
      queryClient.removeQueries();
      setAccessToken(session.access_token);
      queryClient.setQueryData(queryKeys.me, user);
    },
  });
}

export function useMe(isEnabled = true) {
  return useQuery({
    enabled: isEnabled,
    queryFn: getMe,
    queryKey: queryKeys.me,
    retry: false,
  });
}
