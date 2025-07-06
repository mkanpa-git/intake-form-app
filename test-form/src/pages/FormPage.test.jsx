import React from 'react';
import { render, screen } from '@testing-library/react';
import FormPage from './FormPage';
import FormRenderer from '../components/core/FormRenderer/FormRenderer';

jest.mock('../components/core/FormRenderer/FormRenderer', () => jest.fn(() => <div>Rendered</div>));

beforeEach(() => {
  FormRenderer.mockClear();
});

test('passes DYCD form path when service is dycd', () => {
  render(<FormPage service="dycd" />);
  expect(FormRenderer.mock.calls[0][0].formSpecPath).toBe('/data/dycd_form.json');
});

test('passes childcare form path when service is childcare', () => {
  render(<FormPage service="childcare" />);
  expect(FormRenderer.mock.calls[0][0].formSpecPath).toBe(
    '/data/childcare_form.json',
  );
});
