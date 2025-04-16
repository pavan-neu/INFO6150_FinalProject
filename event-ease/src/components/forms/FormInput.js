// src/components/forms/FormInput.js
import { Form } from "react-bootstrap";

const FormInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = "",
  labelClassName = "",
  helpText,
  ...rest
}) => {
  return (
    <Form.Group className={`mb-3 ${className}`}>
      {label && (
        <Form.Label className={labelClassName}>
          {label} {required && <span className="text-danger">*</span>}
        </Form.Label>
      )}

      <Form.Control
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        isInvalid={!!error}
        {...rest}
      />

      {helpText && <Form.Text className="text-muted">{helpText}</Form.Text>}

      {error && (
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default FormInput;
