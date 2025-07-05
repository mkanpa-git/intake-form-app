import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ToastProvider, useToast } from '../../../context/ToastContext';

function Demo() {
  const { showToast } = useToast();
  return (
    <button
      onClick={() =>
        showToast({ message: 'Saved', variant: 'success', duration: 1000 })
      }
    >
      Trigger
    </button>
  );
}

test('renders toast when triggered', async () => {
  const user = userEvent.setup();
  render(
    <ToastProvider>
      <Demo />
    </ToastProvider>
  );
  await user.click(screen.getByRole('button', { name: /trigger/i }));
  const toast = await screen.findByRole('status');
  expect(toast).toHaveTextContent('Saved');
});
