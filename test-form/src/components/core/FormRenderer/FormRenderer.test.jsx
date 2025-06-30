import React from 'react';
import { render, screen } from '@testing-library/react';
import FormRenderer from './FormRenderer';
import formSpec from '../../../data/childcare_form.json';

jest.mock('react-markdown', () => ({ children }) => <div>{children}</div>);

beforeAll(() => {
  window.scrollTo = jest.fn();
});

beforeAll(() => {
  window.scrollTo = jest.fn();
});

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve(formSpec) })
  );
});

test('renders form title', async () => {
  render(<FormRenderer />);
  expect(
    await screen.findByRole('heading', { level: 1, name: /Childcare Voucher Application/i })
  ).toBeInTheDocument();
});

test('renders review step when currentStep is review', async () => {
  const spec = require('../../../data/childcare_form.json');
  const reviewIndex = spec.form.steps.findIndex((s) => s.id === 'review');
  localStorage.setItem(
    'childcareApplications',
    JSON.stringify([{ id: '1', currentStep: reviewIndex }])
  );
  render(<FormRenderer applicationId="1" />);
  expect(await screen.findByRole('heading', { name: /review & submit/i })).toBeInTheDocument();
});
