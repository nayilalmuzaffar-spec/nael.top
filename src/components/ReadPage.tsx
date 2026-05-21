import { useState, useRef, useEffect, useCallback } from 'react';
import Clocks from './Clocks';
import { RegistrationModal, CallModal, MessageModal } from './Modals';
import { type Poem } from '../lib/poems';
import { usePoems } from '../lib/poemsContext';
import GlobalSearch from './GlobalSearch';
import AdminEditor, { PinModal } from './AdminEditor';

const NAV_SECTIONS = [
  'الرئيسة', 'الدينية', 'الوطنية', 'الوجدانية', 'العاطفية',
  'الثورية', 'الرثائية', 'الهجائية', 'الجناسات', 'اللوحات',
];

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

  // start auto-scroll after a short delay so it doesn't feel abrupt
  useEffect(() => {
    const t = setTimeout(() => setIsAutoScrolling(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const startScroll = () => {
      scrollIntervalRef.current = setInterval(() => {
        if (isAutoScrolling && !touchRef.current) {
          el.scrollTop += 0.5;
        }
      }, 30);
    };

    startScroll();
    return () => {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    };
  }, [isAutoScrolling]);

  const handleTouchStart = () => {
    touchRef.current = true;
    setIsAutoScrolling(false);
  };
  const handleTouchEnd = () => {
    touchRef.current = false;
    setTimeout(() => setIsAutoScrolling(true), 1500);
  };
  const handleWheel = () => {
    setIsAutoScrolling(false);
    setTimeout(() => setIsAutoScrolling(true), 2000);
  };

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{
        zIndex: 99999,
        backgroundImage: "url('https://nael.top/1/F.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        isolation: 'isolate',
      }}
    >
      {/* Top bar – fixed */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 pt-4 pb-2"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}>
        {/* Right side */}
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
        {/* Left side */}
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

      {/* Title – fixed */}
      <div className="flex-shrink-0 text-center py-2">
        <h2 className="text-xl font-bold diwan-font" style={{ color: '#D4A843' }}>{poem.name}</h2>
      </div>

      {/* Scrollable poem text */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto px-6 poem-fade-edges"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={() => { touchRef.current = true; setIsAutoScrolling(false); }}
        onMouseUp={() => { touchRef.current = false; setTimeout(() => setIsAutoScrolling(true), 1500); }}
        onWheel={handleWheel}
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="text-center py-4" style={{ fontSize: `${fs}px`, lineHeight: 2.2, color: '#6b0000', fontFamily: "'Scheherazade New', 'Amiri', serif", textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
          {poem.lines.concat([...poem.lines, ...poem.lines]).map((line, i) => (
            <div key={i} className="py-1">{line}</div>
          ))}
        </div>
      </div>

      {/* Bottom: font size + poet name – fixed */}
      <div className="flex-shrink-0 px-6 pb-4"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}>
        <input
          type="range" min={10} max={150} value={fs}
          onChange={(e) => setFs(Number(e.target.value))}
          className="gold-slider w-full mb-2"
        />
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
  onWatchPoem?: (poem: Poem) => void;
  isAdmin: boolean;
  onEdit: (poem: Poem, tab: 'poem' | 'verses' | 'video') => void;
}

function PoemCard({ poem, bg, fontSize, onOpenPoem, onWatchPoem, isAdmin, onEdit }: PoemCardProps) {
  const [localFs, setLocalFs] = useState(fontSize);
  // sync when parent fontSize changes
  useEffect(() => { setLocalFs(fontSize); }, [fontSize]);

  const mid = Math.ceil(poem.lines.length / 2);
  const col1 = poem.lines.slice(0, mid);
  const col2 = poem.lines.slice(mid);

  return (
    <div
      className="poem-card-frame relative flex flex-col"
      style={{
        backgroundImage: `url('${bg}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {isAdmin && (
        <div className="absolute top-1 left-1 z-10 flex gap-0.5">
          <button onClick={() => onEdit(poem, 'poem')}
            className="text-[8px] px-1 py-0.5 rounded font-bold"
            style={{ background: 'rgba(212,168,67,0.9)', color: '#1a1a1a' }}>✏</button>
          <button onClick={() => onEdit(poem, 'verses')}
            className="text-[8px] px-1 py-0.5 rounded font-bold"
            style={{ background: 'rgba(80,150,255,0.9)', color: '#fff' }}>☰</button>
          <button onClick={() => onEdit(poem, 'video')}
            className="text-[8px] px-1 py-0.5 rounded font-bold"
            style={{ background: 'rgba(200,60,60,0.9)', color: '#fff' }}>▶</button>
        </div>
      )}
      {/* Title */}
      <div className="text-center py-1 px-1" style={{ color: '#D4A843', fontWeight: 700, fontSize: 'clamp(9px,2vw,13px)', fontFamily: "'Scheherazade New','Amiri',serif", textShadow: '0 0 4px #000, 1px 1px 3px #000' }}>
        {poem.name}
      </div>
      {/* Poem content — scrollable with thin gold scrollbar on left edge */}
      <div className="flex-1 relative overflow-hidden">
        <div
          className="card-content-scroll absolute inset-0"
          style={{ overflowY: 'auto', overflowX: 'hidden', direction: 'ltr' }}
        >
          {/* inner wrapper restores RTL for text */}
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
      {/* Bottom controls */}
      <div className="px-1 pb-1 pt-0.5">
        <input
          type="range" min={4} max={200} value={localFs}
          onChange={(e) => setLocalFs(Number(e.target.value))}
          className="card-slider w-full mb-1"
          style={{ height: '8px' }}
        />
        <div className="flex justify-between gap-1">
          <button
            onClick={() => onWatchPoem ? onWatchPoem(poem) : undefined}
            className="poem-card-btn"
            style={{ backgroundImage: "url('https://nael.top/1/C.png')" }}
          >
            شاهد القصيدة
          </button>
          <button
            onClick={() => onOpenPoem(poem)}
            className="poem-card-btn"
            style={{ backgroundImage: "url('https://nael.top/1/C.png')" }}
          >
            اقرأ المزيد
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Index dropdown ──
interface IndexDropdownProps {
  sections: string[];
  poems: Poem[];
}

function IndexDropdown({ sections, poems }: IndexDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className="nav-icon-btn w-full"
      >
        <img src="https://nael.top/1/C.png" alt="" className="absolute inset-0 w-full h-full object-fill" />
        <span>الفهرست</span>
      </button>
      {open && (
        <div className="absolute top-full right-0 z-50 mt-0.5 rounded-lg overflow-hidden"
          style={{ width: 260, maxHeight: 360, overflowY: 'auto', background: 'rgba(20,15,5,0.97)', border: '1px solid rgba(212,168,67,0.4)' }}>
          {sections.map(sec => {
            const sPoems = poems.filter(p => p.section === sec);
            return (
              <div key={sec}>
                <div className="px-3 py-1 text-xs font-bold sticky top-0"
                  style={{ background: 'rgba(212,168,67,0.2)', color: '#D4A843' }}>{sec}</div>
                <div className="grid grid-cols-4 gap-0.5 p-1">
                  {sPoems.map((p) => (
                    <button key={p.id}
                      className="text-[10px] text-gray-300 hover:text-white hover:bg-gray-700/50 rounded px-1 py-0.5 text-right truncate transition-colors">
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main ReadPage ──
interface Props {
  onBack: () => void;
  onGoWatch: () => void;
  onAction: (action: string) => void;
  onGoSection?: (section: string) => void;
  onWatchPoem?: (poem: Poem) => void;
  onGlobalNavigate?: (nav: { poem: Poem; target: 'read' | 'watch' }) => void;
}

export default function ReadPage({ onBack, onGoWatch, onAction: _onAction, onGoSection, onWatchPoem, onGlobalNavigate }: Props) {
  const { poems, updatePoem } = usePoems();
  const [activeSection, setActiveSection] = useState(NAV_SECTIONS[0]);
  const [fontSize, setFontSize] = useState(13);
  const [openPoem, setOpenPoem] = useState<Poem | null>(null);
  const [editPoem, setEditPoem] = useState<{ poem: Poem; tab: 'poem' | 'verses' | 'video' } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [modal, setModal] = useState<string | null>(null);

  const sectionPoems = poems.filter(p => p.section === activeSection).slice(0, 20);

  const handleAdminTrigger = () => {
    if (isAdmin) { setIsAdmin(false); } else { setShowPinModal(true); }
  };

  const handleSaveEdit = useCallback((updated: Poem) => {
    updatePoem(updated);
  }, [updatePoem]);

  // Row 1: 5, Row 2: 5, Row 3: 5 (last 5 special)
  const row1 = NAV_SECTIONS.slice(0, 5);
  const row2 = NAV_SECTIONS.slice(5, 10);

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

      {/* ── SCROLLABLE HEADER ── */}
      <div className="relative z-30 flex-shrink-0"
        style={{
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}>

        {/* Site title */}
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
          المعنى في قلب الصفحة المجموعة الكاملة
        </p>

        {/* Clocks — compact */}
        <div className="flex justify-center" style={{ margin: '0' }}>
          <Clocks />
        </div>

        {/* ── NAV BAR: 3 rows ── */}
        <div className="flex flex-col" style={{ gap: 0, margin: 0 }}>
          {/* Row 1 */}
          <div className="grid" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
            {row1.map(sec => (
              <button key={sec}
                onClick={() => sec === 'الرئيسة' ? setActiveSection(sec) : onGoSection?.(sec)}
                className="nav-icon-btn"
                style={{ borderBottom: activeSection === sec ? '2px solid #D4A843' : '2px solid transparent' }}>
                <img src="https://nael.top/1/C.png" alt="" className="w-full h-full object-contain" />
                <span>{sec}</span>
              </button>
            ))}
          </div>
          {/* Row 2 */}
          <div className="grid" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
            {row2.map(sec => (
              <button key={sec}
                onClick={() => onGoSection?.(sec)}
                className="nav-icon-btn"
                style={{ borderBottom: activeSection === sec ? '2px solid #D4A843' : '2px solid transparent' }}>
                <img src="https://nael.top/1/C.png" alt="" className="w-full h-full object-contain" />
                <span>{sec}</span>
              </button>
            ))}
          </div>
          {/* Row 3: special buttons */}
          <div className="grid" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
            {/* 1 - Back to home */}
            <button onClick={onBack} className="nav-icon-btn">
              <img src="https://nael.top/1/C.png" alt="" className="w-full h-full object-contain" />
              <span>العودة للموقع</span>
            </button>
            {/* 2 - Search */}
            <div className="nav-icon-cell relative">
              <img src="https://nael.top/1/C.png" alt="" className="absolute inset-0 w-full h-full object-fill pointer-events-none" />
              <div className="relative z-10 w-full h-full flex items-center justify-center px-1">
                <GlobalSearch
                  onNavigate={nav => {
                    if (nav.target === 'read') {
                      setActiveSection(nav.poem.section);
                      setOpenPoem(nav.poem);
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
              <IndexDropdown sections={NAV_SECTIONS} poems={poems} />
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
              onWatchPoem={onWatchPoem}
              isAdmin={isAdmin}
              onEdit={(p, tab) => setEditPoem({ poem: p, tab })}
            />
          ))}
        </div>
      </div>

      {/* ── Poem full overlay ── */}
      {openPoem && (
        <PoemOverlay
          poem={openPoem}
          fontSize={fontSize}
          onClose={() => setOpenPoem(null)}
          onGoWatch={onGoWatch}
          onGoRead={() => setOpenPoem(null)}
          onWatchPoem={onWatchPoem}
        />
      )}

      {/* ── Admin editor ── */}
      {editPoem && (
        <AdminEditor
          poem={editPoem.poem}
          initialTab={editPoem.tab}
          onSave={updated => { handleSaveEdit(updated); }}
          onClose={() => setEditPoem(null)}
        />
      )}

      {/* ── PIN modal ── */}
      {showPinModal && (
        <PinModal
          onSuccess={() => setIsAdmin(true)}
          onClose={() => setShowPinModal(false)}
        />
      )}

      {/* Modals */}
      <RegistrationModal isOpen={modal === 'register'} onClose={() => setModal(null)} />
      <CallModal isOpen={modal === 'call'} onClose={() => setModal(null)} />
      <MessageModal isOpen={modal === 'message'} onClose={() => setModal(null)} />
    </div>
  );
}
