import { APIRequestContext, APIResponse } from '@playwright/test';
import { Logger } from '../utils/logger';

export interface ApiResponse<T = unknown> {
  status: number;
  headers: { [key: string]: string };
  body: T;
  ok: boolean;
  raw: APIResponse;
}

export class ApiClient {
  private token: string | null = null;
  private readonly logger = new Logger('ApiClient');

  constructor(
    private readonly context: APIRequestContext,
    private readonly basePrefix: string = '',
  ) {}

  // ── Token management ──

  setToken(token: string): void {
    this.token = token;
    this.logger.debug(`Token set: ${token.substring(0, 12)}…`);
  }

  clearToken(): void {
    this.token = null;
    this.logger.debug('Token cleared');
  }

  getToken(): string | null {
    return this.token;
  }

  // ── HTTP methods ──

  async get<T = unknown>(
    path: string,
    options: { params?: Record<string, string>; headers?: Record<string, string> } = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path, { params: options.params, headers: options.headers });
  }

  async post<T = unknown>(
    path: string,
    body?: unknown,
    options: { headers?: Record<string, string> } = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, { body, headers: options.headers });
  }

  async put<T = unknown>(
    path: string,
    body?: unknown,
    options: { headers?: Record<string, string> } = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, { body, headers: options.headers });
  }

  async delete<T = unknown>(
    path: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path, { headers: options.headers });
  }

  // ── Core request handler ──

  private async request<T>(
    method: string,
    path: string,
    options: {
      body?: unknown;
      params?: Record<string, string>;
      headers?: Record<string, string>;
    } = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.basePrefix}${path}`;
    const headers: Record<string, string> = { ...options.headers };

    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }

    this.logger.info(`${method} ${url}`);
    if (options.body) {
      this.logger.debug(`  Body: ${JSON.stringify(options.body).substring(0, 200)}`);
    }

    const requestOptions: Record<string, unknown> = { headers };
    if (options.body !== undefined) {
      requestOptions.data = options.body;
    }
    if (options.params) {
      requestOptions.params = options.params;
    }

    let response: APIResponse;
    try {
      response = await this.context.fetch(url, {
        method,
        ...requestOptions,
      });
    } catch (error) {
      this.logger.error(`Request failed: ${method} ${url} - ${error}`);
      throw error;
    }

    let body: T;
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('application/json')) {
      body = (await response.json()) as T;
    } else {
      const text = await response.text();
      body = text as unknown as T;
    }

    this.logger.info(`  ← ${response.status()}`);
    this.logger.debug(`  Response: ${JSON.stringify(body).substring(0, 300)}`);

    return {
      status: response.status(),
      headers: response.headers(),
      body,
      ok: response.ok(),
      raw: response,
    };
  }

  // ── Convenience: unauthenticated request ──

  async unauthenticatedPost<T = unknown>(
    path: string,
    body?: unknown,
  ): Promise<ApiResponse<T>> {
    const savedToken = this.token;
    this.token = null;
    try {
      return await this.post<T>(path, body);
    } finally {
      this.token = savedToken;
    }
  }
}