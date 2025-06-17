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

test('renders review step when currentStep is review', () => {
  const spec = require('../../../data/childcare_form.json');
  const reviewIndex = spec.form.steps.findIndex((s) => s.id === 'review');
  localStorage.setItem(
    'childcareApplications',
    JSON.stringify([{ id: '1', currentStep: reviewIndex }])
  );
  render(<FormRenderer applicationId="1" />);
  expect(screen.getByRole('heading', { name: /review & submit/i })).toBeInTheDocument();
});
