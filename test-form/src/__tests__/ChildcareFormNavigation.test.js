import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormRenderer from '../components/core/FormRenderer/FormRenderer';
import formSpec from '../../public/data/childcare_form.json';

// Mock markdown rendering used in InfoSection/Step components
jest.mock('react-markdown', () => ({ children }) => <div>{children}</div>);
jest.mock('remark-gfm', () => ({}));

beforeAll(() => {
  global.crypto = { randomUUID: () => '123' };
});

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve(formSpec) })
  );
});

describe('Childcare form navigation', () => {
  const steps = formSpec.form.steps || [];

  test('renders first step by default', async () => {
    render(<FormRenderer />);
    const heading = await screen.findByRole('heading', { level: 2, name: steps[0].title });
    expect(heading).toBeInTheDocument();
  });

  test.skip.each(steps.map((s, i) => [i, s.title]).slice(1))( 
    'navigates to step %i - %s',
    async (index, title) => {
      const user = userEvent.setup();
      render(<FormRenderer />);
      for (let i = 0; i < index; i++) {
        const btn = await screen.findByRole('button', { name: /next/i });
        await user.click(btn);
      }
      expect(
        await screen.findByRole('heading', { level: 2, name: title })
      ).toBeInTheDocument();
    }
  );
});
