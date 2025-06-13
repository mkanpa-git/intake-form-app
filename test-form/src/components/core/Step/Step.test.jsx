import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Step from './Step';

jest.mock('./Step.module.css', () => ({}));
jest.mock('../Section/Section.module.css', () => ({}));
jest.mock('../InfoSection/InfoSection.module.css', () => ({}));

// Mock ReactMarkdown to avoid parsing
jest.mock('react-markdown', () => ({ children }) => <div>{children}</div>);

test('submits data on next click', async () => {
  const user = userEvent.setup();
  const onNext = jest.fn();
  const sections = [
    {
      id: 'sec',
      title: 'Sec',
      fields: [
        { id: 'name', label: 'Name', type: 'text', required: true }
      ]
    }
  ];
  render(
    <Step title="Step" sections={sections} onNext={onNext} />
  );

  await user.type(screen.getByLabelText('Name'), 'John');
  await user.click(screen.getByRole('button', { name: 'Next' }));
  expect(onNext).toHaveBeenCalledWith({ name: 'John' });
});
