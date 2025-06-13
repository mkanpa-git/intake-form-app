import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ServiceCard from './ServiceCard';

test('calls onStart when clicked', async () => {
  const user = userEvent.setup();
  const onStart = jest.fn();
  render(
    <ServiceCard
      name="Service"
      interaction="Interact"
      description="Desc"
      onStart={onStart}
    />
  );
  await user.click(screen.getByRole('link'));
  expect(onStart).toHaveBeenCalled();
});
