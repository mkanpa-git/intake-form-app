import React from 'react';
import { render, screen } from '@testing-library/react';
import FormComponent from './FormComponent';

jest.mock('react-markdown', () => ({ children }) => <div>{children}</div>);

beforeAll(() => {
  window.scrollTo = jest.fn();
});

test('renders first step title', () => {
  render(<FormComponent />);
  expect(screen.getByText(/MyCity Consent/i)).toBeInTheDocument();
});
