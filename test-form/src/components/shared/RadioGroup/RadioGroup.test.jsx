import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import RadioGroup from './RadioGroup';

test('renders options and label', () => {
  render(<RadioGroup id="color" label="Color" options={['Red', 'Blue']} />);
  expect(screen.getByText('Color')).toBeInTheDocument();
  expect(screen.getByLabelText('Red')).toBeInTheDocument();
  expect(screen.getByLabelText('Blue')).toBeInTheDocument();
});

test('calls onChange when option selected', async () => {
  const user = userEvent.setup();
  const handleChange = jest.fn();
  function Wrapper() {
    const [val, setVal] = React.useState('');
    return (
      <RadioGroup
        id="color"
        label="Color"
        options={['Red', 'Blue']}
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
          handleChange(e);
        }}
      />
    );
  }
  render(<Wrapper />);
  await user.click(screen.getByLabelText('Blue'));
  expect(handleChange).toHaveBeenCalled();
  expect(screen.getByLabelText('Blue')).toBeChecked();
});

test('preselects value', () => {
  render(<RadioGroup id="color" label="Color" options={['Red', 'Blue']} value="Red" />);
  expect(screen.getByLabelText('Red')).toBeChecked();
});
