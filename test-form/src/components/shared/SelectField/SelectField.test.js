import { render, screen } from '@testing-library/react';
import SelectField from './SelectField';

test('renders placeholder option when provided', () => {
  render(
    <SelectField
      id="test"
      label="Test"
      options={['One', 'Two']}
      placeholder="Select option"
    />
  );
  const placeholderOpt = screen.getByRole('option', { name: 'Select option' });
  expect(placeholderOpt).toBeInTheDocument();
  expect(placeholderOpt).toHaveValue('');
});
