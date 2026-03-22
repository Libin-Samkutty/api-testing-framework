import { ApiClient, ApiResponse } from '../../clients/api-client';
import {
  RWCreateCommentPayload,
  RWCommentResponse,
  RWCommentsResponse,
} from '../../types/realworld.types';

export class RealWorldCommentService {
  constructor(private readonly client: ApiClient) {}

  async list(slug: string): Promise<ApiResponse<RWCommentsResponse>> {
    return this.client.get<RWCommentsResponse>(`/articles/${slug}/comments`);
  }

  async create(slug: string, payload: RWCreateCommentPayload): Promise<ApiResponse<RWCommentResponse>> {
    return this.client.post<RWCommentResponse>(`/articles/${slug}/comments`, payload);
  }

  async delete(slug: string, commentId: number): Promise<ApiResponse<unknown>> {
    return this.client.delete(`/articles/${slug}/comments/${commentId}`);
  }
}