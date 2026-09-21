import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  formik: any;
}

export const FormField: React.FC<FormFieldProps> = ({ label, name, type = "text", formik }) => {
  return (
    <div className="form-group">
      <label>{label}</label>

      <input
        name={name}
        type={type}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      {formik.touched[name] && formik.errors[name] && (
        <div className="error-text">{formik.errors[name]}</div>
      )}
    </div>
  );
};
