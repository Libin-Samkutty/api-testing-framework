import { ApiClient, ApiResponse } from '../../clients/api-client';
import {
  RWRegisterPayload,
  RWLoginPayload,
  RWUserResponse,
  RWErrorResponse,
} from '../../types/realworld.types';

export class RealWorldAuthService {
  constructor(private readonly client: ApiClient) {}

  async register(payload: RWRegisterPayload): Promise<ApiResponse<RWUserResponse>> {
    const response = await this.client.post<RWUserResponse>('/users', payload);
    if (response.ok && response.body.user?.token) {
      this.client.setToken(response.body.user.token);
    }
    return response;
  }

  async login(payload: RWLoginPayload): Promise<ApiResponse<RWUserResponse>> {
    const response = await this.client.post<RWUserResponse>('/users/login', payload);
    if (response.ok && response.body.user?.token) {
      this.client.setToken(response.body.user.token);
    }
    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<RWUserResponse>> {
    return this.client.get<RWUserResponse>('/user');
  }

  async updateUser(
    fields: Partial<{ email: string; username: string; bio: string; image: string; password: string }>,
  ): Promise<ApiResponse<RWUserResponse>> {
    return this.client.put<RWUserResponse>('/user', { user: fields });
  }

  async loginExpectingError(payload: RWLoginPayload): Promise<ApiResponse<RWErrorResponse>> {
    return this.client.post<RWErrorResponse>('/users/login', payload);
  }

  async getCurrentUserUnauthorized(): Promise<ApiResponse<unknown>> {
    return this.client.unauthenticatedPost('/user');
  }
}