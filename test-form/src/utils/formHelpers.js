export function evaluateCondition(condition, data) {
  if (!condition || !condition.field || !("value" in condition)) return true;
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

export function cleanupHiddenFields(step, formData) {
  const cleaned = { ...formData };
  if (!step) return cleaned;

  step.sections.forEach((section) => {
    if (Array.isArray(section.fields)) {
      section.fields.forEach((field) => {
        const isVisible =
          (field.visibilityCondition
            ? evaluateCondition(field.visibilityCondition, formData)
            : true) &&
          (field.requiredCondition
            ? evaluateCondition(
                field.requiredCondition.condition || field.requiredCondition,
                formData
              )
            : true);

        if (!isVisible && cleaned[field.id] !== undefined) {
          cleaned[field.id] = undefined;
        }

        if (field.type === "group" && Array.isArray(field.fields)) {
          field.fields.forEach((subField) => {
            const isSubVisible =
              (subField.visibilityCondition
                ? evaluateCondition(subField.visibilityCondition, formData)
                : true) &&
              (subField.requiredCondition
                ? evaluateCondition(
                    subField.requiredCondition.condition ||
                      subField.requiredCondition,
                    formData
                  )
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

export function validateStep(step, formData, children, formErrors = {}, touched = {}) {
  let valid = true;
  let updatedErrors = { ...formErrors };
  let updatedTouched = { ...touched };
  let clearedErrors = { ...formErrors };

  step.sections.forEach((section) => {
    if (section.required) {
      const hasGroupWithData = section.fields.some(
        (f) => f.type === "group" && Array.isArray(formData[f.id]) && formData[f.id].length > 0
      );

      if (hasGroupWithData && clearedErrors[section.id]) {
        delete clearedErrors[section.id];
      }

      if (!hasGroupWithData) {
        valid = false;
        updatedErrors[section.id] = `${section.title} is required. Please add at least one record.`;
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
              if (
                requiredCondition &&
                (requiredCondition.condition ||
                  (requiredCondition.field && requiredCondition.operator))
              ) {
                isRequired = evaluateCondition(
                  requiredCondition.condition || requiredCondition,
                  formData
                );
              } else if (typeof required === "boolean") {
                isRequired = required;
              } else if (typeof precomputedRequired === "boolean") {
                isRequired = precomputedRequired;
              }
              const fieldKey = `${field.id}[${index}].${subField.id}`;
              let error = "";
              if (isRequired && (!subValue || subValue.trim() === "")) {
                error = `${label} is required.`;
              } else if (type === "email") {
                const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
                if (!emailRegex.test(subValue)) {
                  error = `${label} must be a valid email address.`;
                }
              } else if (constraints.pattern && subValue && !new RegExp(constraints.pattern).test(subValue)) {
                error = `${label} is invalid format.`;
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
          if (
            requiredCondition &&
            (requiredCondition.condition || (requiredCondition.field && requiredCondition.operator))
          ) {
            isRequired = evaluateCondition(requiredCondition.condition || requiredCondition, formData);
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
            error = `${label} is required.`;
          } else if (constraints.pattern && typeof val === "string" && val.trim() !== "") {
            const pattern = new RegExp(constraints.pattern);
            if (val.includes("_") || !pattern.test(val.trim())) {
              error = `${label} is invalid format.`;
            }
          } else if (type === "email") {
            const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
            if (!emailRegex.test(val)) {
              error = `${label} must be a valid email address.`;
            }
          } else if (typeof val === "string") {
            if (constraints.pattern && !new RegExp(constraints.pattern).test(val)) {
              error = `${label} is invalid format.`;
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

  formData["children"] = children;
  return { valid, errors: updatedErrors, touched: updatedTouched };
}
