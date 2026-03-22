import { ApiClient, ApiResponse } from '../../clients/api-client';
import {
  ReqResUserListResponse,
  ReqResSingleUserResponse,
  ReqResCreateUserPayload,
  ReqResCreatedUser,
} from '../../types/reqres.types';

export class ReqResUserService {
  constructor(private readonly client: ApiClient) {}

  async listUsers(page = 1): Promise<ApiResponse<ReqResUserListResponse>> {
    return this.client.get<ReqResUserListResponse>('/api/users', {
      params: { page: String(page) },
    });
  }

  async getUser(id: number): Promise<ApiResponse<ReqResSingleUserResponse>> {
    return this.client.get<ReqResSingleUserResponse>(`/api/users/${id}`);
  }

  async getUserNotFound(id: number): Promise<ApiResponse<Record<string, never>>> {
    return this.client.get<Record<string, never>>(`/api/users/${id}`);
  }

  async createUser(payload: ReqResCreateUserPayload): Promise<ApiResponse<ReqResCreatedUser>> {
    return this.client.post<ReqResCreatedUser>('/api/users', payload);
  }

  async updateUser(id: number, payload: Partial<ReqResCreateUserPayload>): Promise<ApiResponse<ReqResCreatedUser>> {
    return this.client.put<ReqResCreatedUser>(`/api/users/${id}`, payload);
  }

  async deleteUser(id: number): Promise<ApiResponse<unknown>> {
    return this.client.delete(`/api/users/${id}`);
  }
}