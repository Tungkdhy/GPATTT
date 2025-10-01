import { useState, useCallback } from 'react';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useApi<T = any>(apiFunction: (...args: any[]) => Promise<T>, options?: UseApiOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction(...args);
        setData(result);
        
        if (options?.onSuccess) {
          options.onSuccess(result);
        }
        
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An error occurred');
        setError(error);
        
        if (options?.onError) {
          options.onError(error);
        }
        
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
}

// Hook đặc biệt cho việc fetch data khi component mount
export function useFetch<T = any>(apiFunction: () => Promise<T>, options?: UseApiOptions & { autoFetch?: boolean }) {
  const { autoFetch = true, ...restOptions } = options || {};
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
      
      if (restOptions?.onSuccess) {
        restOptions.onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      
      if (restOptions?.onError) {
        restOptions.onError(error);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, restOptions]);

  const refetch = useCallback(() => {
    return fetch();
  }, [fetch]);

  // Auto fetch on mount if enabled
  useState(() => {
    if (autoFetch) {
      fetch();
    }
  });

  return {
    data,
    loading,
    error,
    refetch
  };
}
