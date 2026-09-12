import * as Yup from 'yup';

export const signupSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Minimum 2 characters')
    .max(50, 'Maximum 50 characters')
    .required('Required field'),

  surname: Yup.string()
    .min(2, 'Minimum 2 characters')
    .max(50, 'Maximum 50 characters')
    .required('Required field'),

  username: Yup.string()
    .min(5, 'Minimum 5 characters')
    .max(20, 'Maximum 20 characters')
    .required('Required field'),

  email: Yup.string()
    .email('Invalid email format')
    .required('Required field'),

  phone_number: Yup.string()
    .matches(/^\+/, 'Phone number must start with "+"')
    .nullable(),

  password: Yup.string()
    .min(8, 'Minimum 8 characters')
    .max(64, 'Maximum 64 characters')
    .required('Required field'),
});
