import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import Profile from './Profile';
import { AuthContext } from '../context/AuthContext';

// Basic provider wrapper for Profile page
test('profile page has no accessibility violations', async () => {
  const { container } = render(
    <BrowserRouter>
      <AuthContext.Provider value={{ user: { first_name: 'Jane' }, setUser: jest.fn() }}>
        <Profile />
      </AuthContext.Provider>
    </BrowserRouter>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
