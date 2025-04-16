// src/components/forms/FormSelect.js
import { Form } from "react-bootstrap";

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
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

      <Form.Select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        isInvalid={!!error}
        {...rest}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>

      {helpText && <Form.Text className="text-muted">{helpText}</Form.Text>}

      {error && (
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default FormSelect;
