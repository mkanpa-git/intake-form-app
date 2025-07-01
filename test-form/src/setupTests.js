// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// jsdom does not implement scrollTo; provide a stub for tests that call it
window.scrollTo = () => {};

// Provide crypto.randomUUID for tests (jsdom may not implement it)
if (!global.crypto) {
  global.crypto = { randomUUID: () => 'test-id' };
} else if (!global.crypto.randomUUID) {
  global.crypto.randomUUID = () => 'test-id';
}
