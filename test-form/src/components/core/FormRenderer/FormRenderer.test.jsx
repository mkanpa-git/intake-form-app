import React from 'react';
import { render, screen } from '@testing-library/react';
import FormRenderer from './FormRenderer';

jest.mock('react-markdown', () => ({ children }) => <div>{children}</div>);

beforeAll(() => {
  window.scrollTo = jest.fn();
});

beforeAll(() => {
  window.scrollTo = jest.fn();
});

test('renders form title', () => {
  render(<FormRenderer />);
  expect(
    screen.getByRole('heading', { level: 1, name: /Childcare Voucher Application/i })
  ).toBeInTheDocument();
});
