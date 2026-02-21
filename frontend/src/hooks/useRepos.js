import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchRepos, refreshRepos } from '../api';

export function useRepos({ category, sort, search, page = 1, perPage = 30 } = {}) {
  const [repos, setRepos] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchRepos({ category, sort, search, page, perPage });
      setRepos(data.repos);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }, [category, sort, search, page, perPage]);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(async () => {
    try {
      await refreshRepos();
      // Wait a moment for backend to process, then reload
      setTimeout(load, 2000);
    } catch (err) {
      setError(err.message);
    }
  }, [load]);

  return { repos, total, loading, error, refresh, reload: load };
}
