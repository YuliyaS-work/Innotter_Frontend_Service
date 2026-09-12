import * as Yup from 'yup';

export const resetPasswordSchema = Yup.object({
  new_password: Yup.string()
    .min(6, 'Minimum 6 characters')
    .required('Password is required'),
});