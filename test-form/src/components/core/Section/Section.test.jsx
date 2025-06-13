import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Section from './Section';

jest.mock('./Section.module.css', () => ({}));

test('renders title and children', () => {
  render(
    <Section title="Title">
      <div>Child</div>
    </Section>
  );
  expect(screen.getByText('Title')).toBeInTheDocument();
  expect(screen.getByText('Child')).toBeInTheDocument();
});

test('does not render when visible is false', () => {
  const { container } = render(
    <Section title="Hidden" visible={false} />
  );
  expect(container.firstChild).toBeNull();
});

test('calls onToggle when header clicked', async () => {
  const user = userEvent.setup();
  const onToggle = jest.fn();
  render(<Section title="Toggle" onToggle={onToggle} />);
  await user.click(screen.getByText('Toggle'));
  expect(onToggle).toHaveBeenCalled();
});
