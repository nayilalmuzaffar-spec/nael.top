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

  const handleValueChange = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      // @ts-ignore
      const searchData = searchPoems(value) || [];
      setResults(searchData);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => handleValueChange(e.target.value)}
        placeholder="ابحث عن قصيدة..."
        className="w-full px-4 py-2 text-right border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto text-right">
          {results.map((res, index) => (
            <div
              key={index}
              onClick={() => {
                if (onNavigate) onNavigate(res.poem);
                setIsOpen(false);
              }}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {/* @ts-ignore */}
              <div className="font-bold">{res.poem.title}</div>
              {/* @ts-ignore */}
              <div className="text-sm text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap">{res.matchLine}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
