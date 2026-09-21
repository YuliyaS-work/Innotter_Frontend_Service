import { FormField } from "../form/FormField";
import { FormikProps } from "formik";

interface ForgotPasswordFormProps {
  formik: FormikProps<any>;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ formik }) => (
  <form onSubmit={formik.handleSubmit}>
    <FormField
      label="Email Address"
      name="email"
      type="email"
      formik={formik}
    />

    <button type="submit" className="submit-btn" disabled={formik.isSubmitting}>
      {formik.isSubmitting ? 'Sending...' : 'Submit'}
    </button>
  </form>
);
