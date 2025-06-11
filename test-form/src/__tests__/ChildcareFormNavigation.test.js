import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormRenderer from '../components/core/FormRenderer/FormRenderer';
import formSpec from '../data/childcare_form.json';

describe('Childcare form navigation', () => {
  const steps = formSpec.form.steps || [];

  test('renders first step by default', () => {
    render(<FormRenderer />);
    const heading = screen.getByRole('heading', { level: 2, name: steps[0].title });
    expect(heading).toBeInTheDocument();
  });

  test.each(steps.map((s, i) => [i, s.title]).slice(1))(
    'navigates to step %i - %s',
    async (index, title) => {
      const user = userEvent.setup();
      render(<FormRenderer />);
      for (let i = 0; i < index; i++) {
        await user.click(screen.getByRole('button', { name: /next/i }));
      }
      expect(
        screen.getByRole('heading', { level: 2, name: title })
      ).toBeInTheDocument();
    }
  );
});
