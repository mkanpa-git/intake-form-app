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

test('renders accessible progress label', () => {
  const steps = [
    { id: 'one', title: 'One' },
    { id: 'two', title: 'Two' },
  ];
  render(<Stepper steps={steps} currentStep={0} />);
  const progress = screen.getByText('Step 1 of 2');
  expect(progress).toHaveAttribute('aria-label', 'Step 1 of 2');
});

test('step buttons expose correct aria attributes', () => {
  const steps = [
    { id: 'one', title: 'One' },
    { id: 'two', title: 'Two' },
  ];
  const canNavigate = (index) => index <= 0;
  render(
    <Stepper steps={steps} currentStep={0} canNavigate={canNavigate} />
  );
  const buttons = screen.getAllByRole('button');
  expect(buttons[0]).toHaveAttribute('aria-current', 'step');
  expect(buttons[0]).not.toHaveAttribute('aria-disabled');
  expect(buttons[1]).toHaveAttribute('aria-disabled', 'true');
  expect(buttons[1]).not.toHaveAttribute('aria-current');
});

test('sets aria-orientation on the list', () => {
  const steps = [
    { id: 'one', title: 'One' },
    { id: 'two', title: 'Two' },
  ];
  render(<Stepper steps={steps} currentStep={0} orientation="horizontal" />);
  const list = screen.getByRole('list');
  expect(list).toHaveAttribute('aria-orientation', 'horizontal');
});

test('allows arrow key navigation', async () => {
  const user = userEvent.setup();
  const onStepChange = jest.fn();
  const steps = [
    { id: 'one', title: 'One' },
    { id: 'two', title: 'Two' },
    { id: 'three', title: 'Three' },
  ];
  render(
    <Stepper steps={steps} currentStep={1} onStepChange={onStepChange} />
  );
  const buttons = screen.getAllByRole('button');
  buttons[1].focus();
  await user.keyboard('{ArrowRight}');
  expect(onStepChange).toHaveBeenCalledWith(2);
});
