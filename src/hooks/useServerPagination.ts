import { useState, useEffect } from 'react';

const DEFAULT_PAGE_SIZE = 10;

interface PaginationResult<T> {
  rows: T[];
  count: number;
  roles?:T[];
  parameters?:T[];
  data?:T[];
}

interface UseServerPaginationOptions {
  pageSize?: number;
  initialPage?: number;
}

export function useServerPagination<T>(
  fetchFunction: (page: number, limit: number,param:{}) => Promise<PaginationResult<T>>,
  dependencies: any[] = [],
  options: UseServerPaginationOptions = {},
  param ={}
) {
  const { pageSize = DEFAULT_PAGE_SIZE, initialPage = 1 } = options;
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
          
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        setLoading(true);
        setError(null);
        const result = await fetchFunction(currentPage, pageSize,param);
        setData(result.rows ?? result?.roles ?? result?.parameters ?? result?.data);
        setTotal(result.count);
      } catch (err) {
        setError(err as Error);
        setData([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, pageSize, ...dependencies]);

  // Reset to page 1 when dependencies change
  useEffect(() => {
    setCurrentPage(1);
  }, dependencies);

  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  return {
    data,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    total,
    loading,
    error,
    setCurrentPage,
    pageSize
  };
}
