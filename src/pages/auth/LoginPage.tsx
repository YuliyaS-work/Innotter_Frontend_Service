import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { loginUser } from '../../api/auth';
import { LoginForm } from '../../components/auth/LoginForm';
import { loginInitialValues } from '../../validation/auth/loginInitialValues';
import { loginSchema } from '../../validation/auth/loginSchema';

export const LoginPage = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: loginInitialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        if (values.rememberMe) {
          localStorage.setItem('remembered_login', values.login);
        } else {
          localStorage.removeItem('remembered_login');
        }

        await loginUser({ login: values.login, password: values.password });
        navigate('/me');

      } catch (error: any) {
        setFieldError('password', 'Invalid login or password');
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