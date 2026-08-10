export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  country: string | null;
  created_at: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  country?: string;
}

export type RegisterResponse = User;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: "bearer";
}
