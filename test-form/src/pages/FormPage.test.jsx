import React from 'react';
import { render } from '@testing-library/react';
import FormPage from './FormPage';
import FormRenderer from '../components/core/FormRenderer/FormRenderer';

jest.mock('../components/core/FormRenderer/FormRenderer', () => jest.fn(() => <div>Rendered</div>));

beforeEach(() => {
  FormRenderer.mockClear();
});

test('uses FormRenderer for dycd service', () => {
  render(<FormPage service="dycd" />);
  expect(FormRenderer).toHaveBeenCalledWith(
    expect.objectContaining({ formSpecPath: '/data/dycd_form.json' }),
    undefined,
  );
});

test('uses FormRenderer for childcare service', () => {
  render(<FormPage service="childcare" />);
  expect(FormRenderer).toHaveBeenCalledWith(
    expect.objectContaining({ formSpecPath: '/data/childcare_form.json' }),
    undefined,
  );
});

test('uses FormRenderer for DOHMH service', () => {
  render(<FormPage service="DOHMH" />);
  expect(FormRenderer).toHaveBeenCalledWith(
    expect.objectContaining({ formSpecPath: '/data/group_cc_permit.json' }),
    undefined,
  );
});
