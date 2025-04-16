// src/components/forms/FormCheckbox.js
import { Form } from "react-bootstrap";

const FormCheckbox = ({
  label,
  name,
  checked,
  onChange,
  error,
  disabled = false,
  className = "",
  helpText,
  ...rest
}) => {
  return (
    <Form.Group className={`mb-3 ${className}`}>
      <Form.Check
        type="checkbox"
        id={name}
        name={name}
        label={label}
        checked={checked}
        onChange={onChange}
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

export default FormCheckbox;
