// ── Request payloads ──

export interface ReqResLoginPayload {
  email: string;
  password?: string;
}

export interface ReqResRegisterPayload {
  email: string;
  password?: string;
}

export interface ReqResCreateUserPayload {
  name: string;
  job: string;
}

// ── Response shapes ──

export interface ReqResLoginResponse {
  token: string;
}

export interface ReqResRegisterResponse {
  id: number;
  token: string;
}

export interface ReqResErrorResponse {
  error: string;
}

export interface ReqResUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface ReqResUserListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: ReqResUser[];
  support: {
    url: string;
    text: string;
  };
}

export interface ReqResSingleUserResponse {
  data: ReqResUser;
  support: {
    url: string;
    text: string;
  };
}

export interface ReqResCreatedUser {
  name: string;
  job: string;
  id: string;
  createdAt: string;
}