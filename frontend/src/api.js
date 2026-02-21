const BASE = '';

export async function fetchRepos({ category, sort, search, page, perPage } = {}) {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.set('category', category);
  if (sort) params.set('sort', sort);
  if (search) params.set('search', search);
  if (page) params.set('page', String(page));
  if (perPage) params.set('per_page', String(perPage));

  const res = await fetch(`${BASE}/api/repos?${params}`);
  if (!res.ok) throw new Error(`Failed to fetch repos: ${res.status}`);
  return res.json();
}

export async function refreshRepos() {
  const res = await fetch(`${BASE}/api/repos/refresh`, { method: 'POST' });
  if (!res.ok) throw new Error(`Failed to trigger refresh: ${res.status}`);
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${BASE}/api/stats`);
  if (!res.ok) throw new Error(`Failed to fetch stats: ${res.status}`);
  return res.json();
}
