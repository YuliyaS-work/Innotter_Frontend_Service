import { apiUMS } from './axios';

// ==========================================
// 1. Schemas
// ==========================================

export interface GroupResponse {
  id: number;
  group_name: string;
}

export interface RoleResponse {
  id: number;
  role_name: string;
}

export interface UserResponse {
  id: string;
  name: string;
  surname: string;
  username: string;
  phone_number: string | null;
  email: string;
  image_s3_path: string | null;
  is_blocked: boolean;
  created_at: string;
  modified_at: string;
  group: GroupResponse | null;
  roles: RoleResponse[];
}

export interface ProfileUserPatch {
  name?: string;
  surname?: string;
  username?: string;
  phone_number?: string;
  email?: string;
}

// S3 & Avatar schemas
export interface PresignUrlGet {
  presigned_url: string;
}

export interface PresignedPostResponse {
  key: string;
  url: string;
  fields: Record<string, string>;
}

export interface ConfirmAvatarRequest {
  key: string;
}

// Admin patch schema
export interface UserPatchByAdmin extends ProfileUserPatch {
  is_blocked?: boolean;
  group_id?: number;
  roles_id?: number[];
}

// Filters & Pagination
export interface UserFilter {
  name?: string;
  surname?: string;
  sort_field?: 'name' | 'surname';
  order_by?: 'asc' | 'desc';
}

export interface UserPagination {
  page?: number;
  size?: number;
}

// ==========================================
// 2. Endpoints
// ==========================================


// Current user profile(/user/me)
// GET /user/me 
export const getMe = async (): Promise<UserResponse> => {
  const response = await apiUMS.get<UserResponse>('/user/me');
  return response.data;
};

// PATCH /user/me 
export const patchMe = async (data: ProfileUserPatch): Promise<UserResponse> => {
  const response = await apiUMS.patch<UserResponse>('/user/me', data);
  return response.data;
};

// DELETE /user/me 
export const deleteMe = async (): Promise<{ message: string }> => {
  const response = await apiUMS.delete<{ message: string }>('/user/me');
  return response.data;
};

//========================================
// Current user avatar (/user/me/avatar)
// GET /user/me/avatar
export const getAvatarUrl = async (): Promise<PresignUrlGet> => {
  const response = await apiUMS.get<PresignUrlGet>('/user/me/avatar');
  return response.data;
};

// POST /user/me/avatar/presigned-post
export const getPresignedPostAvatar = async (): Promise<PresignedPostResponse> => {
  const response = await apiUMS.post<PresignedPostResponse>('/user/me/avatar/presigned-post');
  return response.data;
};

// PATCH /user/me/avatar/confirm 
export const confirmAvatar = async (body: ConfirmAvatarRequest): Promise<UserResponse> => {
  const response = await apiUMS.patch<UserResponse>('/user/me/avatar/confirm', body);
  return response.data;
};

// DELETE /user/me/avatar 
export const deleteAvatar = async (): Promise<UserResponse> => {
  const response = await apiUMS.delete<UserResponse>('/user/me/avatar');
  return response.data;
};

// ==========================================
// Admin/Moderator
// GET /users/ 
export const getUsersList = async (
  filter?: UserFilter, 
  pagination?: UserPagination
): Promise<{ items: UserResponse[]; total: number; page: number; size: number }> => {
  const response = await apiUMS.get('/users/', {
    params: {
      ...filter,
      page: pagination?.page || 1,
      size: pagination?.size || 30,
    },
  });
  return response.data;
};

// GET /user/{user_id}
export const getUserById = async (userId: string): Promise<UserResponse> => {
  const response = await apiUMS.get<UserResponse>(`/user/${userId}`);
  return response.data;
};

// PATCH /user/{user_id} 
export const patchUserById = async (userId: string, data: UserPatchByAdmin): Promise<UserResponse> => {
  const response = await apiUMS.patch<UserResponse>(`/user/${userId}`, data);
  return response.data;
};