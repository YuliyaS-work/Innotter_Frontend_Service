import { FormField } from "../form/FormField";
import { FormikProps } from "formik";

interface ResetPasswordFormProps {
  formik: FormikProps<any>;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ formik }) => (
  <form onSubmit={formik.handleSubmit}>
    <FormField
      label="New Password"
      name="new_password"
      type="password"
      formik={formik}
    />

    <button type="submit" className="submit-btn" disabled={formik.isSubmitting}>
      {formik.isSubmitting ? 'Saving...' : 'Save Password'}
    </button>
  </form>
);
