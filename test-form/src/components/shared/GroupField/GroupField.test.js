import ReactMarkdown from 'react-markdown';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GroupField from './GroupField';

jest.mock('react-markdown', () => ({ children }) => <div>{children}</div>);

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

  test('shows errors and prevents save when required fields missing', async () => {
    const user = userEvent.setup();
    const requiredField = {
      ...field,
      fields: [
        { id: 'name', label: 'Name', type: 'text', required: true },
        { id: 'age', label: 'Age', type: 'text' },
      ],
    };

    const handleChange = jest.fn();
    render(<GroupField field={requiredField} value={[]} onChange={handleChange} />);

    await user.click(screen.getByText(/Add Child/i));
    await user.click(screen.getByText('Save'));

    expect(handleChange).not.toHaveBeenCalled();
    expect(screen.getByText('Name is required.')).toBeInTheDocument();
  });

  test('only displays fields listed in metadata.tableColumns', () => {
    const fieldWithColumns = {
      ...field,
      metadata: { tableColumns: ['name'] },
    };
    const value = [{ name: 'John', age: '4' }];
    render(<GroupField field={fieldWithColumns} value={value} onChange={() => {}} />);

    // Header should only show "Name"
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Age' })).not.toBeInTheDocument();

    // Row should only include the name value
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.queryByText('4')).not.toBeInTheDocument();
  });
});
