import i18n from '../i18n';

export function evaluateCondition(condition, data) {
  if (!condition) return true;
  if (condition.condition && !condition.field && !('value' in condition) && !condition.repeatingGroup) {
    return evaluateCondition(condition.condition, data);
  }
  if (condition.repeatingGroup) {
    return evaluateRepeatingGroupCondition(condition, data);
  }
  if (!condition.field || !("value" in condition)) return true;
  const actual = data[condition.field];
  const expected = condition.value;
  switch (condition.operator) {
    case "equals":
      return actual === expected;
    case "notEquals":
      return actual !== expected;
    case "in":
      return Array.isArray(expected) && expected.includes(actual);
    case "notIn":
      return Array.isArray(expected) && !expected.includes(actual);
    case "exists":
      return actual !== undefined && actual !== null;
    case "notExists":
      return actual === undefined || actual === null;
    case "includes":
      return Array.isArray(actual) && actual.includes(expected);
    default:
      return false;
  }
}

export function evaluateRepeatingGroupCondition(condition, data) {
  const { repeatingGroup, operator, condition: recordCond } = condition;
  if (!repeatingGroup || !recordCond) return false;
  const records = Array.isArray(data[repeatingGroup]) ? data[repeatingGroup] : [];
  const testRecord = (rec) => evaluateCondition(recordCond, rec);
  switch (operator) {
    case "ANY":
      return records.some(testRecord);
    case "ALL":
      return records.length > 0 && records.every(testRecord);
    case "NONE":
      return records.every((r) => !testRecord(r));
    default:
      return false;
  }
}

export function cleanupHiddenFields(step, formData, evaluationData = formData) {
  const cleaned = { ...formData };
  if (!step || !Array.isArray(step.sections)) return cleaned;

  step.sections.forEach((section) => {
    const sectionVisible = section.visibilityCondition
      ? evaluateCondition(section.visibilityCondition, evaluationData)
      : true;

    if (Array.isArray(section.fields)) {
      section.fields.forEach((field) => {
        if (!sectionVisible) {
          if (cleaned[field.id] !== undefined) {
            cleaned[field.id] = undefined;
          }
          if (field.type === "group" && Array.isArray(field.fields)) {
            field.fields.forEach((subField) => {
              if (cleaned[subField.id] !== undefined) {
                cleaned[subField.id] = undefined;
              }
            });
          }
          return;
        }
        const isVisible =
          (field.visibilityCondition
            ? evaluateCondition(field.visibilityCondition, evaluationData)
            : true) &&
          (field.requiredCondition
            ? evaluateCondition(field.requiredCondition, evaluationData)
            : true);

        if (!isVisible && cleaned[field.id] !== undefined) {
          cleaned[field.id] = undefined;
        }

        if (field.type === "group" && Array.isArray(field.fields)) {
          field.fields.forEach((subField) => {
            const isSubVisible =
              (subField.visibilityCondition
                ? evaluateCondition(subField.visibilityCondition, evaluationData)
                : true) &&
              (subField.requiredCondition
                ? evaluateCondition(subField.requiredCondition, evaluationData)
                : true);

            if (!isSubVisible && cleaned[subField.id] !== undefined) {
              cleaned[subField.id] = undefined;
            }
          });
        }
      });
    }
  });

  return cleaned;
}

export function validateField(field, value, data = {}) {
  if (!field) return "";

  const required = field.required;
  const requiredCondition = field.requiredCondition;

  let isRequired = false;
  if (requiredCondition) {
    isRequired = evaluateCondition(requiredCondition, data);
  } else if (typeof required === "boolean") {
    isRequired = required;
  } else if (typeof field.isRequired === "boolean") {
    isRequired = field.isRequired;
  }

  const { constraints = {}, label = "", type, metadata = {} } = field;
  const val = typeof value === "string" ? value.trim() : value;
  let error = "";

  if (
    isRequired &&
    (val === undefined ||
      val === null ||
      (typeof val === "string" && val === "") ||
      (Array.isArray(val) && val.length === 0))
  ) {
    error = i18n.t('requiredField', { field: label });
  } else if (constraints.pattern && typeof val === "string" && val.trim() !== "") {
    const raw = constraints.pattern;
    const safePattern = raw.replace(/\\\\/g, "\\");
    const pattern = new RegExp(safePattern);
    if (val.includes("_") || !pattern.test(val.trim())) {
      error = `${label} is invalid format.`;
    }
  } else if (type === "email") {
    const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
    if (!emailRegex.test(val)) {
      error = `${label} must be a valid email address.`;
    }
  } else if (typeof val === "string") {
    if (constraints.pattern) {
      const raw = constraints.pattern;
      const safePattern = raw.replace(/\\\\/g, "\\");
      const pattern = new RegExp(safePattern);
      if (!pattern.test(val)) {
        error = `${label} is invalid format.`;
      } else if (constraints.minLength && val.length < constraints.minLength) {
        error = `${label} must be at least ${constraints.minLength} characters.`;
      } else if (constraints.maxLength && val.length > constraints.maxLength) {
        error = `${label} must be no more than ${constraints.maxLength} characters.`;
      }
    } else if (constraints.minLength && val.length < constraints.minLength) {
      error = `${label} must be at least ${constraints.minLength} characters.`;
    } else if (constraints.maxLength && val.length > constraints.maxLength) {
      error = `${label} must be no more than ${constraints.maxLength} characters.`;
    }
  } else if (Array.isArray(val) && metadata.multiple) {
    if (constraints.minSelections && val.length < constraints.minSelections) {
      error = `${label} requires at least ${constraints.minSelections} selections.`;
    } else if (constraints.maxSelections && val.length > constraints.maxSelections) {
      error = `${label} allows at most ${constraints.maxSelections} selections.`;
    }
  }

  return error;
}

export function validateStep(
  step,
  formData,
  formErrors = {},
  touched = {},
  fullData = formData
) {
  let valid = true;
  let updatedErrors = { ...formErrors };
  let updatedTouched = { ...touched };

  if (!step || !Array.isArray(step.sections)) {
    return { valid: true, errors: { ...formErrors }, touched: { ...touched } };
  }

  step.sections.forEach((section) => {
    if (section.required) {
      const hasGroupWithData = section.fields.some(
        (f) => f.type === "group" && Array.isArray(formData[f.id]) && formData[f.id].length > 0
      );

      if (hasGroupWithData && updatedErrors[section.id]) {
        delete updatedErrors[section.id];
      }

      if (!hasGroupWithData) {
        valid = false;
        updatedErrors[section.id] = i18n.t('sectionRequired', { section: section.title });
      }
    }

    if (Array.isArray(section.fields)) {
      section.fields.forEach((field) => {
        updatedTouched[field.id] = true;
        const value = formData[field.id];

        if (field.type === "group" && field.metadata?.multiple && Array.isArray(value)) {
          value.forEach((record, index) => {
            field.fields.forEach((subField) => {
              const subValue = record[subField.id] || "";
              const {
                required,
                requiredCondition,
                isRequired: precomputedRequired,
                constraints = {},
                label = "",
                type,
              } = subField;

              let isRequired = false;
              if (requiredCondition) {
                isRequired = evaluateCondition(requiredCondition, fullData);
              } else if (typeof required === "boolean") {
                isRequired = required;
              } else if (typeof precomputedRequired === "boolean") {
                isRequired = precomputedRequired;
              }
              const fieldKey = `${field.id}[${index}].${subField.id}`;
              let error = "";
              if (isRequired && (!subValue || subValue.trim() === "")) {
                error = i18n.t('requiredField', { field: label });
              } else if (type === "email") {
                const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
                if (!emailRegex.test(subValue)) {
                  error = `${label} must be a valid email address.`;
                }
              } else if (constraints.pattern && subValue) {
                const raw = constraints.pattern;
                const safePattern = raw.replace(/\\\\/g, "\\");
                const pattern = new RegExp(safePattern);
                if (!pattern.test(subValue)) {
                  error = `${label} is invalid format.`;
                }
              } else if (constraints.minLength && subValue.length < constraints.minLength) {
                error = `${label} must be at least ${constraints.minLength} characters.`;
              } else if (constraints.maxLength && subValue.length > constraints.maxLength) {
                error = `${label} must be no more than ${constraints.maxLength} characters.`;
              }

              updatedErrors[fieldKey] = error;
              updatedTouched[fieldKey] = true;
              if (error) valid = false;
            });
          });
        } else {
          const required = field.required;
          const requiredCondition = field.requiredCondition;

          let isRequired = false;
          if (requiredCondition) {
            isRequired = evaluateCondition(requiredCondition, fullData);
          } else if (typeof required === "boolean") {
            isRequired = required;
          }

          const { id, constraints = {}, label = "", type, metadata = {} } = field;
          const val = typeof value === "string" ? value.trim() : value;
          let error = "";

          if (
            isRequired &&
            (val === undefined ||
              val === null ||
              (typeof val === "string" && val === "") ||
              (Array.isArray(val) && val.length === 0))
          ) {
            error = i18n.t('requiredField', { field: label });
          } else if (constraints.pattern && typeof val === "string" && val.trim() !== "") {
            const raw = constraints.pattern;
            const safePattern = raw.replace(/\\\\/g, "\\");
            const pattern = new RegExp(safePattern);
            if (val.includes("_") || !pattern.test(val.trim())) {
              error = `${label} is invalid format.`;
            }
          } else if (type === "email") {
            const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
            if (!emailRegex.test(val)) {
              error = `${label} must be a valid email address.`;
            }
          } else if (typeof val === "string") {
            if (constraints.pattern) {
              const raw = constraints.pattern;
              const safePattern = raw.replace(/\\\\/g, "\\");
              const pattern = new RegExp(safePattern);
              if (!pattern.test(val)) {
                error = `${label} is invalid format.`;
              } else if (constraints.minLength && val.length < constraints.minLength) {
                error = `${label} must be at least ${constraints.minLength} characters.`;
              } else if (constraints.maxLength && val.length > constraints.maxLength) {
                error = `${label} must be no more than ${constraints.maxLength} characters.`;
              }
            } else if (constraints.minLength && val.length < constraints.minLength) {
              error = `${label} must be at least ${constraints.minLength} characters.`;
            } else if (constraints.maxLength && val.length > constraints.maxLength) {
              error = `${label} must be no more than ${constraints.maxLength} characters.`;
            }
          } else if (Array.isArray(val) && metadata.multiple) {
            if (constraints.minSelections && val.length < constraints.minSelections) {
              error = `${label} requires at least ${constraints.minSelections} selections.`;
            } else if (constraints.maxSelections && val.length > constraints.maxSelections) {
              error = `${label} allows at most ${constraints.maxSelections} selections.`;
            }
          }

          updatedErrors[id] = error;
          updatedTouched[id] = true;
          if (error) valid = false;
        }
      });
    }
  });

  return { valid, errors: updatedErrors, touched: updatedTouched };
}
