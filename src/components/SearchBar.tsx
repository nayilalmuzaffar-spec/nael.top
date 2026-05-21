import { useState, useRef, useEffect } from 'react';
import { searchPoems, type Poem } from '../lib/poems';

interface Props {
  onNavigate?: (poem: Poem) => void;
}

export default function SearchBar({ onNavigate }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ poem: Poem; matchLine: string; matchIndex: number }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      setResults(searchPoems(value));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="search-highlight">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={ref} className="relative w-[120px] h-[48px]">
      <div className="relative w-full h-full">
        <img
          src="https://nael.top/1/C.png"
          alt="بحث"
          className="w-full h-full object-contain opacity-80"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="ابحث عن قصيدة"
          className="search-input absolute inset-0 w-full h-full bg-transparent text-white text-center text-xs focus:outline-none px-2"
        />
      </div>
      {isOpen && results.length > 0 && (
        <div className="search-dropdown" style={{ right: 0, left: 'auto', minWidth: '220px' }}>
          {results.map((result, i) => (
            <div
              key={i}
              className="search-item"
              onClick={() => {
                onNavigate?.(result.poem);
                setIsOpen(false);
                setQuery('');
              }}
            >
              <span className="poem-name">{highlightMatch(result.poem.name, query)}</span>
              <span className="section-name">({result.poem.section})</span>
              {result.matchLine !== result.poem.name && (
                <div className="text-xs text-gray-400 mt-1">
                  {highlightMatch(result.matchLine, query)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
