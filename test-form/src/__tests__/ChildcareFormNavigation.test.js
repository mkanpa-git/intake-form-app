import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormRenderer from '../components/core/FormRenderer/FormRenderer';
import formSpec from '../../public/data/childcare_form.json';

const formSpecPath = '/data/childcare_form.json';

// Mock markdown rendering used in InfoSection/Step components
jest.mock('react-markdown', () => ({ children }) => <div>{children}</div>);
jest.mock('remark-gfm', () => ({}));

beforeAll(() => {
  global.crypto = { randomUUID: () => '123' };
});

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url === formSpecPath) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(formSpec) });
    }
    return Promise.reject(new Error(`Unexpected fetch URL: ${url}`));
  });
});

describe('Childcare form navigation', () => {
  const steps = formSpec.form.steps || [];

  test('renders first step by default', async () => {
    render(<FormRenderer formSpecPath={formSpecPath} />);
    const heading = await screen.findByRole('heading', { level: 2, name: steps[0].title });
    expect(heading).toBeInTheDocument();
  });

  test('navigates to second step', async () => {
      const user = userEvent.setup();
      render(<FormRenderer formSpecPath={formSpecPath} />);
      const btn = await screen.findByRole('button', { name: /next/i });
      await user.click(btn);
      expect(
        await screen.findByRole('heading', { level: 2, name: steps[1].title })
      ).toBeInTheDocument();
  });
});
