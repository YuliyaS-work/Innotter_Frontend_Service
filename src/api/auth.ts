import { apiUMS } from './axios';

// ==========================================
// 1. Schemas
// ==========================================

export interface RegisterPayload {
  name: string;
  surname: string;
  username: string;
  password: string;
  phone_number?: string | null; 
  email: string;
}

export interface LoginPayload {
  login: string; // username, phone number или email
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface ForgetPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  new_password: string;
}

// Type for responding with a message (e.g., success or error)
export interface MessageResponse {
  [key: string]: string;
}

// ==========================================
// 2. Endpoints
// ==========================================

// New user registration
export const registerUser = async (data: RegisterPayload): Promise<TokenResponse> => {
  const response = await apiUMS.post<TokenResponse>('/auth/signup', data);
  return response.data;
};

// Login user and get tokens
export const loginUser = async (data: LoginPayload): Promise<TokenResponse> => {
  const response = await apiUMS.post<TokenResponse>('/auth/login', data);
  return response.data;
};

// Logout user and invalidate tokens
export const logoutUser = async (): Promise<MessageResponse> => {
  const response = await apiUMS.post<MessageResponse>('/auth/logout');
  return response.data;
};

// Refresh tokens to get new access token
export const refreshTokens = async (): Promise<TokenResponse> => {
  const response = await apiUMS.post<TokenResponse>('/auth/refresh-token');
  return response.data;
};

// Rest password request (send email with reset link)
export const resetPassword = async (data: ForgetPasswordPayload): Promise<MessageResponse> => {
  const response = await apiUMS.post<MessageResponse>('/auth/reset-password', data);
  return response.data;
};

// Save new password using the token from email
export const savePassword = async (data: ResetPasswordPayload): Promise<MessageResponse> => {
  const response = await apiUMS.post<MessageResponse>('/auth/save-password', data);
  return response.data;
};