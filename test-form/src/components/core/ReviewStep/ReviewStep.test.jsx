import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewStep from './ReviewStep';

jest.mock('./ReviewStep.module.css', () => ({}));

test('calls handlers on edit and submit', async () => {
  const user = userEvent.setup();
  const steps = [
    { id: 'a', title: 'Step A' },
    { id: 'review', title: 'Review & Submit', type: 'review' }
  ];
  const stepData = { a: { name: 'John' } };
  const onEdit = jest.fn();
  const onSubmit = jest.fn();
  render(<ReviewStep steps={steps} stepData={stepData} onEdit={onEdit} onSubmit={onSubmit} />);
  await user.click(screen.getByRole('button', { name: /edit/i }));
  expect(onEdit).toHaveBeenCalledWith(0);
  await user.click(screen.getByRole('button', { name: /submit application/i }));
  expect(onSubmit).toHaveBeenCalled();
});

test('skips steps that only contain info sections', () => {
  const steps = [
    {
      id: 'info',
      title: 'Info Only',
      sections: [
        { id: 's1', type: 'info', title: 'Info' }
      ]
    },
    { id: 'review', title: 'Review & Submit', type: 'review' }
  ];
  render(<ReviewStep steps={steps} stepData={{}} onEdit={() => {}} onSubmit={() => {}} />);
  expect(screen.queryByRole('heading', { level: 3, name: /info only/i })).not.toBeInTheDocument();
});
