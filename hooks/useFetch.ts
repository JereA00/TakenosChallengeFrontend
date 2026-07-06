import { useEffect, useReducer, DependencyList } from "react";

type FetchState<T> = {
  loading: boolean;
  error: string | null;
  data: T | null;
};

type FetchAction<T> =
  | { type: "success"; data: T }
  | { type: "error"; message: string };

function fetchReducer<T>(_: FetchState<T>, action: FetchAction<T>): FetchState<T> {
  if (action.type === "success") return { loading: false, error: null, data: action.data };
  return { loading: false, error: action.message, data: null };
}

const initialState = <T>(): FetchState<T> => ({ loading: true, error: null, data: null });

export function useFetch<T>(fetcher: () => Promise<T>, deps: DependencyList) {
  const [state, dispatch] = useReducer(
    fetchReducer<T>,
    undefined,
    () => initialState<T>()
  );

  useEffect(() => {
    let cancelled = false;
    fetcher()
      .then((data) => { if (!cancelled) dispatch({ type: "success", data }); })
      .catch((e) => { if (!cancelled) dispatch({ type: "error", message: e instanceof Error ? e.message : "Error desconocido" }); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
