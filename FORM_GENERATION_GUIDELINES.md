# Guardrails and Guidelines for Generating Form Applications

This document outlines best practices and considerations for generating dynamic, user-friendly, and accessible form-based applications from a JSON schema (like `childcare_form.json`).

## 1. Dynamic Form Loading

*   **Avoid Hardcoding:** Form definitions (JSON) should **never** be hardcoded directly into components.
*   **Loading Mechanism:**
    *   Implement a mechanism to fetch the form JSON definition at runtime (e.g., from a remote URL, a local file within the `public` folder, or passed as a prop).
    *   For local files in a React project, you can place them in the `public` folder and fetch them, or import them directly if your bundler supports it (though fetching is often more flexible for future changes).
*   **Error Handling:** Gracefully handle cases where the form definition fails to load (e.g., display an error message, retry mechanism).

## 2. UI Generation Strategies

The renderer should intelligently translate the JSON schema into appropriate UI elements.

*   **Field Types:**
    *   **`text`, `email`, `tel`, `number`, `date`, `time`:** Render as `<input>` elements with corresponding `type` attributes.
    *   **`select`:** Render as a `<select>` element. If `metadata.multiple: true`, use the `multiple` attribute.
    *   **`radio`:** Render as a group of `<input type="radio">` elements. Ensure they share the same `name` attribute.
    *   **`checkbox`:**
        *   If `metadata.multiple: true`: Render as a group of `<input type="checkbox">` elements, each with its own `name` (or a shared name with array-like handling in the form state).
        *   If not `multiple` (or `metadata.multiple` is absent/false): Render as a single `<input type="checkbox">`.
    *   **`file`:** Render as an `<input type="file">`. Consider `metadata.multiple` for allowing multiple file selections.
    *   **`info`:** These are not input fields but display information. Render the `content` (which can be markdown) within a `div` or similar. Use `ui.markdown: true` to parse and render markdown content. `ui.collapsible` and `ui.defaultCollapsed` should control the collapsible behavior of these sections.
    *   **`group` (with `metadata.multiple: true`):** This is for repeating sets of fields (e.g., adding multiple children, jobs).
        *   **UI Presentation:**
            *   Display existing entries in a table-like format or a list of cards. Each entry should have "Edit" and "Delete" actions.
            *   Provide an "Add New" button to open a form (modal or inline) for a new entry.
            *   The fields within the group should be rendered according to their own types.
*   **Layout and Structure:**
    *   **Steps:** The top-level `steps` array defines the wizard's progression. A stepper UI (horizontal or vertical based on `form.layout.stepperPosition`) should guide the user.
    *   **Sections:** Each step contains `sections`. Render each section with its `title` and `description`.
        *   `ui.collapsible` and `ui.defaultCollapsed` for sections (non-info type) can allow users to expand/collapse content areas.
    *   **Table Layout (`section.ui.layout: "table"`):** For sections like work schedules, where data is best presented in a tabular format.
        *   `ui.columns`: Defines the table headers.
        *   `ui.rowGroup`: Links fields to specific rows (e.g., "Monday", "Tuesday").
        *   `ui.column`: Links fields to specific columns within a row.
        *   `ui.rowCopy`: Implement functionality to copy data from one row to others (e.g., "Apply Monday's schedule to all weekdays").
        *   `ui.maxColumns`: On small screens, limit visible columns to this number and display remaining fields stacked below each row.
*   **Conditional Logic:**
    *   **`visibilityCondition`:** Fields or sections should only be rendered if their `visibilityCondition` (evaluated against current form data using `formHelpers.js`) is met.
    *   **`requiredCondition`:** A field becomes mandatory if its `requiredCondition` is met. This should be visually indicated (e.g., with an asterisk) and enforced during validation.
*   **Input Validation:**
    *   Use the `required` property and evaluated `requiredCondition` to mark fields as mandatory.
    *   Utilize the `constraints` object for more specific validation:
        *   `pattern`: For regex-based validation (e.g., phone numbers, SSN).
        *   `minLength`, `maxLength`: For text inputs.
        *   `min`, `max`, `step`: For numerical inputs.
        *   `maxFileSizeMB`, `allowedTypes`: For file inputs.
        *   `minSelections`, `maxSelections`: For multi-select or checkbox groups.
    *   Validation should occur on blur, on change (for some fields), and always before navigating to the next step or submitting the form.
    *   Display clear, user-friendly error messages next to the invalid fields or in a summary. The `formHelpers.js` `validateStep` and `validateField` functions are crucial here.

## 3. Design System and UI Components

*   **Consistency:** Leverage the existing CSS in `design-tokens.css` and `form.css` to maintain visual consistency.
*   **Reusable Components:**
    *   The existing shared components (`test-form/src/components/shared/`) like `FileInput`, `MaskedInput`, etc., should be used.
    *   Create new reusable components for any new complex UI patterns (e.g., a generic "Add More" component for `type: group` with `metadata.multiple: true`).
    *   Core components like `Button`, `TextInput`, `Select`, `RadioGroup`, `CheckboxGroup` should be standardized and used throughout the form.
*   **Styling:** Prefer CSS classes and utility classes over inline styles for better maintainability and reusability.

## 4. Mobile Responsiveness

*   **Fluid Layouts:** Use responsive CSS techniques like Flexbox and Grid to ensure layouts adapt to different screen sizes.
*   **Viewport Meta Tag:** Ensure `<meta name="viewport" content="width=device-width, initial-scale=1">` is present in `index.html`.
*   **Touch-Friendly:** Ensure interactive elements (buttons, inputs) are large enough and have adequate spacing for touch interaction.
*   **Testing:** Test the form on various device emulators (browser developer tools) and, if possible, on real devices.

## 5. Accessibility (A11y)

Adhere to WCAG (Web Content Accessibility Guidelines) AA standards.

*   **Semantic HTML:**
    *   Use `<form>`, `<fieldset>`, `<legend>`, `<label>`, `<button>`, etc., appropriately.
    *   Use heading elements (`<h1>` - `<h6>`) hierarchically.
*   **Labels:** Every form input must have a corresponding `<label>` associated using the `for` attribute (matching the input's `id`).
*   **ARIA Attributes:**
    *   Use `aria-required="true"` for required fields.
    *   Use `aria-invalid="true"` for fields with validation errors.
    *   Use `aria-describedby` to link error messages or hints to inputs.
    *   For custom components or dynamic content, ensure appropriate ARIA roles and properties (e.g., `role="alert"` for error messages, `aria-live` for dynamic updates).
*   **Keyboard Navigation:**
    *   All interactive elements must be focusable and operable via keyboard.
    *   Logical focus order (generally matching the visual order).
    *   Visible focus indicators for all focusable elements.
*   **Color Contrast:** Ensure text and UI elements have sufficient contrast against their background (e.g., 4.5:1 for normal text).
*   **Images and Icons:** Provide text alternatives (`alt` attributes for `<img>`, or ARIA labels for icon fonts/SVGs if they convey meaning).
*   **Clear Instructions:** Provide clear instructions and cues for complex inputs or sections.

## 6. State Management

*   **Form Data:** Maintain a state object for the entire form's data. Keys can correspond to field IDs.
*   **Validation State:** Keep track of validation errors for each field.
*   **Current Step:** Manage the current active step in the wizard.
*   **React Context / State Libraries:** For complex forms, consider React Context API or a dedicated state management library (like Zustand, Redux Toolkit) to avoid prop drilling and simplify state updates, especially for shared data across steps or deeply nested components. The current implementation in `FormRenderer.jsx` using `useState` and prop drilling is acceptable for moderately complex forms but might become unwieldy for very large ones.
*   **Immutability:** When updating state, always create new objects/arrays instead of mutating existing ones to ensure React re-renders correctly.

## 7. Data Handling

*   **Submission:**
    *   Submit data (typically as JSON) to a backend API.
    *   Handle API responses (success, error) and provide feedback to the user.
*   **File Uploads:**
    *   Use `FormData` to submit files.
    *   Provide progress indicators for large file uploads.
    *   Handle server-side validation for file types, size, etc.
    *   The current `FileInput` component and server setup for uploads in `test-form/server/index.js` can serve as a basis.
*   **Saving Drafts:** The current `upsertApplication` and `getApplication` in `appStorage.js` (using `localStorage`) is a good approach for client-side draft saving. Ensure data is cleared appropriately upon final submission or expiration.

## 8. Error Handling

*   **Validation Errors:** As mentioned, display these inline next to fields and/or in a summary message per step.
*   **API Errors:** Clearly communicate errors from API calls (e.g., "Failed to save application. Please try again.").
*   **General Errors:** Have a fallback for unexpected JavaScript errors.

## 9. User Experience (UX)

*   **Clarity:**
    *   Use clear and concise labels, instructions, and error messages.
    *   Visually distinguish required fields.
    *   The stepper (as in `Stepper.jsx`) should clearly indicate current position, completed steps, and upcoming steps.
*   **Feedback:**
    *   Provide immediate feedback for actions (e.g., "Data saved as draft").
    *   Use loading indicators for asynchronous operations (e.g., submitting form, file uploads).
*   **Efficiency:**
    *   Auto-saving progress prevents data loss.
    *   For "group" fields, allow easy addition/editing/deletion of items.
    *   The "table layout" with "row copy" functionality is a good example of improving efficiency for repetitive data entry.
*   **Review:** Allow users to review all their entered data before final submission (as handled by `ReviewStep.jsx`).
*   **File Uploads:**
    *   Show selected file names.
    *   Allow clearing/replacing selected files.
    *   Validate file types and sizes client-side before upload to provide quick feedback, but always re-validate server-side.

By following these guidelines, the generated form applications will be more robust, maintainable, user-friendly, and accessible.
