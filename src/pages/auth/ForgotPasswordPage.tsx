import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { resetPassword } from '../../api/auth';
import { ForgotPasswordForm } from '../../components/auth/ForgotPasswordForm';
import { ForgotPasswordSuccess } from '../../components/auth/ForgotPasswordSuccess';
import { forgotPasswordInitialValues } from '../../validation/auth/forgotPasswordInitialValues';
import { forgotPasswordSchema } from '../../validation/auth/forgotPasswordSchema';

export const ForgotPasswordPage = () => {
  const [isSent, setIsSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const formik = useFormik({
    initialValues: forgotPasswordInitialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        await resetPassword({ email: values.email });
        setIsSent(true);
        setCooldown(60);
      } catch (error: any) {
        setFieldError('email', 'User with this email was not found');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleResend = () => {
    if (cooldown === 0) {
      formik.handleSubmit();
    }
  };

  return (
    <AuthLayout
      title="Input your email to change password"
      subtitle=""
    >
      {isSent ? (
        <ForgotPasswordSuccess
          cooldown={cooldown}
          isSubmitting={formik.isSubmitting}
          onResend={handleResend}
        />
      ) : (
        <ForgotPasswordForm formik={formik} />
      )}

      <div className="auth-footer-links">
        <div>
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </AuthLayout>
  );
};