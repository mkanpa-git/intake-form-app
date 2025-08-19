import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BusinessProfile from './BusinessProfile';
import { AuthContext } from '../context/AuthContext';

test('submits form data to server', async () => {
  document.cookie = 'XSRF-TOKEN=token123';

  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) })
    .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

  const user = userEvent.setup();

  render(
    <AuthContext.Provider value={{ user: { id: 'u1' }, setUser: jest.fn() }}>
      <MemoryRouter initialEntries={['/profile/biz123']}>
        <Routes>
          <Route path="/profile/:businessId" element={<BusinessProfile />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );

  await user.type(screen.getByLabelText(/Legal Name/i), 'Acme');
  await user.type(screen.getByLabelText(/Primary Contact Name/i), 'John Doe');
  await user.type(screen.getByLabelText(/Primary Contact Phone/i), '1234567890');
  await user.type(screen.getByLabelText(/Primary Contact Email/i), 'john@example.com');
  await user.click(screen.getByRole('button', { name: /save/i }));

  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    '/api/profile/business/biz123',
    expect.objectContaining({
      method: 'PUT',
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
        'X-CSRF-Token': 'token123',
      }),
    })
  );

  const body = JSON.parse(global.fetch.mock.calls[1][1].body);
  expect(body.legal_name).toBe('Acme');
  expect(body.primary_contact_name).toBe('John Doe');
  expect(body.primary_contact_phone).toBe('1234567890');
  expect(body.primary_contact_email).toBe('john@example.com');
});

