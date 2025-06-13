import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import MaskedInput from './MaskedInput';

jest.mock('react-imask', () => ({
  IMaskInput: ({ onAccept, ...props }) => (
    <input {...props} onChange={e => onAccept && onAccept(e.target.value)} />
  )
}));

test('renders input with placeholder', () => {
  render(<MaskedInput id="phone" label="Phone" mask="000" placeholder="123" />);
  expect(screen.getByPlaceholderText('123')).toBeInTheDocument();
});

test('calls onChange when typing', async () => {
  const user = userEvent.setup();
  const handleChange = jest.fn();
  render(<MaskedInput id="phone" onChange={handleChange} />);
  const input = screen.getByRole('textbox');
  await user.type(input, '42');
  expect(handleChange).toHaveBeenLastCalledWith('42');
});

test('shows error text', () => {
  render(<MaskedInput id="phone" error="Required" />);
  expect(screen.getByText('Required')).toBeInTheDocument();
});
