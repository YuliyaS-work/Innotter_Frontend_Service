import { apiUMS } from './axios';

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

export const getMe = async (): Promise<UserResponse> => {
  const response = await apiUMS.get<UserResponse>('/user/me'); // Проверь префикс пути (/users/me или /user/me в зависимости от вашего router)
  return response.data;
};