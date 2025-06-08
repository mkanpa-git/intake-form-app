export function loadApplications() {
  try {
    const raw = localStorage.getItem('childcareApplications');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveApplications(apps) {
  localStorage.setItem('childcareApplications', JSON.stringify(apps));
}

export function getApplication(id) {
  return loadApplications().find((a) => a.id === id);
}

export function upsertApplication(id, data) {
  const apps = loadApplications();
  const idx = apps.findIndex((a) => a.id === id);
  if (idx !== -1) {
    apps[idx] = { ...apps[idx], ...data, id };
  } else {
    apps.push({ id, ...data });
  }
  saveApplications(apps);
}

export function deleteApplication(id) {
  const updated = loadApplications().filter((a) => a.id !== id);
  saveApplications(updated);
}
