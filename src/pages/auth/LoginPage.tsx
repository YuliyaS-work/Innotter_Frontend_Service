import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../../api/auth';
import logoImg from '../../assets/images/logo.jpg';
import './Auth.scss';
import { Link, useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      login: '',
      password: '',
      rememberMe: Boolean(localStorage.getItem('remembered_login')),
    },
    validationSchema: Yup.object({
      login: Yup.string().required('Login is required'),
      password: Yup.string().required('Password is required'),
    }),
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
          <h1>Account Login</h1>
          <p className="subtitle">If you are already a member you can login with yuor email addree, username or phone and password.</p>

          <form onSubmit={formik.handleSubmit}>
            {/* Login (Username / Email / Phone) */}
            <div className="form-group">
              <label>Username/Email/Phone</label>
              <input
                name="login"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.login}
              />
              {formik.touched.login && formik.errors.login && (
                <div className="error-text">{formik.errors.login}</div>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="error-text">{formik.errors.password}</div>
              )}
            </div>

            <label className="checkbox-group">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
              />
              Remember me
            </label>

            <button
              type="submit"
              className="submit-btn"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer-links">
            <div>
              Don’t have an account? <Link to="/signup">Sign up here</Link>
            </div>
            <div>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};