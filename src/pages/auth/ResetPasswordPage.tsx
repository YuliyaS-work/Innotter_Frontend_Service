import { useFormik } from 'formik';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { savePassword } from '../../api/auth';
import { ResetPasswordForm } from '../../components/auth/ResetPasswordForm';
import { resetPasswordSchema } from '../../validation/auth/resetPasswordSchema';
import { resetPasswordInitialValues } from '../../validation/auth/resetPasswordInitialValues';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const formik = useFormik({
    initialValues: resetPasswordInitialValues,
    validationSchema: resetPasswordSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        await savePassword({ token, new_password: values.new_password });
        navigate('/login');
      } catch (error: any) {
        setFieldError(
          'new_password',
          'Invalid or expired token. Request a new reset link.'
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Please enter your new password."
    >
      <ResetPasswordForm formik={formik} />
    </AuthLayout>
  );
};