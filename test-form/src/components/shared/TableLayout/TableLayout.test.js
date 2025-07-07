import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TableLayout from './TableLayout';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: () => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
});

describe('TableLayout row copy', () => {
  const fields = [
    { id: 'monday_start', label: 'Monday Start', type: 'time', ui: { rowGroup: 'Monday', column: 1 } },
    { id: 'monday_end', label: 'Monday End', type: 'time', ui: { rowGroup: 'Monday', column: 2 } },
    { id: 'tuesday_start', label: 'Tuesday Start', type: 'time', ui: { rowGroup: 'Tuesday', column: 1 } },
    { id: 'tuesday_end', label: 'Tuesday End', type: 'time', ui: { rowGroup: 'Tuesday', column: 2 } },
  ];

  const ui = {
    columns: ['Start', 'End'],
    rowCopy: {
      enableUserPickSource: true,
      fieldsToCopy: [1, 2],
      targetRowValues: ['Monday', 'Tuesday'],
      copyControlLabel: 'Copy row',
      sourceOptions: ['Monday', 'Tuesday'],
    },
  };

  test('copy button populates target rows', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    const formData = {
      monday_start: '08:00',
      monday_end: '10:00',
      tuesday_start: '',
      tuesday_end: '',
    };

    render(
      <TableLayout
        fields={fields}
        formData={formData}
        onChange={handleChange}
        ui={ui}
      />
    );

    await user.selectOptions(screen.getByLabelText(/Copy schedule from/i), 'Monday');
    await user.click(screen.getByRole('button', { name: /copy row/i }));

    expect(handleChange).toHaveBeenCalledWith('tuesday_start', '08:00');
    expect(handleChange).toHaveBeenCalledWith('tuesday_end', '10:00');
  });
});
