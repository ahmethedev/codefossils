import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchRepos, refreshRepos } from '../api';

export function useRepos({ category, sort, search, perPage = 30 } = {}) {
  const [repos, setRepos] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Reset to page 1 when filters change
  const prevFiltersRef = useRef({ category, sort, search });
  useEffect(() => {
    const prev = prevFiltersRef.current;
    if (prev.category !== category || prev.sort !== sort || prev.search !== search) {
      prevFiltersRef.current = { category, sort, search };
      setPage(1);
      setRepos([]);
    }
  }, [category, sort, search]);

  const load = useCallback(async () => {
    const isFirstPage = page === 1;
    if (isFirstPage) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const data = await fetchRepos({ category, sort, search, page, perPage });
      if (isFirstPage) {
        setRepos(data.repos);
      } else {
        setRepos(prev => [...prev, ...data.repos]);
      }
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
    setLoadingMore(false);
  }, [category, sort, search, page, perPage]);

  useEffect(() => {
    load();
  }, [load]);

  const hasMore = repos.length < total;

  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      setPage(p => p + 1);
    }
  }, [loading, loadingMore, hasMore]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshRepos();
      const prevTotal = total;
      let attempts = 0;
      const poll = async () => {
        attempts++;
        try {
          const data = await fetchRepos({ category, sort, search, page: 1, perPage });
          if (data.total !== prevTotal || attempts >= 5) {
            setPage(1);
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
  }, [total, category, sort, search, perPage]);

  return { repos, total, loading, loadingMore, refreshing, error, refresh, reload: load, hasMore, loadMore };
}
