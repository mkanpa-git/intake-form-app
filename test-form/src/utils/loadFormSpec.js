export async function loadMergedFormSpec(service, language) {
  const basePath = `/data/${service}_form.json`;
  const localizedPath = `/data/${service}_form.${language}.json`;

  const baseResp = await fetch(basePath);
  if (!baseResp.ok) {
    throw new Error(`Failed to load base form spec: ${baseResp.status}`);
  }
  const baseSpec = await baseResp.json();

  if (!language || language === 'en') {
    return baseSpec;
  }

  try {
    const locResp = await fetch(localizedPath);
    if (!locResp.ok) {
      return baseSpec;
    }
    const locSpec = await locResp.json();
    return mergeFormSpecs(baseSpec, locSpec);
  } catch (e) {
    console.error('Failed loading localized spec', e);
    return baseSpec;
  }
}

function mergeFormSpecs(baseSpec, locSpec) {
  if (!locSpec || !locSpec.form) return baseSpec;
  const merged = { ...baseSpec };
  merged.form = mergeForm(baseSpec.form, locSpec.form);
  return merged;
}

function mergeForm(baseForm, locForm) {
  const merged = { ...baseForm };
  if (locForm.title) merged.title = locForm.title;
  if (locForm.description) merged.description = locForm.description;
  if (Array.isArray(baseForm.steps)) {
    merged.steps = baseForm.steps.map((step, idx) =>
      mergeStep(step, locForm.steps ? locForm.steps[idx] : undefined),
    );
  }
  return merged;
}

function mergeStep(baseStep, locStep = {}) {
  const merged = { ...baseStep };
  if (locStep.title) merged.title = locStep.title;
  if (locStep.description) merged.description = locStep.description;
  if (Array.isArray(baseStep.sections)) {
    merged.sections = baseStep.sections.map((sec, idx) =>
      mergeSection(sec, locStep.sections ? locStep.sections[idx] : undefined),
    );
  }
  return merged;
}

function mergeSection(baseSec, locSec = {}) {
  const merged = { ...baseSec };
  if (locSec.title) merged.title = locSec.title;
  if (locSec.description) merged.description = locSec.description;
  if (Array.isArray(baseSec.fields)) {
    merged.fields = baseSec.fields.map((f, idx) =>
      mergeField(f, locSec.fields ? locSec.fields[idx] : undefined),
    );
  }
  return merged;
}

function mergeOptions(baseOpts = [], locOpts = []) {
  if (!Array.isArray(baseOpts)) return locOpts;
  if (!Array.isArray(locOpts)) return baseOpts;

  return baseOpts.map((opt, idx) => {
    const baseValue = typeof opt === 'string' ? opt : opt.value;
    const baseLabel = typeof opt === 'string' ? opt : opt.label;
    const loc = locOpts[idx];

    let label = baseLabel;
    if (typeof loc === 'string') {
      label = loc;
    } else if (loc && typeof loc === 'object') {
      label = loc.label || loc.value || baseLabel;
    }

    if (typeof opt === 'string') {
      return { value: baseValue, label };
    }

    return { ...opt, value: baseValue, label };
  });
}

function mergeField(baseField, locField = {}) {
  const merged = { ...baseField };
  if (locField.label) merged.label = locField.label;
  if (locField.tooltip) merged.tooltip = locField.tooltip;

  if (locField.options) {
    merged.options = mergeOptions(baseField.options, locField.options);
  }

  if (locField.ui) {
    const filtered = filterUi(locField.ui);
    if (filtered.options) {
      filtered.options = mergeOptions(baseField.ui?.options, filtered.options);
    }
    merged.ui = { ...baseField.ui, ...filtered };
  }
  if (baseField.type === 'group' && Array.isArray(baseField.fields)) {
    merged.fields = baseField.fields.map((sf, idx) =>
      mergeField(sf, locField.fields ? locField.fields[idx] : undefined),
    );
  }
  return merged;
}

function filterUi(ui) {
  const allowed = ['placeholder', 'title', 'options'];
  const out = {};
  allowed.forEach((k) => {
    if (ui && ui[k] !== undefined) out[k] = ui[k];
  });
  return out;
}

export default loadMergedFormSpec;
