import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../../api/auth';
import './Auth.scss';

// Import image directly into the TSX file
import logoImg from '../../assets/images/logo.jpg';
import { Link, useNavigate } from 'react-router-dom';

export const SignupPage = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      surname: '',
      username: '',
      email: '',
      phone_number: '',
      password: '',
    },
    // Validation schema matching both Pydantic and SQLAlchemy models
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, 'Minimum 2 characters')
        .max(50, 'Maximum 50 characters') // Matches String(50) in DB
        .required('Required field'),
      surname: Yup.string()
        .min(2, 'Minimum 2 characters')
        .max(50, 'Maximum 50 characters') // Matches String(50) in DB
        .required('Required field'),
      username: Yup.string()
        .min(5, 'Minimum 5 characters')
        .max(20, 'Maximum 20 characters') // Matches String(20) in DB
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
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        // Prepare payload: if phone is empty, send null to satisfy DB nullable=True
        const payload = {
          ...values,
          phone_number: values.phone_number.trim() === '' ? null : values.phone_number,
        };

        await registerUser(payload);

      } catch (error: any) {
        // Catch 400/409 errors (e.g., if email, username, or phone already exists in DB)
        setFieldError('email', 'Registration failed. User with this data might already exist.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="auth-container">
      {/* Left panel */}
      <div className="auth-left">
        <img src={logoImg} alt="Innotter Logo" className="logo-img" />
      </div>

      {/* Right panel */}
      <div className="auth-right">
        
        {/* Top bar for back link aligned to the left */}
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
          <h1>Account Signup</h1>
          <p className="subtitle">Become a member and enjoy exclusive promotions.</p>

          <form onSubmit={formik.handleSubmit}>
            {/* First Name */}
            <div className="form-group">
              <label>First Name</label>
              <input
                name="name"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="error-text">{formik.errors.name}</div>
              )}
            </div>

            {/* Last Name */}
            <div className="form-group">
              <label>Last Name</label>
              <input
                name="surname"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.surname}
              />
              {formik.touched.surname && formik.errors.surname && (
                <div className="error-text">{formik.errors.surname}</div>
              )}
            </div>

            {/* Email */}
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

            {/* Phone Number */}
            <div className="form-group">
              <label>Phone Number (Optional)</label>
              <input
                name="phone_number"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone_number}
              />
              {formik.touched.phone_number && formik.errors.phone_number && (
                <div className="error-text">{formik.errors.phone_number}</div>
              )}
            </div>

            {/* Username */}
            <div className="form-group">
              <label>Username</label>
              <input
                name="username"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
              />
              {formik.touched.username && formik.errors.username && (
                <div className="error-text">{formik.errors.username}</div>
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

            <button
              type="submit"
              className="submit-btn"
              disabled={formik.isSubmitting}
              style={{fontSize: '20px'}}
            >
              {formik.isSubmitting ? 'Submitting...' : 'Continue'}
            </button>
          </form>

          <div className="auth-footer-links">
            <div>
              Do you have an account? <Link to="/login">Login up here</Link>
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