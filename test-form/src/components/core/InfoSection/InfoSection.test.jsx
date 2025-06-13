import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InfoSection from './InfoSection';

jest.mock('react-markdown', () => ({ children }) => <div>{children}</div>);

test('renders title and content', () => {
  render(<InfoSection title="Info" content="Test" />);
  expect(screen.getByText('Info')).toBeInTheDocument();
  expect(screen.getByText('Test')).toBeInTheDocument();
});

test('calls onToggle when header clicked', async () => {
  const user = userEvent.setup();
  const onToggle = jest.fn();
  render(
    <InfoSection title="Collapsible" content="Content" ui={{ collapsible: true }} onToggle={onToggle} />
  );
  await user.click(screen.getByText('Collapsible'));
  expect(onToggle).toHaveBeenCalled();
});
