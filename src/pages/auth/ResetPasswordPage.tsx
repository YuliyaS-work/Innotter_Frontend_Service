import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { savePassword } from '../../api/auth';
import logoImg from '../../assets/images/logo.jpg';
import './Auth.scss';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const formik = useFormik({
    initialValues: { new_password: '' },
    validationSchema: Yup.object({
      new_password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        await savePassword({ token, new_password: values.new_password });
        navigate('/login');
      } catch (error: any) {
        setFieldError('new_password', 'Invalid or expired token. Request a new reset link.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-left">
        <img src={logoImg} alt="Innotter Logo" className="logo-img" />
      </div>

      <div className="auth-right">
        <div className="form-content">
          <h1>Set New Password</h1>
          <p className="subtitle">Please enter your new password.</p>

          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <label>New Password</label>
              <input
                name="new_password"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.new_password}
              />
              {formik.touched.new_password && formik.errors.new_password && (
                <div className="error-text">{formik.errors.new_password}</div>
              )}
            </div>

            <button type="submit" className="submit-btn" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? 'Saving...' : 'Save Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};