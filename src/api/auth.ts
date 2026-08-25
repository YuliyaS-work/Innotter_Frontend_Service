import { apiUMS } from './axios';

export const fetchTestUsers = async () => {
  const response = await apiUMS.get('/system/health');
  return response.data;
};