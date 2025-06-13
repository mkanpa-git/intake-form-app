import React from 'react';
import { render, screen } from '@testing-library/react';
import FormPage from './FormPage';

jest.mock('../components/core/FormRenderer/FormRenderer', () => () => <div>Default Form</div>);
jest.mock('../components/core/FormRenderer/DycdFormRenderer', () => () => <div>DYCD Form</div>);

test('renders DYCD renderer when service is dycd', () => {
  render(<FormPage service="dycd" />);
  expect(screen.getByText('DYCD Form')).toBeInTheDocument();
});

test('renders default renderer when service is childcare', () => {
  render(<FormPage service="childcare" />);
  expect(screen.getByText('Default Form')).toBeInTheDocument();
});
