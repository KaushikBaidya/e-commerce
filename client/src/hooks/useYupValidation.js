import { useState } from 'react';

/**
 * @param {Yup.Schema} validationSchema - The Yup schema to validate against.
 * @returns {object} - validateForm: async validator, errors: validation errors
 */

const useYupValidation = (validationSchema) => {
  const [errors, setErrors] = useState({});

  const validateForm = async (formData) => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return { isValid: true, values: formData };
    } catch (validationError) {
      const formattedErrors = {};
      validationError.inner.forEach((err) => {
        formattedErrors[err.path] = err.message;
      });
      setErrors(formattedErrors);
      return { isValid: false, errors: formattedErrors };
    }
  };

  return { validateForm, errors, setErrors };
};

export default useYupValidation;
