import { useState, useEffect } from 'react';
import client from '../service/client';

// We use <T> to make the hook flexible for any data type
const useFetch = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Prevent fetching if url is empty
    if (!url) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.get<T>(url);
        setData(response.data);
        setError(null);
      } catch (err: any) {
        // Use your getErrorMessage util here if you want
        setError(err.response?.data?.message || err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
