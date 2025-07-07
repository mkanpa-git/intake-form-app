import { validateStep } from '../utils/formHelpers';

const step = {
  sections: [
    {
      id: 'childrenSec',
      title: 'Children',
      fields: [
        {
          id: 'children',
          type: 'group',
          metadata: { multiple: true },
          fields: [
            { id: 'name', label: 'Name', type: 'text' },
            { id: 'needs_help', label: 'Needs help', type: 'checkbox' },
          ],
        },
      ],
    },
    {
      id: 'parentSec',
      title: 'Parent',
      fields: [
        {
          id: 'guardian',
          label: 'Guardian',
          type: 'text',
          requiredCondition: {
            repeatingGroup: 'children',
            operator: 'ANY',
            condition: {
              field: 'needs_help',
              operator: 'equals',
              value: true,
            },
          },
        },
      ],
    },
  ],
};

describe('repeating group conditions', () => {
  test('field becomes required when ANY record matches', () => {
    const data = { children: [{ name: 'Ann', needs_help: true }], guardian: '' };
    const result = validateStep(step, data, {}, {}, data);
    expect(result.errors.guardian).toBe('Guardian is required.');
  });

  test('field not required when no records match', () => {
    const data = { children: [{ name: 'Ann', needs_help: false }], guardian: '' };
    const result = validateStep(step, data, {}, {}, data);
    expect(result.errors.guardian).toBe('');
  });
});
