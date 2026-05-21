import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { fetchAllPoems, savePoem, searchPoems as searchPoemsLib, type Poem, type SearchResult } from './poems';

interface PoemsContextValue {
  poems: Poem[];
  loading: boolean;
  updatePoem: (updated: Poem) => Promise<void>;
  search: (query: string) => SearchResult[];
}

const PoemsContext = createContext<PoemsContextValue>({
  poems: [],
  loading: true,
  updatePoem: async () => {},
  search: () => [],
});

export function PoemsProvider({ children }: { children: ReactNode }) {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllPoems().then(data => {
      setPoems(data);
      setLoading(false);
    });
  }, []);

  const updatePoem = useCallback(async (updated: Poem) => {
    setPoems(prev => prev.map(p => p.id === updated.id ? updated : p));
    await savePoem(updated);
  }, []);

  const search = useCallback((query: string) => searchPoemsLib(query, poems), [poems]);

  return (
    <PoemsContext.Provider value={{ poems, loading, updatePoem, search }}>
      {children}
    </PoemsContext.Provider>
  );
}

export function usePoems() {
  return useContext(PoemsContext);
}
