import { useEffect, useState } from "react";

type Mapper<T> = (item: T) => { label: string; value: string };

interface SourceConfig<T> {
  key: string; // tên dùng để lấy dữ liệu (vd: "countries")
  fetcher: () => Promise<T[]>; // API call
  mapper: Mapper<T>; // map data -> {label, value}
}

export function useMultiSelect(configs: SourceConfig<any>[]) {
  const [options, setOptions] = useState<Record<string, { label: string; value: string }[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        const results = await Promise.all(
          configs.map(cfg => cfg.fetcher())
        );
        const mapped: Record<string, any[]> = {};
        results.forEach((res, i) => {
          const { key, mapper } = configs[i];
          mapped[key] = res.map(mapper);
        });
        setOptions(mapped);
      } catch (err) {
        setError(err as Error);
        setOptions({});
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return { options, loading, error };
}
