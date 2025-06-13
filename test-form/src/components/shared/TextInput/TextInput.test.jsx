import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import TextInput from './TextInput';

describe('TextInput', () => {
  test('renders label and input', () => {
    render(<TextInput id="username" label="Username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  test('renders tooltip when tooltip text is provided', () => {
    render(
      <TextInput
        id="email"
        label="Email"
        tooltip="We’ll never share your email."
      />
    );
    expect(screen.getByText("We’ll never share your email.")).toBeInTheDocument();
  });

  test('does not render tooltip if not provided', () => {
    render(<TextInput id="name" label="Name" />);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  test('input receives passed props', () => {
    render(
      <TextInput
        id="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
      />
    );
    const input = screen.getByPlaceholderText('you@example.com');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('id', 'email');
  });

  test('label is associated with input via htmlFor/id', () => {
    render(<TextInput id="userId" label="User ID" />);
    const label = screen.getByText('User ID');
    const input = screen.getByLabelText('User ID');
    expect(label).toHaveAttribute('for', 'userId');
    expect(input).toHaveAttribute('id', 'userId');
  });

  test('shows tooltip on hover (if tooltip is interactive)', async () => {
    render(
      <TextInput
        id="email"
        label="Email"
        tooltip="We’ll never share your email."
      />
    );

    const label = screen.getByText('Email');
    await userEvent.hover(label);

    expect(screen.getByText("We’ll never share your email.")).toBeVisible();

    await userEvent.unhover(label);
  });
});
