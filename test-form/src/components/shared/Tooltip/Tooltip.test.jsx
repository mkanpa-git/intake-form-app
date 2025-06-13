import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Tooltip from './Tooltip';

test('renders nothing when no text', () => {
  const { container } = render(<Tooltip />);
  expect(container).toBeEmptyDOMElement();
});

test('shows tooltip on hover', async () => {
  const user = userEvent.setup();
  render(<Tooltip text="Info" />);
  const tooltip = screen.getByRole('tooltip');
  const wrapper = tooltip.parentElement;
  expect(tooltip.className).not.toMatch(/visible/);
  await user.hover(wrapper);
  expect(tooltip.className).toMatch(/visible/);
  await user.unhover(wrapper);
  expect(tooltip.className).not.toMatch(/visible/);
});
