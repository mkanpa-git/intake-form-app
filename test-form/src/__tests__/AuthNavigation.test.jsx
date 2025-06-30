import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import { AuthContext } from '../context/AuthContext';

jest.mock('react-markdown', () => ({ children }) => <div>{children}</div>);
jest.mock('remark-gfm', () => ({}));

function renderWithUser(user) {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={{ user }}>
        <App />
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

test('shows Login when unauthenticated', () => {
  renderWithUser(null);
  expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
});

test('shows Profile and Logout when authenticated', async () => {
  const user = userEvent.setup();
  renderWithUser({ first_name: 'Jane' });
  await user.click(screen.getByRole('button', { name: /user menu/i }));
  expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /logout/i })).toBeInTheDocument();
});
