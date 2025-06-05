import { render, screen } from '@testing-library/react';
import App from './App';

test('renders application header', () => {
  render(<App />);
  const headerElement = screen.getByText(/MyCity Childcare/i);
  expect(headerElement).toBeInTheDocument();
});
