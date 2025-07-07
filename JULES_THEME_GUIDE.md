# Jules Theme Guide for ModelCity Services Forms

This document provides an overview of the `jules_` CSS theme created to enhance the ModelCity Services form application with a world-class user experience. It focuses on clarity, accessibility, and a professional, modern aesthetic suitable for government applications.

## 1. CSS File Structure

The `jules_` theme is organized into several CSS files located in `test-form/src/`:

*   **`jules_tokens.css`**: Contains all core CSS custom properties (variables) for the theme, including colors, typography, spacing, borders, and shadows. This is the foundational file for all styling.
*   **`jules_base.css`**: Provides global resets, base HTML element styling (body, headings, paragraphs, links), and default typography settings using the defined tokens.
*   **`jules_layout.css`**: Styles the main page structure, including the header, footer, main content area, and overall wizard layout containers.
*   **`jules_button.css`**: Defines styles for various button types (primary, secondary, tertiary, destructive) and their states (hover, focus, disabled).
*   **`jules_input.css`**: Contains comprehensive styles for all form input elements, including labels, text inputs, selects, radio buttons, checkboxes, file inputs, and their associated states (focus, error, disabled), hints, and validation messages.
*   **`jules_stepper.css`**: Styles the multi-step navigation component (stepper), indicating current, completed, and future steps.
*   **`jules_section.css`**: Styles for form sections, including collapsible section headers and content areas, as well as informational display sections.
*   **`jules_groupfield.css`**: Specific styles for "group" fields that allow adding multiple entries (e.g., children, jobs), typically displayed in a table with add/edit/delete functionality.
*   **`jules_tablelayout.css`**: Styles for data presented in a tabular format, such as work schedules, including table headers, cells, and row copy controls. On screens narrower than 768&nbsp;px the table converts to a stacked layout. You can control how many columns remain visible using the `maxColumns` option on a section.
*   **`jules_misc.css`**: Styles for miscellaneous UI components like tooltips, modals, alert messages (error, success, warning, info), and specific styling for the review step.

## 2. Core Theme Foundation

The theme is built upon the variables defined in `jules_tokens.css`.

### 2.1. Color Palette

*   **Primary (Brand & Interactive):**
    *   `--jules-primary-blue: #005ea2;` (Dependable Blue)
    *   `--jules-primary-blue-hover: #003e73;`
    *   `--jules-primary-blue-light: #e6f0f7;`
*   **Accent (Call to Actions):**
    *   `--jules-accent-teal: #00a090;` (Modern Teal)
    *   `--jules-accent-teal-hover: #007367;`
*   **Neutrals:**
    *   Page Background: `var(--jules-neutral-gray-100: #f8f9fa;)`
    *   Surface/Card Background: `var(--jules-neutral-white: #ffffff;)`
    *   Borders: `var(--jules-border-color: #dee2e6;)`
    *   Body Text: `var(--jules-text-color-body: #495057;)`
    *   Heading Text: `var(--jules-text-color-headings: #212529;)`
    *   Muted Text: `var(--jules-text-color-muted: #adb5bd;)`
*   **Status Colors:**
    *   Error: `var(--jules-status-error-red: #d93025;)` (BG: `--jules-status-error-red-light: #fbe9e7;`)
    *   Success: `var(--jules-status-success-green: #1e8e3e;)` (BG: `--jules-status-success-green-light: #e6f4ea;`)
    *   Warning: `var(--jules-status-warning-yellow: #f9ab00;)` (BG: `--jules-status-warning-yellow-light: #fff8e1;`)
    *   Info: `var(--jules-status-info-blue: #005ea2;)` (BG: `--jules-status-info-blue-light: #e6f0f7;`)

### 2.2. Typography

*   **Font Family (Sans-serif):** `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...;` (`--jules-font-family-sans`)
*   **Base Font Size:** `17px` (`--jules-font-size-base`)
*   **Line Height (Base):** `1.6` (`--jules-line-height-base`)
*   **Key Font Sizes (approximate):**
    *   Small: `~15px` (`--jules-font-size-sm`)
    *   Medium (Base): `~17px` (`--jules-font-size-md`)
    *   Large: `~20px` (`--jules-font-size-lg`)
    *   XL: `~24px` (`--jules-font-size-xl`)
    *   XXL: `~32px` (`--jules-font-size-xxl`)
*   **Main Weights:** Normal (400), Medium (500), Semibold (600), Bold (700).

### 2.3. Spacing

A consistent spacing scale (e.g., 4px/8px base increments) is used for padding and margins, available via `--jules-space-*` variables.

### 2.4. Borders and Shadows

*   Subtle border radii (`--jules-border-radius-md: 6px;`) and border colors (`--jules-border-color`) are used for definition.
*   Soft shadows (`--jules-shadow-sm`, `--jules-shadow-md`) are used to create depth for elements like modals or elevated cards.

## 3. Key UI Element Styling Examples

*   **Buttons:**
    *   Primary actions use a solid `--jules-primary-blue` background with white text.
    *   Secondary actions use a border of `--jules-primary-blue` with text in `--jules-primary-blue` on a white background.
    *   Clear focus states (`--jules-focus-ring`) and hover/disabled states are defined.
*   **Input Fields:**
    *   Clean design with borders defined by `--jules-border-color`.
    *   Enhanced focus state using `--jules-primary-blue` border and a box shadow (`--jules-focus-ring`).
    *   Error states are clearly indicated with `--jules-status-error-red` border and a light red background.
    *   Labels are positioned above inputs with clear indication for required fields.
*   **Sections:**
    *   Section headers are visually distinct with a light gray background (`--jules-neutral-gray-100`) and a bottom border.
    *   Collapsible sections use clear iconography (e.g., chevrons).
*   **Navigation (Stepper):**
    *   Active steps are highlighted (e.g., light blue background, primary blue text).
    *   Completed steps are marked (e.g., green checkmark).

This theme aims to provide a highly usable, accessible, and visually appealing interface for users interacting with ModelCity Services forms.

## Theme Switching

The design tokens support both light and dark themes. By default the light theme values are applied from the `:root` selector in `jules_tokens.css`. A `[data-theme='dark']` block overrides key color variables for dark mode.

Set the desired theme on the root HTML element:

```html
<html data-theme="dark">
```

In React you can toggle this attribute dynamically:

```js
const toggle = () => {
  const current = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
};
```

The sample `App.js` now includes an icon toggle that switches between light and dark modes with a subtle fade transition.
