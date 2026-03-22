import { ApiClient, ApiResponse } from '../../clients/api-client';
import {
  RWCreateArticlePayload,
  RWUpdateArticlePayload,
  RWArticleResponse,
  RWArticlesResponse,
} from '../../types/realworld.types';

export class RealWorldArticleService {
  constructor(private readonly client: ApiClient) {}

  async list(params?: Record<string, string>): Promise<ApiResponse<RWArticlesResponse>> {
    return this.client.get<RWArticlesResponse>('/articles', { params });
  }

  async feed(params?: Record<string, string>): Promise<ApiResponse<RWArticlesResponse>> {
    return this.client.get<RWArticlesResponse>('/articles/feed', { params });
  }

  async get(slug: string): Promise<ApiResponse<RWArticleResponse>> {
    return this.client.get<RWArticleResponse>(`/articles/${slug}`);
  }

  async create(payload: RWCreateArticlePayload): Promise<ApiResponse<RWArticleResponse>> {
    return this.client.post<RWArticleResponse>('/articles', payload);
  }

  async update(slug: string, payload: RWUpdateArticlePayload): Promise<ApiResponse<RWArticleResponse>> {
    return this.client.put<RWArticleResponse>(`/articles/${slug}`, payload);
  }

  async delete(slug: string): Promise<ApiResponse<unknown>> {
    return this.client.delete(`/articles/${slug}`);
  }

  async favorite(slug: string): Promise<ApiResponse<RWArticleResponse>> {
    return this.client.post<RWArticleResponse>(`/articles/${slug}/favorite`);
  }

  async unfavorite(slug: string): Promise<ApiResponse<RWArticleResponse>> {
    return this.client.delete<RWArticleResponse>(`/articles/${slug}/favorite`);
  }
}