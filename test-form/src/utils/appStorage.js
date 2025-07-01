export async function loadApplications() {
  try {
    const res = await fetch('/api/applications');
    if (!res.ok) throw new Error('Failed to load applications');
    return await res.json();
  } catch {
    return [];
  }
}

export async function getApplication(id) {
  try {
    const res = await fetch(`/api/applications/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function upsertApplication(id, data) {
  await fetch(`/api/applications/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteApplication(id) {
  await fetch(`/api/applications/${id}`, { method: 'DELETE' });
}
