import { FormField } from "../form/FormField";
import { FormikProps } from "formik";

interface LoginFormProps {
  formik: FormikProps<any>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ formik }) => (
  <form onSubmit={formik.handleSubmit}>
    <FormField label="Username/Email/Phone" name="login" formik={formik} />
    <FormField label="Password" name="password" type="password" formik={formik} />

    <label className="checkbox-group">
      <input
        type="checkbox"
        name="rememberMe"
        checked={formik.values.rememberMe}
        onChange={formik.handleChange}
      />
      Remember me
    </label>

    <button type="submit" className="submit-btn" disabled={formik.isSubmitting}>
      {formik.isSubmitting ? 'Logging in...' : 'Sign In'}
    </button>
  </form>
);
