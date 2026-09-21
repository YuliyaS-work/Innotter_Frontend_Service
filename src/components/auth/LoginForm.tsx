import React from "react";
import { FormField } from "../form/FormField";
import { FormikProps } from "formik";

interface LoginFormProps {
  formik: FormikProps<any>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ formik }) => (
  <div className="login-form-wrapper">
    {formik.status && <div className="form-error-banner">{formik.status}</div>}

    <FormField label="Username/Email/Phone" name="login" formik={formik} autoComplete="username" />
    <FormField label="Password" name="password" type="password" formik={formik} autoComplete="current-password" />

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
      type="button"
      onClick={() => formik.handleSubmit()}
      className="submit-btn"
      disabled={formik.isSubmitting}
    >
      {formik.isSubmitting ? 'Logging in...' : 'Log In'}
    </button>
  </div>
);