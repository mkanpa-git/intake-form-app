import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';

jest.mock('react-markdown', () => ({ children }) => <div>{children}</div>);
beforeAll(() => { window.scrollTo = jest.fn(); });

test('renders application header', () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
  const headerElement = screen.getByText(/MyCity Services/i);
  expect(headerElement).toBeInTheDocument();
});
