import { useState, useCallback, useRef, useEffect } from 'react';

// ==============================================

export const useHttpClient = () => {
  // --------------------------------------------

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>();

  const activeHttpRequests = useRef<any>([]);

  // --------------------------------------------

  const sendRequest = useCallback(async (endpoint, method = 'GET', body = null, headers = {}) => {
    setIsLoading(true);

    const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

    const httpAbortCtrl = new AbortController();
    activeHttpRequests.current.push(httpAbortCtrl);

    try {
      const response = await fetch(url, {
        method,
        body,
        headers,
        signal: httpAbortCtrl.signal,
      });

      const responseData = await response.json();

      activeHttpRequests.current = activeHttpRequests.current.filter((reqCtrl: any) => reqCtrl !== httpAbortCtrl);

      if (!response.ok) {
        throw new Error(responseData.message);
      }

      setIsLoading(false);
      return responseData;
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  // --------------------------------------------

  const clearError = () => {
    setError(null);
  };

  // --------------------------------------------

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach((abortCtrl: any) => abortCtrl.abort());
    };
  }, []);

  // --------------------------------------------

  return { isLoading, error, sendRequest, clearError };

  // --------------------------------------------
};

// ==============================================
