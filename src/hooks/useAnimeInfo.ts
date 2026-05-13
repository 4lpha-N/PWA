import { useState, useCallback } from 'react';
import { getAnimeInfo, type AnimeInfo, type GetAnimeInfoOptions } from '@/lib/getAnimeInfo';

interface UseAnimeInfoState {
  data: AnimeInfo | null;
  loading: boolean;
  error: string | null;
}

interface UseAnimeInfoReturn extends UseAnimeInfoState {
  fetch: (url: string) => Promise<void>;
  reset: () => void;
}

const INITIAL_STATE: UseAnimeInfoState = {
  data: null,
  loading: false,
  error: null,
};

export function useAnimeInfo(options: GetAnimeInfoOptions = {}): UseAnimeInfoReturn {
  const [state, setState] = useState<UseAnimeInfoState>(INITIAL_STATE);

  const fetch = useCallback(
    async (url: string) => {
      setState({ data: null, loading: true, error: null });
      try {
        const data = await getAnimeInfo(url, options);
        setState({ data, loading: false, error: null });
      } catch (err) {
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.proxyBase],
  );

  const reset = useCallback(() => setState(INITIAL_STATE), []);

  return { ...state, fetch, reset };
}
