import { useState, useEffect, useCallback } from "react";

// Key for persistent localStorage
const KEY = "lljep-game-v1";

/**
 * PUBLIC_INTERFACE
 * Custom React hook to persist Jeopardy game state in localStorage.
 * Returns: { persistedState, setPersistedState, clearPersistedState }
 */
function usePersistentGameState() {
  const [persistedState, setState] = useState(() => {
    try {
      const s = window.localStorage.getItem(KEY);
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  // Save to storage every update
  useEffect(() => {
    if (persistedState) {
      localStorage.setItem(KEY, JSON.stringify(persistedState));
    }
  }, [persistedState]);

  // For updating object/functional updates
  const setPersistedState = useCallback(
    (update) => {
      setState((prev) =>
        typeof update === "function" ? update(prev) : update
      );
    },
    [setState]
  );

  const clearPersistedState = useCallback(() => {
    setState(null);
    localStorage.removeItem(KEY);
  }, []);

  return { persistedState, setPersistedState, clearPersistedState };
}

export default usePersistentGameState;
