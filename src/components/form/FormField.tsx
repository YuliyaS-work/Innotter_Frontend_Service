import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  formik: any;
  autoComplete?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  formik,
  autoComplete = 'off',
}) => {
  const errorMessage = formik.errors[name];

  return (
    <div className="form-group">
      <label>{label}</label>

      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={formik.values[name] || ''}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      {errorMessage && <div className="error-text">{errorMessage}</div>}
    </div>
  );
};