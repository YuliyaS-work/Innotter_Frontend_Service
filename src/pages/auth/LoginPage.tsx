import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { loginUser } from '../../api/auth';
import { getMe } from '../../api/user';
import { LoginForm } from '../../components/auth/LoginForm';
import { loginInitialValues } from '../../validation/auth/loginInitialValues';
import { loginSchema } from '../../validation/auth/loginSchema';
import { useAppDispatch } from '../../store/store';
import { setCredentials } from '../../store/authSlice';

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: loginInitialValues,
    validationSchema: loginSchema,
    validateOnChange: false,
    validateOnBlur: false,

    onSubmit: async (values, { setSubmitting, setFieldError, setStatus }) => {
      setStatus(undefined);

      try {
        // 1. login
        await loginUser({ login: values.login, password: values.password });

        // 2. get user data
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

        if (values.rememberMe) {
          localStorage.setItem('remembered_login', values.login);
        } else {
          localStorage.removeItem('remembered_login');
        }

        // 5. move to the profile
        navigate('/me');
      } catch (error: any) {
        console.error('Login error:', error);
        const detail = error.response?.data?.detail;

        if (Array.isArray(detail)) {
          detail.forEach((err: any) => {
            const fieldName = err.loc ? err.loc[err.loc.length - 1] : '';

            if (fieldName === 'password') {
              if (err.type === 'string_too_short') {
                setFieldError('password', 'Password must be at least 8 characters');
              } else if (err.type === 'string_too_long') {
                setFieldError('password', 'Password must be no more than 64 characters');
              } else {
                setFieldError('password', err.msg);
              }
            } else if (fieldName === 'login') {
              setFieldError('login', err.msg);
            }
          });
          return;
        }

        if (typeof detail === 'string') {
          const normalized = detail.trim().toLowerCase();

          if (normalized.startsWith("user's not found")) {
            setFieldError('login', "We couldn't find an account with this login");
            return;
          }

          if (normalized.startsWith("password's not correct")) {
            setFieldError('password', 'Incorrect password');
            return;
          }
        }

        setStatus(typeof detail === 'string' ? detail : 'Something went wrong. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <AuthLayout
      title="Account Login"
      subtitle="If you are already a member you can login with your email address, username or phone and password."
    >
      <LoginForm formik={formik} />

      <div className="auth-footer-links">
        <div>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </div>
        <div>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </div>
    </AuthLayout>
  );
};