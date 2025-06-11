// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
// Mock react-markdown to avoid ESM import issues in Jest
jest.mock('react-markdown', () => {
  const React = require('react');
  return ({ children }) => React.createElement('div', null, children);
});
