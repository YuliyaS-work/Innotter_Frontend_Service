import { FormField } from "../form/FormField";
import { FormikProps } from "formik";

interface SignupFormProps {
  formik: FormikProps<any>;
}

export const SignupForm: React.FC<SignupFormProps> = ({ formik }) => (
  <form onSubmit={formik.handleSubmit}>
    <FormField label="First Name" name="name" formik={formik} />
    <FormField label="Last Name" name="surname" formik={formik} />
    <FormField label="Email Address" name="email" type="email" formik={formik} autoComplete="email" />
    <FormField label="Phone Number (Optional)" name="phone_number" formik={formik} autoComplete="tel" />
    <FormField label="Username" name="username" formik={formik} autoComplete="new-username" />
    <FormField label="Password" name="password" type="password" formik={formik} autoComplete="new-password" />

    <button type="submit" className="submit-btn" disabled={formik.isSubmitting}>
      {formik.isSubmitting ? 'Submitting...' : 'Continue'}
    </button>
  </form>
);
