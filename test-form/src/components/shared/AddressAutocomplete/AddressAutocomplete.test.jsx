import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AddressAutocomplete from './AddressAutocomplete';

beforeAll(() => { global.crypto = { randomUUID: () => "uuid" }; });
test('renders label and input', () => {
  render(<AddressAutocomplete id="addr" label="Address" />);
  const input = screen.getByLabelText('Address');
  expect(input).toBeInTheDocument();
});

test('calls onChange when typing', async () => {
  const user = userEvent.setup();
  const handleChange = jest.fn();
  render(<AddressAutocomplete id="addr" label="Address" onChange={handleChange} />);
  const input = screen.getByLabelText('Address');
  await user.type(input, '123');
  expect(handleChange).toHaveBeenCalled();
});
