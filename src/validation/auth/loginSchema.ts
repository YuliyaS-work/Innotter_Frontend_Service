import * as Yup from 'yup';

export const loginSchema = Yup.object({
  login: Yup.string().trim().required('Login is required'),
  password: Yup.string().trim().required('Password is required'),
});