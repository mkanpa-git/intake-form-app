import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import FileInput from './FileInput';

jest.mock('react-markdown', () => ({ children }) => <div>{children}</div>);

test('uploads single file and displays name', async () => {
  const user = userEvent.setup();
  const handleChange = jest.fn();
  render(<FileInput id="doc" label="Document" onChange={handleChange} />);
  const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
  const input = screen.getByLabelText('Document');
  await user.upload(input, file);
  expect(handleChange).toHaveBeenCalledWith(file);
  expect(screen.getByText('hello.txt')).toBeInTheDocument();
});

test('supports multiple files', async () => {
  const user = userEvent.setup();
  const handleChange = jest.fn();
  render(
    <FileInput id="docs" label="Documents" onChange={handleChange} multiple />
  );
  const files = [
    new File(['1'], 'one.txt', { type: 'text/plain' }),
    new File(['2'], 'two.txt', { type: 'text/plain' })
  ];
  const input = screen.getByLabelText('Documents');
  await user.upload(input, files);
  expect(handleChange).toHaveBeenCalledWith(files);
  expect(screen.getByText('one.txt')).toBeInTheDocument();
  expect(screen.getByText('two.txt')).toBeInTheDocument();
});
