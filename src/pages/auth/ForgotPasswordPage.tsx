import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../api/auth';
import logoImg from '../../assets/images/logo.jpg';
import './Auth.scss';

export const ForgotPasswordPage = () => {
  const [isSent, setIsSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
    }),
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
    <div className="auth-container">
      <div className="auth-left">
        <img src={logoImg} alt="Innotter Logo" className="logo-img" />
      </div>

      <div className="auth-right">

        <div className="top-bar">
          <Link
            to="#"
            className="back-link"
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
          >
            &lt; Back
          </Link>
        </div>

        <div className="form-content">
          <h1>Input your email to change password</h1>

          {isSent ? (
            <div className="subtitle" style={{ color: '#27ae60' }}>
              Reset link has been sent to your email! Please check your inbox.

              <button
                type="button"
                className="submit-btn"
                onClick={handleResend}
                disabled={cooldown > 0 || formik.isSubmitting}
              >
                {formik.isSubmitting
                  ? 'Sending...'
                  : cooldown > 0
                    ? `Send again in ${cooldown}s`
                    : 'Send again'}
              </button>

            </div>
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="error-text">{formik.errors.email}</div>
                )}
              </div>

              <button type="submit" className="submit-btn" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Sending...' : 'Submit'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};