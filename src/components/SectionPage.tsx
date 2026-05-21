import { useState, useRef, useEffect, useCallback } from 'react';
import Clocks from './Clocks';
import { RegistrationModal, CallModal, MessageModal } from './Modals';
import { type Poem } from '../lib/poems';
import { usePoems } from '../lib/poemsContext';
import GlobalSearch from './GlobalSearch';
import AdminEditor, { PinModal } from './AdminEditor';

const CARD_BACKGROUNDS = [
  'https://nael.top/1/1.webp', 'https://nael.top/1/2.webp', 'https://nael.top/1/3.webp',
  'https://nael.top/1/4.webp', 'https://nael.top/1/5.webp', 'https://nael.top/1/6.webp',
  'https://nael.top/1/7.webp', 'https://nael.top/1/8.webp', 'https://nael.top/1/9.webp',
  'https://nael.top/1/10.webp', 'https://nael.top/1/11.webp', 'https://nael.top/1/12.webp',
  'https://nael.top/1/13.webp', 'https://nael.top/1/14.webp',
];


// ── Full-screen poem overlay ──
interface PoemOverlayProps {
  poem: Poem;
  fontSize: number;
  onClose: () => void;
  onGoWatch: () => void;
  onGoRead: () => void;
  onWatchPoem?: (poem: Poem) => void;
}

function PoemOverlay({ poem, fontSize, onClose, onGoWatch, onGoRead, onWatchPoem }: PoemOverlayProps) {
  const [fs, setFs] = useState(fontSize);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setIsAutoScrolling(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const id = setInterval(() => {
      if (isAutoScrolling && !touchRef.current) el.scrollTop += 0.5;
    }, 30);
    scrollIntervalRef.current = id;
    return () => clearInterval(id);
  }, [isAutoScrolling]);

  const handleTouchStart = () => { touchRef.current = true; setIsAutoScrolling(false); };
  const handleTouchEnd = () => { touchRef.current = false; setTimeout(() => setIsAutoScrolling(true), 1500); };
  const handleWheel = () => { setIsAutoScrolling(false); setTimeout(() => setIsAutoScrolling(true), 2000); };

  return (
    <div className="fixed inset-0 flex flex-col" style={{ zIndex: 99999, backgroundImage: "url('https://nael.top/1/F.webp')", backgroundSize: 'cover', backgroundPosition: 'center', isolation: 'isolate' }}>
      <div className="flex-shrink-0 flex items-center justify-between px-6 pt-4 pb-2"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}>
        <div className="flex gap-2">
          <button onClick={onClose} className="poem-overlay-btn">
            <img src="https://nael.top/1/C.png" alt="" className="btn-img" />
            <span>العودة للقسم</span>
          </button>
          <button onClick={onGoWatch} className="poem-overlay-btn">
            <img src="https://nael.top/1/C.png" alt="" className="btn-img" />
            <span>انتقل لشاهد</span>
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={onGoRead} className="poem-overlay-btn">
            <img src="https://nael.top/1/C.png" alt="" className="btn-img" />
            <span>انتقل للديوان</span>
          </button>
          <button onClick={() => onWatchPoem?.(poem)} className="poem-overlay-btn">
            <img src="https://nael.top/1/C.png" alt="" className="btn-img" />
            <span>شاهد القصيدة</span>
          </button>
        </div>
      </div>
      <div className="flex-shrink-0 text-center py-2">
        <h2 className="text-xl font-bold diwan-font" style={{ color: '#D4A843' }}>{poem.name}</h2>
      </div>
      <div ref={contentRef} className="flex-1 overflow-y-auto px-6 poem-fade-edges"
        onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
        onMouseDown={() => { touchRef.current = true; setIsAutoScrolling(false); }}
        onMouseUp={() => { touchRef.current = false; setTimeout(() => setIsAutoScrolling(true), 1500); }}
        onWheel={handleWheel} style={{ scrollbarWidth: 'none' }}>
        <div className="text-center py-4" style={{ fontSize: `${fs}px`, lineHeight: 2.2, color: '#6b0000', fontFamily: "'Scheherazade New','Amiri',serif", textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
          {poem.lines.concat([...poem.lines, ...poem.lines]).map((line, i) => (
            <div key={i} className="py-1">{line}</div>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 px-6 pb-4" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}>
        <input type="range" min={10} max={150} value={fs}
          onChange={(e) => setFs(Number(e.target.value))}
          className="gold-slider w-full mb-2" />
        <p className="text-center text-sm font-bold" style={{ color: '#D4A843' }}>الشاعر نائل المظفر</p>
      </div>
    </div>
  );
}

// ── Poem Card ──
interface PoemCardProps {
  poem: Poem;
  bg: string;
  fontSize: number;
  onOpenPoem: (poem: Poem) => void;
  onWatchPoem: (poem: Poem) => void;
  isAdmin: boolean;
  onEdit: (poem: Poem, tab: 'poem' | 'verses' | 'video') => void;
}

function PoemCard({ poem, bg, fontSize, onOpenPoem, onWatchPoem, isAdmin, onEdit }: PoemCardProps) {
  const [localFs, setLocalFs] = useState(fontSize);
  useEffect(() => { setLocalFs(fontSize); }, [fontSize]);

  const mid = Math.ceil(poem.lines.length / 2);
  const col1 = poem.lines.slice(0, mid);
  const col2 = poem.lines.slice(mid);

  return (
    <div className="poem-card-frame relative flex flex-col"
      style={{ backgroundImage: `url('${bg}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {isAdmin && (
        <div className="absolute top-1 left-1 z-10 flex gap-0.5">
          <button onClick={() => onEdit(poem, 'poem')} className="text-[8px] px-1 py-0.5 rounded font-bold"
            style={{ background: 'rgba(212,168,67,0.9)', color: '#1a1a1a' }}>✏</button>
          <button onClick={() => onEdit(poem, 'verses')} className="text-[8px] px-1 py-0.5 rounded font-bold"
            style={{ background: 'rgba(80,150,255,0.9)', color: '#fff' }}>☰</button>
          <button onClick={() => onEdit(poem, 'video')} className="text-[8px] px-1 py-0.5 rounded font-bold"
            style={{ background: 'rgba(200,60,60,0.9)', color: '#fff' }}>▶</button>
        </div>
      )}
      <div className="text-center py-1 px-1" style={{ color: '#D4A843', fontWeight: 700, fontSize: 'clamp(9px,2vw,13px)', fontFamily: "'Scheherazade New','Amiri',serif", textShadow: '0 0 4px #000, 1px 1px 3px #000' }}>
        {poem.name}
      </div>
      <div className="flex-1 relative overflow-hidden">
        <div className="card-content-scroll absolute inset-0" style={{ overflowY: 'auto', overflowX: 'hidden', direction: 'ltr' }}>
          <div style={{ direction: 'rtl', display: 'flex', gap: 4, padding: '0 4px' }}>
            <div className="flex-1 text-right" style={{ fontSize: `${localFs}px`, lineHeight: 1.7, color: '#f5f0e8', fontFamily: "'Scheherazade New','Amiri',serif", textShadow: '0 0 3px #000, 1px 1px 2px #000, -1px -1px 2px #000' }}>
              {col1.map((l, i) => <div key={i}>{l}</div>)}
            </div>
            <div className="flex-1 text-right" style={{ fontSize: `${localFs}px`, lineHeight: 1.7, color: '#f5f0e8', fontFamily: "'Scheherazade New','Amiri',serif", textShadow: '0 0 3px #000, 1px 1px 2px #000, -1px -1px 2px #000' }}>
              {col2.map((l, i) => <div key={i}>{l}</div>)}
            </div>
          </div>
        </div>
      </div>
      <div className="px-1 pb-1 pt-0.5">
        <input type="range" min={4} max={200} value={localFs}
          onChange={(e) => setLocalFs(Number(e.target.value))}
          className="card-slider w-full mb-1" style={{ height: '8px' }} />
        <div className="flex justify-between gap-1">
          <button onClick={() => onWatchPoem(poem)} className="poem-card-btn"
            style={{ backgroundImage: "url('https://nael.top/1/C2.png')" }}>شاهد القصيدة</button>
          <button onClick={() => onOpenPoem(poem)} className="poem-card-btn"
            style={{ backgroundImage: "url('https://nael.top/1/C2.png')" }}>اقرأ المزيد</button>
        </div>
      </div>
    </div>
  );
}

// ── Index dropdown ──
interface IndexDropdownProps {
  poems: Poem[];
  sectionName: string;
}

function IndexDropdown({ poems, sectionName }: IndexDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const sPoems = poems.filter(p => p.section === sectionName);

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button onClick={() => setOpen(!open)} className="nav-icon-btn w-full">
        <img src="https://nael.top/1/C.png" alt="" className="absolute inset-0 w-full h-full object-fill" />
        <span>الفهرست</span>
      </button>
      {open && (
        <div className="absolute top-full right-0 z-50 mt-0.5 rounded-lg overflow-hidden"
          style={{ width: 220, maxHeight: 320, overflowY: 'auto', background: 'rgba(20,15,5,0.97)', border: '1px solid rgba(212,168,67,0.4)' }}>
          <div className="px-3 py-1 text-xs font-bold sticky top-0"
            style={{ background: 'rgba(212,168,67,0.2)', color: '#D4A843' }}>{sectionName}</div>
          <div className="grid grid-cols-4 gap-0.5 p-1">
            {sPoems.map((p) => (
              <button key={p.id} className="text-[10px] text-gray-300 hover:text-white hover:bg-gray-700/50 rounded px-1 py-0.5 text-right truncate transition-colors">
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main SectionPage ──
interface Props {
  sectionName: string;
  onBackToDiwan: () => void;
  onGoWatch: () => void;
  onWatchPoem?: (poem: Poem) => void;
  onAction: (action: string) => void;
  openPoemId?: number | null;
  onGlobalNavigate?: (nav: { poem: Poem; target: 'read' | 'watch' }) => void;
}

export default function SectionPage({ sectionName, onBackToDiwan, onGoWatch, onWatchPoem, onAction: _onAction, openPoemId, onGlobalNavigate }: Props) {
  const { poems, updatePoem } = usePoems();
  const [fontSize, setFontSize] = useState(13);
  const [openPoem, setOpenPoem] = useState<Poem | null>(null);
  const [editPoem, setEditPoem] = useState<{ poem: Poem; tab: 'poem' | 'verses' | 'video' } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [modal, setModal] = useState<string | null>(null);

  const sectionPoems = poems.filter(p => p.section === sectionName).slice(0, 20);

  useEffect(() => {
    if (openPoemId != null) {
      const poem = poems.find(p => p.id === openPoemId) ?? null;
      setOpenPoem(poem);
    }
  }, [openPoemId, poems]);

  const handleAdminTrigger = () => {
    if (isAdmin) { setIsAdmin(false); } else { setShowPinModal(true); }
  };

  const handleSaveEdit = useCallback((updated: Poem) => {
    updatePoem(updated);
  }, [updatePoem]);

  return (
    <div
      className="min-h-screen min-h-dvh relative flex flex-col"
      style={{
        backgroundImage: "url('https://nael.top/1/43.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll',
        direction: 'rtl',
      }}
    >
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* ── HEADER ── */}
      <div className="relative z-30 flex-shrink-0"
        style={{
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}>

        <h1
          className="site-title text-center font-bold text-white cursor-pointer"
          style={{
            fontSize: 'clamp(11px,3vw,20px)',
            padding: '2px 0 0',
            margin: 0,
            lineHeight: 1.1,
            textShadow: '-2px -2px 0 #000,2px -2px 0 #000,-2px 2px 0 #000,2px 2px 0 #000',
          }}
          onClick={handleAdminTrigger}
        >
          موقع الشاعر نائل المظفر الرسمي
        </h1>

        <p className="text-center font-bold"
          style={{ fontSize: 'clamp(9px,2vw,13px)', color: '#fff', textShadow: '0 0 8px #D4A843,0 0 16px #D4A843', animation: 'shimmer 3s ease-in-out infinite', margin: '0' }}>
          القصائد {sectionName}
        </p>

        <div className="flex justify-center" style={{ margin: '0' }}>
          <Clocks />
        </div>

        {/* ── NAV BAR: Row 3 only ── */}
        <div className="flex flex-col" style={{ gap: 0, margin: 0 }}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
            {/* 1 - Back to diwan */}
            <button onClick={onBackToDiwan} className="nav-icon-btn">
              <img src="https://nael.top/1/C.png" alt="" className="w-full h-full object-contain" />
              <span>العودة للديوان</span>
            </button>
            {/* 2 - Search */}
            <div className="nav-icon-cell relative">
              <img src="https://nael.top/1/C.png" alt="" className="absolute inset-0 w-full h-full object-fill pointer-events-none" />
              <div className="relative z-10 w-full h-full flex items-center justify-center px-1">
                <GlobalSearch
                  onNavigate={nav => {
                    if (nav.target === 'read') {
                      if (nav.poem.section === sectionName) {
                        setOpenPoem(nav.poem);
                      } else {
                        onGlobalNavigate?.(nav);
                      }
                    } else {
                      onGlobalNavigate?.(nav);
                    }
                  }}
                  defaultTarget="read"
                />
              </div>
            </div>
            {/* 3 - Font size */}
            <div className="nav-icon-cell relative">
              <img src="https://nael.top/1/C.png" alt="" className="absolute inset-0 w-full h-full object-fill pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center w-full px-2">
                <span style={{ fontSize: 'clamp(11px,3vw,16px)', color: '#8B1A1A', fontWeight: 700 }}>حجم النص</span>
                <input type="range" min={4} max={200} value={fontSize}
                  onChange={e => setFontSize(Number(e.target.value))}
                  className="gold-slider w-full mt-0.5" style={{ height: 6 }} />
              </div>
            </div>
            {/* 4 - Index */}
            <div className="nav-icon-cell">
              <IndexDropdown poems={poems} sectionName={sectionName} />
            </div>
            {/* 5 - Go to watch */}
            <button onClick={onGoWatch} className="nav-icon-btn">
              <img src="https://nael.top/1/C.png" alt="" className="w-full h-full object-contain" />
              <span>انتقل لشاهد</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── POEM CARDS GRID ── */}
      <div className="relative z-10 flex-1"
        style={{
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
          paddingTop: '1%',
          paddingBottom: '1%',
        }}>
        <div className="poem-cards-grid">
          {sectionPoems.map((poem, idx) => (
            <PoemCard
              key={poem.id}
              poem={poem}
              bg={CARD_BACKGROUNDS[idx % CARD_BACKGROUNDS.length]}
              fontSize={fontSize}
              onOpenPoem={setOpenPoem}
              onWatchPoem={onWatchPoem ?? (() => onGoWatch())}
              isAdmin={isAdmin}
              onEdit={(p, tab) => setEditPoem({ poem: p, tab })}
            />
          ))}
        </div>
      </div>

      {openPoem && (
        <PoemOverlay
          poem={openPoem}
          fontSize={fontSize}
          onClose={() => setOpenPoem(null)}
          onGoWatch={onGoWatch}
          onGoRead={onBackToDiwan}
          onWatchPoem={onWatchPoem}
        />
      )}

      {editPoem && (
        <AdminEditor
          poem={editPoem.poem}
          initialTab={editPoem.tab}
          onSave={handleSaveEdit}
          onClose={() => setEditPoem(null)}
        />
      )}

      {showPinModal && (
        <PinModal
          onSuccess={() => setIsAdmin(true)}
          onClose={() => setShowPinModal(false)}
        />
      )}

      <RegistrationModal isOpen={modal === 'register'} onClose={() => setModal(null)} />
      <CallModal isOpen={modal === 'call'} onClose={() => setModal(null)} />
      <MessageModal isOpen={modal === 'message'} onClose={() => setModal(null)} />
    </div>
  );
}
