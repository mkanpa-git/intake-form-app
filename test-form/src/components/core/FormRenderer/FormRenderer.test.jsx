import React from 'react';
import { render, screen } from '@testing-library/react';
import FormRenderer from './FormRenderer';
import formSpec from '../../../../public/data/childcare_form.json';

const formSpecPath = '/data/childcare_form.json';

jest.mock('react-markdown', () => ({ children }) => <div>{children}</div>);

beforeAll(() => {
  window.scrollTo = jest.fn();
});

beforeAll(() => {
  window.scrollTo = jest.fn();
});

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.startsWith('/api/applications/')) {
      const spec = require('../../../../public/data/childcare_form.json');
      const reviewIndex = spec.form.steps.findIndex((s) => s.id === 'review');
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: '1', current_step: reviewIndex }),
      });
    }
    if (url === formSpecPath) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(formSpec) });
    }
    return Promise.reject(new Error(`Unexpected fetch URL: ${url}`));
  });
});

test('renders form title', async () => {
  render(<FormRenderer formSpecPath={formSpecPath} />);
  expect(
    await screen.findByRole('heading', { level: 1, name: /Childcare Voucher Application/i })
  ).toBeInTheDocument();
});

test('renders review step when currentStep is review', async () => {
  render(<FormRenderer applicationId="1" formSpecPath={formSpecPath} />);
  expect(await screen.findByRole('heading', { name: /review & submit/i })).toBeInTheDocument();
});
