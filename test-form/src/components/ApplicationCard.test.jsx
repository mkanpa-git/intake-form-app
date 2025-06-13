import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ApplicationCard from './ApplicationCard';

test('renders details and triggers callbacks', async () => {
  const user = userEvent.setup();
  const handleContinue = jest.fn();
  const handleDelete = jest.fn();
  render(
    <ApplicationCard
      id="1"
      serviceName="Svc"
      interactionName="Interact"
      savedAt="2023-01-01T00:00:00Z"
      onContinue={handleContinue}
      onDelete={handleDelete}
    />
  );

  expect(screen.getByText('Svc')).toBeInTheDocument();
  expect(screen.getByText('Interact')).toBeInTheDocument();
  expect(screen.getByText(/Saved:/)).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Continue' }));
  expect(handleContinue).toHaveBeenCalledWith('1');
  await user.click(screen.getByRole('button', { name: 'Delete' }));
  expect(handleDelete).toHaveBeenCalledWith('1');
});
