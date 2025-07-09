import loadMergedFormSpec from './loadFormSpec';

describe('loadMergedFormSpec option merging', () => {
  const base = {
    form: {
      steps: [
        {
          sections: [
            {
              fields: [
                { id: 'radio', type: 'radio', ui: { options: ['Yes', 'No'] } },
              ],
            },
          ],
        },
      ],
    },
  };
  const loc = {
    form: {
      steps: [
        {
          sections: [
            {
              fields: [
                { ui: { options: ['Sí', 'No'] } },
              ],
            },
          ],
        },
      ],
    },
  };

  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (url === '/data/childcare_form.json') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(base) });
      }
      if (url === '/data/childcare_form.es.json') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(loc) });
      }
      return Promise.reject(new Error(`Unexpected url ${url}`));
    });
  });

  test('preserves option values while applying translations', async () => {
    const merged = await loadMergedFormSpec('childcare', 'es');
    const opts =
      merged.form.steps[0].sections[0].fields[0].ui.options;
    expect(opts).toEqual([
      { value: 'Yes', label: 'Sí' },
      { value: 'No', label: 'No' },
    ]);
  });
});

describe('loadMergedFormSpec path resolution', () => {
  test('uses no _form suffix for group_cc_permit service', async () => {
    const base = { form: {} };
    global.fetch = jest.fn((url) => {
      if (url === '/data/group_cc_permit.json') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(base) });
      }
      return Promise.reject(new Error(`Unexpected url ${url}`));
    });

    await loadMergedFormSpec('group_cc_permit', 'en');

    expect(global.fetch).toHaveBeenCalledWith('/data/group_cc_permit.json');
  });
});
