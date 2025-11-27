
import React, { useMemo, useState } from "react";

/**
 * Config-driven form
 *
 * Supported field types: text, email, number, password, textarea,
 * select, checkbox, radio, date.
 *
 * Validation keys supported:
 * - required: boolean
 * - minLength, maxLength: number
 * - min, max: number (for number/date)
 * - pattern: RegExp or string (converted to RegExp)
 * - custom: function (value, formData) => string | null
 *
 * Conditional visibility:
 * - showWhen: { field: "country", equals: "IN" }  // simple equals
 *   (Extend easily for other operators)
 */

export default function ConfigDrivenForm({ config, onSubmit }) {
  const fields = config?.fields ?? [];

  // Initialize form state from config defaultValue or sensible defaults
  const initialData = useMemo(() => {
    const obj = {};
    for (const f of fields) {
      if (f.defaultValue !== undefined) {
        obj[f.name] = f.defaultValue;
      } else {
        switch (f.type) {
          case "checkbox":
            obj[f.name] = false;
            break;
          case "number":
            obj[f.name] = "";
            break;
          default:
            obj[f.name] = "";
        }
      }
    }
    return obj;
  }, [fields]);

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const getIsVisible = (field) => {
    if (!field.showWhen) return true;
    const { field: dep, equals } = field.showWhen;
    const depVal = formData[dep];
    return depVal === equals;
  };

  const setFieldValue = (name, rawValue, field) => {
    let value = rawValue;
    if (field.type === "checkbox") {
      value = Boolean(rawValue);
    }
    if (field.type === "number" && rawValue !== "") {
      const num = Number(rawValue);
      value = Number.isNaN(num) ? "" : num;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toRegExp = (pattern) => {
    if (!pattern) return null;
    if (pattern instanceof RegExp) return pattern;
    try {
      return new RegExp(pattern);
    } catch {
      return null;
    }
  };

  const validateField = (field, value) => {
    const v = field.validation || {};
    if (v.required) {
      const isEmpty =
        value === null ||
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0);
      if (isEmpty) return `${field.label || field.name} is required`;
    }

    if (value !== "" && value !== null && value !== undefined) {
      if (typeof value === "string") {
        if (v.minLength && value.length < v.minLength) {
          return `${field.label || field.name} must be at least ${v.minLength} characters`;
        }
        if (v.maxLength && value.length > v.maxLength) {
          return `${field.label || field.name} must be at most ${v.maxLength} characters`;
        }
        const re = toRegExp(v.pattern);
        if (re && !re.test(value)) {
          return `${field.label || field.name} is not in the correct format`;
        }
      }
      if (typeof value === "number") {
        if (v.min !== undefined && value < v.min) {
          return `${field.label || field.name} must be ≥ ${v.min}`;
        }
        if (v.max !== undefined && value > v.max) {
          return `${field.label || field.name} must be ≤ ${v.max}`;
        }
      }
    }

    if (typeof v.custom === "function") {
      const msg = v.custom(value, formData);
      if (msg) return msg;
    }
    return null;
  };

  const validateAll = () => {
    const nextErrors = {};
    for (const f of fields) {
      if (!getIsVisible(f)) continue; // skip hidden fields
      const err = validateField(f, formData[f.name]);
      if (err) nextErrors[f.name] = err;
    }
    setErrors(nextErrors);
    return nextErrors;
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    const nextErrors = validateAll();
    const hasErrors = Object.keys(nextErrors).length > 0;
    if (!hasErrors) {
      (onSubmit || config?.onSubmit || console.log)({
        formData,
        message: "Form submitted successfully",
      });
    }
  };

  const handleBlur = (field) => {
    const err = validateField(field, formData[field.name]);
    setErrors((prev) => ({ ...prev, [field.name]: err || undefined }));
  };

  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
  };

  const renderField = (field) => {
    if (!getIsVisible(field)) return null;

    const commonProps = {
      id: field.name,
      name: field.name,
      "aria-invalid": Boolean(errors[field.name]) || undefined,
      onBlur: () => handleBlur(field),
    };

    switch (field.type) {
      case "textarea":
        return (
          <div className="form-row" key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            <textarea
              {...commonProps}
              placeholder={field.placeholder}
              value={formData[field.name] ?? ""}
              onChange={(e) => setFieldValue(field.name, e.target.value, field)}
            />
            {errors[field.name] && (
              <div className="error">{errors[field.name]}</div>
            )}
          </div>
        );

      case "select":
        return (
          <div className="form-row" key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            <select
              {...commonProps}
              value={formData[field.name] ?? ""}
              onChange={(e) => setFieldValue(field.name, e.target.value, field)}
            >
              <option value="" disabled>
                {field.placeholder || "Select..."}
              </option>
              {(field.options || []).map((opt) => (
                <option key={opt.value ?? opt} value={opt.value ?? opt}>
                  {opt.label ?? opt}
                </option>
              ))}
            </select>
            {errors[field.name] && (
              <div className="error">{errors[field.name]}</div>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div className="form-row" key={field.name}>
            <label className="checkbox">
              <input
                type="checkbox"
                {...commonProps}
                checked={Boolean(formData[field.name])}
                onChange={(e) =>
                  setFieldValue(field.name, e.target.checked, field)
                }
              />
              {field.label}
            </label>
            {errors[field.name] && (
              <div className="error">{errors[field.name]}</div>
            )}
          </div>
        );

      case "radio":
        return (
          <div className="form-row" key={field.name}>
            <span className="label">{field.label}</span>
            <div className="radio-group">
              {(field.options || []).map((opt) => (
                <label key={opt.value ?? opt} className="radio">
                  <input
                    type="radio"
                    {...commonProps}
                    value={opt.value ?? opt}
                    checked={(formData[field.name] ?? "") === (opt.value ?? opt)}
                    onChange={(e) =>
                      setFieldValue(field.name, e.target.value, field)
                    }
                  />
                  {opt.label ?? opt}
                </label>
              ))}
            </div>
            {errors[field.name] && (
              <div className="error">{errors[field.name]}</div>
            )}
          </div>
        );

      case "number":
      case "email":
      case "password":
      case "date":
      case "text":
      default:
        return (
          <div className="form-row" key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            <input
              type={field.type || "text"}
              {...commonProps}
              placeholder={field.placeholder}
              value={
                field.type === "number"
                  ? formData[field.name] ?? ""
                  : formData[field.name] ?? ""
              }
              onChange={(e) => setFieldValue(field.name, e.target.value, field)}
            />
            {errors[field.name] && (
              <div className="error">{errors[field.name]}</div>
            )}
          </div>
        );
    }
  };

  return (
    <form className="config-form" onSubmit={handleSubmit} noValidate>
      {(config.title || config.description) && (
        <header>
          {config.title && <h2>{config.title}</h2>}
          {config.description && <p className="description">{config.description}</p>}
        </header>
      )}

      {fields.map(renderField)}

      <div className="actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={resetForm} className="secondary">
          Reset
        </button>
      </div>

      {/* Minimal styles */}
      <style>{`
        .config-form { max-width: 520px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; font-family: system-ui, sans-serif; }
        header { margin-bottom: 12px; }
        .description { color: #6b7280; margin: 4px 0 0; }
        .form-row { margin-bottom: 12px; display: flex; flex-direction: column; gap: 6px; }
        label, .label { font-weight: 600; }
        input[type="text"], input[type="email"], input[type="number"], input[type="password"], input[type="date"], select, textarea {
          padding: 8px; border: 1px solid #d1d5db; border-radius: 6px;
        }
        textarea { min-height: 80px; }
        .checkbox, .radio { display: inline-flex; align-items: center; gap: 8px; font-weight: 500; }
        .radio-group { display: flex; gap: 16px; }
        .error { color: #b91c1c; font-size: 12px; }
        .actions { display: flex; gap: 8px; margin-top: 8px; }
        button { padding: 8px 12px; border-radius: 6px; border: 1px solid #1f2937; background: #111827; color: white; }
        .secondary { background: white; color: #111827; }
      `}</style>
    </form>
  );
}
