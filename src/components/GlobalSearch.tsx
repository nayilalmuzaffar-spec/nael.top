import { useState, useRef, useEffect, useCallback } from 'react';
import { type Poem, type SearchResult } from '../lib/poems';
import { usePoems } from '../lib/poemsContext';

interface NavigateTo {
  poem: Poem;
  target: 'read' | 'watch';
}

interface Props {
  onNavigate: (nav: NavigateTo) => void;
  defaultTarget?: 'read' | 'watch';
}

function highlight(text: string, query: string) {
  if (!query.trim()) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} style={{ background: 'rgba(212,168,67,0.5)', color: '#fff', borderRadius: 2, padding: '0 1px' }}>
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function GlobalSearch({ onNavigate, defaultTarget = 'read' }: Props) {
  const { search } = usePoems();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pairs = (() => {
    const map = new Map<number, { read?: SearchResult; watch?: SearchResult }>();
    results.forEach(r => {
      const entry = map.get(r.poem.id) ?? {};
      entry[r.target] = r;
      map.set(r.poem.id, entry);
    });
    return Array.from(map.values());
  })();

  const doSearch = useCallback((val: string) => {
    setQuery(val);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (!val.trim()) {
      setResults([]);
      setOpen(false);
      setFocused(-1);
      return;
    }
    const found = search(val);
    setResults(found);
    setOpen(found.length > 0);
    setFocused(-1);
    closeTimer.current = setTimeout(() => setOpen(false), 8000);
  }, [search]);

  useEffect(() => {
    const outside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, []);

  const select = (poem: Poem, target: 'read' | 'watch') => {
    onNavigate({ poem, target });
    setOpen(false);
    setQuery('');
    setResults([]);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocused(f => Math.min(f + 1, pairs.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setFocused(f => Math.max(f - 1, 0)); }
    else if (e.key === 'Enter' && focused >= 0) {
      e.preventDefault();
      const pair = pairs[focused];
      const entry = defaultTarget === 'watch' ? (pair.watch ?? pair.read) : (pair.read ?? pair.watch);
      if (entry) select(entry.poem, defaultTarget);
    }
  };

  return (
    <div ref={ref} className="relative" style={{ width: 'clamp(80px,22vw,110px)', height: 'clamp(32px,6vw,40px)' }}>
      <img src="https://nael.top/1/C.png" alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
      <input
        ref={inputRef}
        value={query}
        onChange={e => doSearch(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="ابحث في الموقع"
        className="absolute inset-0 w-full h-full bg-transparent text-center focus:outline-none search-input"
        style={{ fontSize: 'clamp(7px,1.8vw,10px)', color: '#fff', width: '80%', left: '10%' }}
      />

      {open && pairs.length > 0 && (
        <div
          className="absolute top-full right-0 z-[9999] mt-0.5 rounded-lg overflow-hidden"
          style={{
            width: 300,
            maxHeight: 360,
            overflowY: 'auto',
            background: 'rgba(10,6,2,0.98)',
            border: '1px solid rgba(212,168,67,0.45)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
            direction: 'rtl',
          }}
        >
          <div className="sticky top-0 px-3 py-1.5 text-[9px] font-bold border-b border-white/10 flex items-center justify-between"
            style={{ background: 'rgba(212,168,67,0.18)', color: '#D4A843' }}>
            <span>{pairs.length} قصيدة مطابقة</span>
            <span style={{ color: '#aaa', fontWeight: 400 }}>اقرأ · شاهد</span>
          </div>

          {pairs.map((pair, i) => {
            const entry = pair.read ?? pair.watch!;
            return (
              <div
                key={entry.poem.id}
                className="border-b border-white/5"
                style={{ background: focused === i ? 'rgba(212,168,67,0.12)' : 'transparent' }}
                onMouseEnter={() => setFocused(i)}
              >
                <div className="px-2 pt-1.5 pb-0.5 pointer-events-none">
                  <span className="text-[11px] font-bold diwan-font" style={{ color: '#D4A843' }}>
                    {highlight(entry.poem.name, query)}
                  </span>
                  <span className="text-[9px] mr-1" style={{ color: '#666' }}>
                    ({entry.poem.section})
                  </span>
                  {entry.matchLine !== entry.poem.name && (
                    <div className="text-[9px] diwan-font mt-0.5 truncate" style={{ color: '#999' }}>
                      {highlight(entry.matchLine, query)}
                    </div>
                  )}
                </div>

                <div className="flex gap-1 px-2 pb-1.5">
                  {pair.read && (
                    <button
                      onClick={() => select(pair.read!.poem, 'read')}
                      className="flex-1 text-[9px] font-bold py-0.5 rounded transition-all"
                      style={{ background: 'rgba(30,60,30,0.8)', color: '#7ec87e', border: '1px solid rgba(80,160,80,0.4)' }}
                    >
                      اقرأ القصيدة
                    </button>
                  )}
                  {pair.watch && (
                    <button
                      onClick={() => select(pair.watch!.poem, 'watch')}
                      className="flex-1 text-[9px] font-bold py-0.5 rounded transition-all"
                      style={{ background: 'rgba(60,20,20,0.8)', color: '#e07a7a', border: '1px solid rgba(160,60,60,0.4)' }}
                    >
                      شاهد الفيديو
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
