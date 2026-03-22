import { ApiClient, ApiResponse } from '../../clients/api-client';
import {
  ReqResLoginPayload,
  ReqResLoginResponse,
  ReqResRegisterPayload,
  ReqResRegisterResponse,
  ReqResErrorResponse,
} from '../../types/reqres.types';

export class ReqResAuthService {
  constructor(private readonly client: ApiClient) {}

  async login(payload: ReqResLoginPayload): Promise<ApiResponse<ReqResLoginResponse>> {
    return this.client.post<ReqResLoginResponse>('/api/login', payload);
  }

  async loginExpectingError(payload: ReqResLoginPayload): Promise<ApiResponse<ReqResErrorResponse>> {
    return this.client.post<ReqResErrorResponse>('/api/login', payload);
  }

  async register(payload: ReqResRegisterPayload): Promise<ApiResponse<ReqResRegisterResponse>> {
    return this.client.post<ReqResRegisterResponse>('/api/register', payload);
  }

  async registerExpectingError(payload: ReqResRegisterPayload): Promise<ApiResponse<ReqResErrorResponse>> {
    return this.client.post<ReqResErrorResponse>('/api/register', payload);
  }
}