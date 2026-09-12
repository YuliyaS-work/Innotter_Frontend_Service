import * as Yup from 'yup';

export const loginSchema = Yup.object({
  login: Yup.string().required('Login is required'),
  password: Yup.string().required('Password is required'),
});
