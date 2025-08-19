import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormRenderer from '../components/core/FormRenderer/FormRenderer';

// Mock markdown rendering used in Step components
jest.mock('react-markdown', () => ({ children }) => <div>{children}</div>);
jest.mock('remark-gfm', () => ({}));
jest.mock('../utils/useMediaQuery', () => () => false);

window.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

const formSpec = {
  form: {
    steps: [
      {
        id: 'children_needing_care',
        title: 'Children',
        sections: [
          {
            id: 'child_details',
            title: 'Child Details',
            required: true,
            fields: [
              {
                id: 'children',
                label: 'Children',
                type: 'group',
                metadata: {
                  multiple: true,
                  tableColumns: ['do_both_parents_reside_in_home'],
                },
                fields: [
                  {
                    id: 'do_both_parents_reside_in_home',
                    label: 'Do both parents reside in the home?',
                    type: 'radio',
                    required: true,
                    ui: { options: ['Yes', 'No'] },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'family_members',
        title: 'Family Members',
        sections: [
          {
            id: 'family_member_details',
            title: 'Household Member Details',
            fields: [
              {
                id: 'familymember',
                label: 'Family Members',
                type: 'group',
                requiredCondition: {
                  repeatingGroup: 'children',
                  operator: 'ANY',
                  condition: {
                    field: 'do_both_parents_reside_in_home',
                    operator: 'equals',
                    value: 'Yes',
                  },
                },
                metadata: { multiple: true, tableColumns: ['name'] },
                fields: [
                  { id: 'name', label: 'Name', type: 'text', required: true },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'final',
        title: 'Final',
        sections: [{ id: 'dummy', title: 'Done', fields: [] }],
      },
    ],
  },
};

describe('family member persistence across steps', () => {
  test('entries remain after navigating forward and back', async () => {
    const user = userEvent.setup();
    render(<FormRenderer formSpec={formSpec} />);

    // Add a child with both parents residing in the home
    await user.click(screen.getByRole('button', { name: /add children/i }));
    await user.click(screen.getByRole('radio', { name: /yes/i }));
    await user.click(screen.getByRole('button', { name: /^save$/i }));
    await user.click(screen.getByRole('button', { name: /next/i }));

    // Attempt to continue without adding family members (should be required)
    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(await screen.findByText(/required/i)).toBeInTheDocument();

    // Add a family member entry
    await user.click(screen.getByRole('button', { name: /add family members/i }));
    await user.type(screen.getByLabelText(/name/i), 'John');
    await user.click(screen.getByRole('button', { name: /^save$/i }));

    // Navigate to next step and then back
    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /back/i }));

    // The previously added family member should persist
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});

