import axios from "axios";

// prettier-ignore
import {
  getAccessToken,
  clearAccessToken,
} from "@/utils/token-storage";

import { getApiBaseUrl } from "@/config/env";
import { normalizeApiError } from "@/api/errors";

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
});

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = normalizeApiError(error);

    if (apiError.code === "AUTH_REQUIRED") {
      clearAccessToken();
    }

    return Promise.reject(apiError);
  },
);
