import { useState } from "react";

export function useCreateData<TInput, TOutput>(
  createFn: (data: TInput) => Promise<TOutput>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<TOutput | null>(null);

  const create = async (data: TInput) => {
    try {
      setLoading(true);
      setError(null);
      const res = await createFn(data);
      setResult(res);
      return res;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error, result };
}