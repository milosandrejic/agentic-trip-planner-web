import axios from "axios";

export type ApiErrorCode = "AUTH_REQUIRED" | "HTTP_ERROR" | "NETWORK_ERROR" | "UNKNOWN_ERROR";

interface ApiErrorOptions {
  code: ApiErrorCode;
  status: number | null;
  cause: unknown;
}

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number | null;
  override readonly cause: unknown;

  constructor(message: string, { cause, code, status }: ApiErrorOptions) {
    super(message);
    this.name = "ApiError";
    this.cause = cause;
    this.code = code;
    this.status = status;
  }
}

function isErrorPayload(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getResponseMessage(data: unknown): string | null {
  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (!isErrorPayload(data)) {
    return null;
  }

  const message = data.detail ?? data.message;

  if (typeof message !== "string" || !message.trim()) {
    return null;
  }

  return message;
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? null;

    if (status === 401) {
      return new ApiError("Authentication is required.", {
        cause: error,
        code: "AUTH_REQUIRED",
        status,
      });
    }

    if (error.response) {
      const responseMessage = getResponseMessage(error.response.data);
      const message = responseMessage ?? `Request failed with status ${status}.`;

      return new ApiError(message, {
        cause: error,
        code: "HTTP_ERROR",
        status,
      });
    }

    return new ApiError(error.message || "Unable to reach the server.", {
      cause: error,
      code: "NETWORK_ERROR",
      status: null,
    });
  }

  const message = error instanceof Error ? error.message : "An unexpected error occurred.";

  return new ApiError(message, {
    cause: error,
    code: "UNKNOWN_ERROR",
    status: null,
  });
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
