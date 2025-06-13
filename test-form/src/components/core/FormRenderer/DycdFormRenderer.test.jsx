import React from 'react';
import { render, screen } from '@testing-library/react';
import DycdFormRenderer from './DycdFormRenderer';

jest.mock('react-markdown', () => ({ children }) => <div>{children}</div>);

beforeAll(() => {
  window.scrollTo = jest.fn();
});

beforeAll(() => {
  window.scrollTo = jest.fn();
});

test('renders DYCD form title', () => {
  render(<DycdFormRenderer />);
  expect(
    screen.getByRole('heading', { level: 1, name: /DYCD Youth Services Intake/i })
  ).toBeInTheDocument();
});
