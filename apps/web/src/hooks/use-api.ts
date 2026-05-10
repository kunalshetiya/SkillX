import { useAuth } from "@clerk/nextjs";
import { fetcher } from "@web/lib/api-client";
import { useCallback } from "react";

export function useApi() {
  const { getToken } = useAuth();

  const authFetcher = useCallback(async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const token = await getToken();
    return fetcher<T>(endpoint, options, token);
  }, [getToken]);

  return { fetcher: authFetcher };
}
