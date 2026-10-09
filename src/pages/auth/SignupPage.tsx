import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { registerUser } from '../../api/auth';
import { signupInitialValues } from '../../validation/auth/signupInitialValues';
import { signupSchema } from '../../validation/auth/signupSchema';
import { SignupForm } from '../../components/auth/SignupForm';
import { useAppDispatch } from '../../store/store';
import { getMe } from '../../api/user';
import { setCredentials } from '../../store/authSlice';


export const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: signupInitialValues,
    validationSchema: signupSchema,

    validateOnChange: false,
    validateOnBlur: false,

    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const payload = {
          ...values,
          phone_number: values.phone_number.trim() === '' ? null : values.phone_number,
        };

        // 1. sign up
        await registerUser(payload);

        // 2.get user data
        const userData = await getMe();
        const userId = String(userData.id);

        // all the roles to a massive
        const userRoles: string[] = Array.isArray(userData.roles)
          ? userData.roles.map((r: any) => (typeof r === 'object' ? r.role_name || r.name : String(r)))
          : [];

        // 3. saving user data in the  localStorage
        localStorage.setItem('user_id', userId);
        localStorage.setItem('user_roles', JSON.stringify(userRoles));

        // 4. get user data to Redux
        dispatch(
          setCredentials({
            user: {
              id: userId,
              roles: userRoles,
              email: userData.email,
            },
          })
        );

        // 5. move to the profile
        navigate('/me');

      } catch (error: any) {
        console.error('Signup error:', error);
        setFieldError('email', 'Registration failed. User with this data might already exist.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <AuthLayout
      title="Account Signup"
      subtitle="Become a member and enjoy exclusive promotions."
    >
      <SignupForm formik={formik} />

      <div className="auth-footer-links">
        <div>
          Do you have an account? <Link to="/login">Login up here</Link>
        </div>
        <div>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </div>
    </AuthLayout>
  );
};