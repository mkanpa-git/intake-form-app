import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GroupField from './GroupField';

describe('GroupField component', () => {
  const field = {
    id: 'children',
    label: 'Child',
    fields: [
      { id: 'name', label: 'Name', type: 'text' },
      { id: 'age', label: 'Age', type: 'text' },
    ],
  };

  test('syncs entries with value prop', () => {
    const { rerender } = render(<GroupField field={field} value={[]} onChange={() => {}} />);
    expect(screen.queryByText('Ann')).not.toBeInTheDocument();

    const newVal = [{ name: 'Ann', age: '2' }];
    rerender(<GroupField field={field} value={newVal} onChange={() => {}} />);
    expect(screen.getByText('Ann')).toBeInTheDocument();
  });

  test('onChange receives updated array on save', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<GroupField field={field} value={[]} onChange={handleChange} />);

    await user.click(screen.getByText(/Add Child/i));
    await user.type(screen.getByLabelText('Name'), 'John');
    await user.type(screen.getByLabelText('Age'), '4');
    await user.click(screen.getByText('Save'));

    expect(handleChange).toHaveBeenCalledWith([{ name: 'John', age: '4' }]);
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
