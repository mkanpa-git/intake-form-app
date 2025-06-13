import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Stepper from './Stepper';

jest.mock('./Stepper.module.css', () => ({}));

test('calls onStepChange when step clicked', async () => {
  const user = userEvent.setup();
  const onStepChange = jest.fn();
  const steps = [
    { id: 'one', title: 'One' },
    { id: 'two', title: 'Two' },
  ];
  render(
    <Stepper steps={steps} currentStep={0} onStepChange={onStepChange} />
  );
  await user.click(screen.getByText('Two'));
  expect(onStepChange).toHaveBeenCalledWith(1);
});
