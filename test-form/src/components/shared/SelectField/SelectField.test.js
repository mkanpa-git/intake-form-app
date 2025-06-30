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

test('does not render placeholder option when not provided', () => {
  render(
    <SelectField id="no-placeholder" label="NoPlaceholder" options={['One', 'Two']} />
  );
  const select = screen.getByLabelText('NoPlaceholder');
  const blankOption = select.querySelector('option[value=""]');
  expect(blankOption).toBeNull();
});
