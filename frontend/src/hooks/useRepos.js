import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchRepos, refreshRepos } from '../api';

export function useRepos({ category, sort, search, page = 1, perPage = 30 } = {}) {
  const [repos, setRepos] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
    setRefreshing(true);
    try {
      const res = await refreshRepos();
      // Poll until new data arrives or timeout
      const prevTotal = total;
      let attempts = 0;
      const poll = async () => {
        attempts++;
        try {
          const data = await fetchRepos({ category, sort, search, page, perPage });
          if (data.total !== prevTotal || attempts >= 5) {
            setRepos(data.repos);
            setTotal(data.total);
            setRefreshing(false);
          } else {
            setTimeout(poll, 2000);
          }
        } catch {
          setRefreshing(false);
        }
      };
      setTimeout(poll, 2000);
    } catch (err) {
      setError(err.message);
      setRefreshing(false);
    }
  }, [load, total, category, sort, search, page, perPage]);

  return { repos, total, loading, refreshing, error, refresh, reload: load };
}
