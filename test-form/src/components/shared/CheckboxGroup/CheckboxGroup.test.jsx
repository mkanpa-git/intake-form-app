import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CheckboxGroup from './CheckboxGroup';

test('renders label and options', () => {
  render(
    <CheckboxGroup id="fruit" label="Fruit" options={['Apple', 'Banana']} />
  );
  expect(screen.getByText('Fruit')).toBeInTheDocument();
  expect(screen.getByLabelText('Apple')).toBeInTheDocument();
  expect(screen.getByLabelText('Banana')).toBeInTheDocument();
});

test('handles selection and unselection', async () => {
  const user = userEvent.setup();
  const handleChange = jest.fn();
  function Wrapper() {
    const [val, setVal] = React.useState([]);
    return (
      <CheckboxGroup
        id="fruit"
        label="Fruit"
        options={['Apple', 'Banana']}
        value={val}
        onChange={(v) => {
          setVal(v);
          handleChange(v);
        }}
      />
    );
  }
  const { rerender } = render(<Wrapper />);
  await user.click(screen.getByLabelText('Apple'));
  expect(handleChange).toHaveBeenLastCalledWith(['Apple']);
  await user.click(screen.getByLabelText('Banana'));
  expect(handleChange).toHaveBeenLastCalledWith(['Apple', 'Banana']);
  await user.click(screen.getByLabelText('Apple'));
  expect(handleChange).toHaveBeenLastCalledWith(['Banana']);
});

test('checks boxes based on value prop', () => {
  render(
    <CheckboxGroup
      id="fruit"
      label="Fruit"
      options={['Apple', 'Banana']}
      value={['Banana']}
    />
  );
  expect(screen.getByLabelText('Banana')).toBeChecked();
  expect(screen.getByLabelText('Apple')).not.toBeChecked();
});
