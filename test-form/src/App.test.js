import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-markdown', () => ({ children }) => <div>{children}</div>);
beforeAll(() => { window.scrollTo = jest.fn(); });

test('renders application header', () => {
  render(<App />);
  const headerElement = screen.getByText(/MyCity Services/i);
  expect(headerElement).toBeInTheDocument();
});
