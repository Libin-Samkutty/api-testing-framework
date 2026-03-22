import { ApiClient, ApiResponse } from '../../clients/api-client';
import { RWProfileResponse } from '../../types/realworld.types';

export class RealWorldProfileService {
  constructor(private readonly client: ApiClient) {}

  async get(username: string): Promise<ApiResponse<RWProfileResponse>> {
    return this.client.get<RWProfileResponse>(`/profiles/${username}`);
  }

  async follow(username: string): Promise<ApiResponse<RWProfileResponse>> {
    return this.client.post<RWProfileResponse>(`/profiles/${username}/follow`);
  }

  async unfollow(username: string): Promise<ApiResponse<RWProfileResponse>> {
    return this.client.delete<RWProfileResponse>(`/profiles/${username}/follow`);
  }
}