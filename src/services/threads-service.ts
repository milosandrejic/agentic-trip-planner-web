import { apiClient } from "@/api/axios";

import type {
  PaginationParams,
  GetThreadResponse,
  SendMessageRequest,
  ListThreadsResponse,
  SendMessageResponse,
} from "@/types/api";

export async function listThreads(params: PaginationParams = {}): Promise<ListThreadsResponse> {
  const response = await apiClient.get<ListThreadsResponse>("/threads", { params });

  return response.data;
}

export async function getThread(
  threadId: string,
  params: PaginationParams = {},
): Promise<GetThreadResponse> {
  const response = await apiClient.get<GetThreadResponse>(`/threads/${threadId}`, { params });

  return response.data;
}

export async function sendMessage(
  threadId: string,
  request: SendMessageRequest,
): Promise<SendMessageResponse> {
  const response = await apiClient.post<SendMessageResponse>(
    `/threads/${threadId}/messages`,
    request,
  );

  return response.data;
}

export async function deleteThread(threadId: string): Promise<void> {
  await apiClient.delete(`/threads/${threadId}`);
}
