import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { registerUser } from '../../api/auth';
import { signupInitialValues } from '../../validation/auth/signupInitialValues';
import { signupSchema } from '../../validation/auth/signupSchema';
import { SignupForm } from '../../components/auth/SignupForm';


export const SignupPage = () => {
  const navigate = useNavigate();

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

        await registerUser(payload);
        navigate('/me');

      } catch (error: any) {
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