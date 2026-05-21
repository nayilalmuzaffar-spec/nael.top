import { useState, useRef, useEffect } from 'react';
import Clocks from './Clocks';
import { RegistrationModal, CallModal, MessageModal } from './Modals';
import { type Poem } from '../lib/poems';
import { usePoems } from '../lib/poemsContext';
import GlobalSearch from './GlobalSearch';
import AdminEditor, { PinModal } from './AdminEditor';

const ARTWORK_PANELS = [
  'https://nael.top/1/21.webp', 'https://nael.top/1/22.webp', 'https://nael.top/1/23.webp',
  'https://nael.top/1/24.webp', 'https://nael.top/1/25.webp', 'https://nael.top/1/26.webp',
  'https://nael.top/1/27.webp', 'https://nael.top/1/28.webp', 'https://nael.top/1/29.webp',
  'https://nael.top/1/30.webp', 'https://nael.top/1/31.webp', 'https://nael.top/1/32.webp',
  'https://nael.top/1/33.webp', 'https://nael.top/1/34.webp', 'https://nael.top/1/35.webp',
  'https://nael.top/1/36.webp', 'https://nael.top/1/37.webp', 'https://nael.top/1/38.webp',
  'https://nael.top/1/39.webp', 'https://nael.top/1/40.webp',
];

const SAMPLE_VIDEOS = [
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  'https://www.youtube.com/embed/3JZ_D3ELwOQ',
  'https://www.youtube.com/embed/L_jWHffIx5E',
  'https://www.youtube.com/embed/fJ9rUzIMcZQ',
  'https://www.youtube.com/embed/hTWKbfoikeg',
  'https://www.youtube.com/embed/YR5ApYxkU-U',
  'https://www.youtube.com/embed/kJQP7kiw5Fk',
  'https://www.youtube.com/embed/ru0K8uYEZWw',
  'https://www.youtube.com/embed/OPf0YbXqDm0',
  'https://www.youtube.com/embed/PT2_F-1esPk',
  'https://www.youtube.com/embed/7wtfhZwyrcc',
  'https://www.youtube.com/embed/2vjPBrBU-TM',
  'https://www.youtube.com/embed/09R8_2nJtjg',
  'https://www.youtube.com/embed/nfWlot6h_JM',
];


const BTN_ICON = 'https://nael.top/1/C.png';
const MINI_W = 320;
const MINI_H = 240;

// ── Share modal ──
function ShareModal({ poemName, onClose }: { poemName: string; onClose: () => void }) {
  const url = encodeURIComponent(`https://nael.top/poem/${poemName}`);
  const text = encodeURIComponent(`قصيدة: ${poemName} - للشاعر نائل المظفر`);
  const platforms = [
    { name: 'واتساب', url: `https://wa.me/?text=${text}%20${url}`, color: '#25D366' },
    { name: 'تيليغرام', url: `https://t.me/share/url?url=${url}&text=${text}`, color: '#0088cc' },
    { name: 'فيسبوك', url: `https://www.facebook.com/sharer/sharer.php?u=${url}`, color: '#1877F2' },
    { name: 'تويتر', url: `https://twitter.com/intent/tweet?text=${text}&url=${url}`, color: '#1DA1F2' },
    { name: 'نسخ الرابط', url: '#copy', color: '#D4A843' },
  ];
  const handleShare = (p: typeof platforms[0]) => {
    if (p.url === '#copy') navigator.clipboard.writeText(`https://nael.top/poem/${poemName}`).catch(() => {});
    else window.open(p.url, '_blank');
    onClose();
  };
  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#1a1a2e] border border-[#D4A843]/30 rounded-xl p-5 w-72" onClick={e => e.stopPropagation()}>
        <h3 className="text-sm font-bold mb-3 text-center" style={{ color: '#D4A843' }}>شارك القصيدة</h3>
        <p className="text-xs text-center mb-3" style={{ color: '#aaa' }}>{poemName}</p>
        <div className="flex flex-col gap-2">
          {platforms.map(p => (
            <button key={p.name} onClick={() => handleShare(p)}
              className="w-full py-2 rounded text-sm font-bold transition-opacity hover:opacity-80"
              style={{ background: p.color, color: '#fff' }}>{p.name}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Thank modal ──
function ThankModal({ poemName, onClose }: { poemName: string; onClose: () => void }) {
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState(false);
  const handleSend = () => { if (!comment.trim()) return; setSent(true); setTimeout(onClose, 1500); };
  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#1a1a2e] border border-[#D4A843]/30 rounded-xl p-5 w-80" onClick={e => e.stopPropagation()}>
        <h3 className="text-sm font-bold mb-1 text-center" style={{ color: '#D4A843' }}>إعجاب ورد</h3>
        <p className="text-xs text-center mb-3" style={{ color: '#aaa' }}>{poemName}</p>
        {sent ? <p className="text-center text-sm" style={{ color: '#2ecc71' }}>شكراً على تعليقك</p> : (
          <>
            <textarea value={comment} onChange={e => setComment(e.target.value)}
              placeholder="اكتب تعليقك هنا..."
              className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-white text-sm mb-3 focus:outline-none min-h-[80px] resize-none"
              style={{ borderColor: 'rgba(212,168,67,0.4)' }} />
            <button onClick={handleSend} className="w-full py-2 rounded font-bold text-sm"
              style={{ background: 'linear-gradient(135deg,#D4A843,#A07C2E)', color: '#1a1a1a' }}>إرسال</button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Small icon button ──
function DBtn({ label, onClick, active }: { label: string; onClick?: () => void; active?: boolean }) {
  return (
    <button onClick={onClick} className="watch-d-btn" style={{ outline: active ? '1px solid #D4A843' : 'none' }}>
      <img src={BTN_ICON} alt="" className="absolute inset-0 w-full h-full object-fill" />
      <span>{label}</span>
    </button>
  );
}

// ── Video Card ──
interface VideoCardProps {
  poem: Poem;
  videoUrl: string;
  artworkUrl: string;
  onReadPoem: (poem: Poem) => void;
  onGoRead: () => void;
  registerModal: () => void;
  isActive: boolean;
  onActivate: () => void;
  autoOpen?: boolean;
  fontSize?: number;
  isAdmin?: boolean;
  onEdit?: (poem: Poem, tab: 'poem' | 'verses' | 'video') => void;
}

function VideoCard({ poem, videoUrl, artworkUrl, onReadPoem, onGoRead, registerModal, isActive, onActivate, autoOpen, fontSize = 13, isAdmin, onEdit }: VideoCardProps) {
  const [playerVisible, setPlayerVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [_volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(240);
  const [views] = useState(Math.floor(Math.random() * 50000) + 1000);
  const [speed, setSpeed] = useState(1);
  const [isMini, setIsMini] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showThank, setShowThank] = useState(false);
  const [miniPos, setMiniPos] = useState({ x: 20, y: 80 });
  const miniDragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-open and play when navigated from read section
  useEffect(() => {
    if (autoOpen) {
      onActivate();
      setPlayerVisible(true);
      setIsPlaying(true);
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        cardRef.current?.requestFullscreen?.().catch(() => {});
        setIsFullscreen(true);
      }, 400);
    }
  }, [autoOpen]);

  // Stop when another card becomes active
  useEffect(() => {
    if (!isActive && isPlaying) {
      setIsPlaying(false);
      setPlayerVisible(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (isPlaying) {
      progressTimerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + speed * 0.5;
          if (next >= duration) { setIsPlaying(false); return 0; }
          setProgress((next / duration) * 100);
          return next;
        });
      }, 500);
    } else {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }
    return () => { if (progressTimerRef.current) clearInterval(progressTimerRef.current); };
  }, [isPlaying, speed, duration]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  const formatViews = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const newTime = pct * duration;
    setCurrentTime(newTime);
    setProgress(pct * 100);
  };

  const handleSkip = (delta: number) => {
    setCurrentTime(prev => {
      const next = Math.max(0, Math.min(duration, prev + delta));
      setProgress((next / duration) * 100);
      return next;
    });
  };

  const handleMiniMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    miniDragRef.current = { startX: e.clientX, startY: e.clientY, origX: miniPos.x, origY: miniPos.y };
    const onMove = (ev: MouseEvent) => {
      if (!miniDragRef.current) return;
      setMiniPos({ x: miniDragRef.current.origX + ev.clientX - miniDragRef.current.startX, y: miniDragRef.current.origY + ev.clientY - miniDragRef.current.startY });
    };
    const onUp = () => { miniDragRef.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const handleFullscreen = () => {
    if (!isFullscreen) { cardRef.current?.requestFullscreen?.().catch(() => {}); setIsFullscreen(true); }
    else { document.exitFullscreen?.().catch(() => {}); setIsFullscreen(false); }
  };

  useEffect(() => {
    const handler = () => { if (!document.fullscreenElement) setIsFullscreen(false); };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const iframeSrc = `${videoUrl}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=1&modestbranding=1&rel=0&enablejsapi=1`;

  const activateAndPlay = () => { onActivate(); setPlayerVisible(true); setIsPlaying(true); };

  const renderControls = (mini: boolean) => (
    <div className="flex flex-col" style={{ background: 'rgba(5,5,10,0.95)', padding: '3px 3px 2px', gap: 1, flexShrink: 0, marginTop: 'auto' }}>
      <div className="flex" style={{ gap: 1 }}>
        <button onClick={onGoRead} className="watch-d-btn-lg flex-1">
          <img src={BTN_ICON} alt="" className="absolute inset-0 w-full h-full object-fill" />
          <span>انتقل للديوان</span>
        </button>
        {mini ? (
          <button onClick={() => setIsMini(false)} className="watch-d-btn-lg flex-1">
            <img src={BTN_ICON} alt="" className="absolute inset-0 w-full h-full object-fill" />
            <span>في الإطار</span>
          </button>
        ) : (
          <button onClick={() => onReadPoem(poem)} className="watch-d-btn-lg flex-1">
            <img src={BTN_ICON} alt="" className="absolute inset-0 w-full h-full object-fill" />
            <span>اقرأ القصيدة</span>
          </button>
        )}
      </div>
      <div className="flex items-center" style={{ gap: 3 }}>
        <span className="font-bold flex-shrink-0" style={{ color: '#D4A843', fontSize: mini ? 9 : 'clamp(7px,1.4vw,10px)', minWidth: 24, textAlign: 'center' }}>{formatTime(currentTime)}</span>
        <div className="flex-1 rounded-full cursor-pointer" style={{ height: 5, background: 'rgba(139,26,26,0.35)', position: 'relative' }} onClick={handleProgressClick}>
          <div className="absolute top-0 right-0 h-full rounded-full" style={{ width: `${progress}%`, background: '#8B1A1A', transition: 'width 0.5s linear' }} />
          <div className="absolute top-1/2 w-2 h-2 rounded-full" style={{ right: `${progress}%`, background: '#D4A843', transform: 'translate(50%,-50%)' }} />
        </div>
        <span className="flex-shrink-0" style={{ color: '#aaa', fontSize: mini ? 9 : 'clamp(7px,1.4vw,10px)', minWidth: 24, textAlign: 'center' }}>{formatViews(views)}</span>
      </div>
      <div className="grid grid-cols-5" style={{ gap: 1 }}>
        <DBtn label={isPlaying ? 'إيقاف' : 'تشغيل'} onClick={() => setIsPlaying(!isPlaying)} active={isPlaying} />
        <DBtn label="خفض" onClick={() => setVolume(v => Math.max(0, v - 10))} />
        <DBtn label="رفع" onClick={() => setVolume(v => Math.min(100, v + 10))} />
        <DBtn label={isMuted ? 'صوت' : 'كتم'} onClick={() => setIsMuted(!isMuted)} active={isMuted} />
        <DBtn label="إعجاب" onClick={() => setShowThank(true)} />
      </div>
      <div className="grid grid-cols-5" style={{ gap: 1 }}>
        <DBtn label="تقديم" onClick={() => handleSkip(10)} />
        <DBtn label="تأخير" onClick={() => handleSkip(-10)} />
        <DBtn label="تسريع" onClick={() => setSpeed(s => Math.min(2, s + 0.25))} active={speed > 1} />
        <DBtn label="إبطاء" onClick={() => setSpeed(s => Math.max(0.25, s - 0.25))} active={speed < 1} />
        <DBtn label="إيقاف" onClick={() => { setIsPlaying(false); setCurrentTime(0); setProgress(0); }} />
      </div>
      <div className="grid grid-cols-5" style={{ gap: 1 }}>
        <DBtn label="اشترك" onClick={registerModal} />
        <DBtn label="شارك" onClick={() => setShowShare(true)} />
        <DBtn label="مصغرة" onClick={() => setIsMini(true)} active={mini} />
        <DBtn label="في الإطار" onClick={() => setIsMini(false)} active={!mini} />
        <DBtn label="كاملة" onClick={handleFullscreen} active={isFullscreen} />
      </div>
    </div>
  );

  return (
    <>
      {isMini && (
        <div className="fixed z-[9000] flex flex-col"
          style={{ left: miniPos.x, top: miniPos.y, width: MINI_W, height: MINI_H, boxShadow: '0 0 16px #22c55e, 0 0 40px rgba(34,197,94,0.4)', border: '2px solid #22c55e', borderRadius: 8, overflow: 'hidden', background: '#000' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 18, cursor: 'move', zIndex: 10, background: 'rgba(0,0,0,0.5)' }} onMouseDown={handleMiniMouseDown}>
            <p className="text-center truncate diwan-font" style={{ color: '#D4A843', fontSize: 9, lineHeight: '18px' }}>{poem.name}</p>
          </div>
          <div className="relative" style={{ flex: '1 1 0', marginTop: 18 }}>
            <iframe src={iframeSrc} className="absolute inset-0 w-full h-full" style={{ border: 'none', pointerEvents: 'none' }} allow="autoplay; encrypted-media; fullscreen" allowFullScreen title={poem.name} />
          </div>
          {renderControls(true)}
        </div>
      )}

      <div ref={cardRef} className="poem-card-frame watch-card-frame relative"
        style={isMini ? { background: 'rgba(0,0,0,0.3)', border: '2px dashed #22c55e' } : {}}
        onMouseEnter={() => !isMini && setPlayerVisible(true)}
        onMouseLeave={() => !isMini && !isPlaying && setPlayerVisible(false)}>
        {isAdmin && onEdit && (
          <div className="absolute top-1 left-1 z-20 flex gap-0.5">
            <button onClick={() => onEdit(poem, 'poem')} className="text-[8px] px-1 py-0.5 rounded font-bold"
              style={{ background: 'rgba(212,168,67,0.9)', color: '#1a1a1a' }}>✏</button>
            <button onClick={() => onEdit(poem, 'verses')} className="text-[8px] px-1 py-0.5 rounded font-bold"
              style={{ background: 'rgba(80,150,255,0.9)', color: '#fff' }}>☰</button>
            <button onClick={() => onEdit(poem, 'video')} className="text-[8px] px-1 py-0.5 rounded font-bold"
              style={{ background: 'rgba(200,60,60,0.9)', color: '#fff' }}>▶</button>
          </div>
        )}
        {isMini ? (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="text-xs" style={{ color: '#22c55e' }}>الفيديو في وضع المصغر</span>
          </div>
        ) : (
          <>
            <img src={artworkUrl} alt="" className="absolute inset-0 w-full h-full" style={{ objectFit: 'fill' }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-3" style={{ pointerEvents: 'none', zIndex: 2 }}>
              <p className="font-bold text-center diwan-font mb-1" style={{ color: '#8B1A1A', fontSize: `${fontSize}px`, textShadow: '0 1px 2px rgba(255,255,220,0.6)', lineHeight: 1.3 }}>{poem.name}</p>
              <p className="text-center diwan-font" style={{ color: '#fff', fontSize: `${Math.max(4, fontSize - 2)}px`, lineHeight: 1.7, textShadow: '-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000' }}>{poem.lines[0]}</p>
              <p className="text-center diwan-font" style={{ color: '#fff', fontSize: `${Math.max(4, fontSize - 2)}px`, lineHeight: 1.7, textShadow: '-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000' }}>{poem.lines[1]}</p>
              <button className="relative mt-2 transition-opacity duration-200"
                style={{ width: 'clamp(38px,8vw,56px)', height: 'clamp(16px,3.2vw,22px)', opacity: playerVisible ? 0 : 1, pointerEvents: playerVisible ? 'none' : 'auto', zIndex: 3 }}
                onClick={activateAndPlay}>
                <img src={BTN_ICON} alt="" className="absolute inset-0 w-full h-full object-fill" />
                <span className="absolute inset-0 flex items-center justify-center font-bold" style={{ fontSize: 'clamp(7px,1.4vw,9px)', color: '#8B1A1A' }}>شغلني</span>
              </button>
            </div>
            <div className="absolute inset-0 flex flex-col transition-opacity duration-300"
              style={{ opacity: playerVisible ? 1 : 0, pointerEvents: playerVisible ? 'auto' : 'none', zIndex: 10 }}>
              <div className="relative" style={{ flex: '1 1 0', cursor: 'pointer' }} onClick={() => { onActivate(); setIsPlaying(p => !p); }}>
                <iframe src={iframeSrc} className="absolute inset-0 w-full h-full" style={{ border: 'none', pointerEvents: 'none' }} allow="autoplay; encrypted-media; fullscreen" allowFullScreen title={poem.name} />
                {isFullscreen && (
                  <button onClick={e => { e.stopPropagation(); handleFullscreen(); setIsPlaying(true); }}
                    className="absolute font-bold rounded px-3 py-1 text-xs"
                    style={{ top: 8, left: 8, zIndex: 9999, background: 'rgba(10,10,10,0.9)', color: '#22c55e', border: '1px solid #22c55e', backdropFilter: 'blur(4px)', pointerEvents: 'auto' }}>
                    في الإطار
                  </button>
                )}
              </div>
              {renderControls(false)}
            </div>
          </>
        )}
      </div>

      {showShare && <ShareModal poemName={poem.name} onClose={() => setShowShare(false)} />}
      {showThank && <ThankModal poemName={poem.name} onClose={() => setShowThank(false)} />}
    </>
  );
}

// ── Index dropdown ──
function IndexDropdown({ poems, sectionName }: { poems: Poem[]; sectionName: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const sPoems = poems.filter(p => p.section === sectionName);
  useEffect(() => {
    const outside = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
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
          <div className="px-3 py-1 text-xs font-bold sticky top-0" style={{ background: 'rgba(212,168,67,0.2)', color: '#D4A843' }}>{sectionName}</div>
          <div className="grid grid-cols-4 gap-0.5 p-1">
            {sPoems.map(p => (
              <button key={p.id} className="text-[10px] text-gray-300 hover:text-white hover:bg-gray-700/50 rounded px-1 py-0.5 text-right truncate transition-colors">{p.name}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main WatchSectionPage ──
interface Props {
  sectionName: string;
  onBackToWatch: () => void;
  onGoRead: () => void;
  onReadPoem: (poem: Poem) => void;
  onAction: (action: string) => void;
  openPoemId?: number | null;
  onGlobalNavigate?: (nav: { poem: Poem; target: 'read' | 'watch' }) => void;
}

export default function WatchSectionPage({ sectionName, onBackToWatch, onGoRead, onReadPoem, onAction: _onAction, openPoemId, onGlobalNavigate }: Props) {
  const { poems, updatePoem } = usePoems();
  const [modal, setModal] = useState<string | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [editPoem, setEditPoem] = useState<{ poem: Poem; tab: 'poem' | 'verses' | 'video' } | null>(null);
  const [cardFontSize, setCardFontSize] = useState(13);

  const sectionPoems = poems.filter(p => p.section === sectionName).slice(0, 20);

  const handleAdminTrigger = () => {
    if (isAdmin) { setIsAdmin(false); } else { setShowPinModal(true); }
  };

  // Auto-activate when coming from read section
  useEffect(() => {
    if (openPoemId != null) setActiveVideoId(openPoemId);
  }, [openPoemId]);

  return (
    <div className="min-h-screen min-h-dvh relative flex flex-col"
      style={{ backgroundImage: "url('https://nael.top/1/43.webp')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'scroll', direction: 'rtl' }}>
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      {/* ── HEADER ── */}
      <div className="relative z-30 flex-shrink-0" style={{ paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}>
        <h1 className="site-title text-center font-bold text-white cursor-pointer"
          style={{ fontSize: 'clamp(11px,3vw,20px)', padding: '2px 0 0', margin: 0, lineHeight: 1.1, textShadow: '-2px -2px 0 #000,2px -2px 0 #000,-2px 2px 0 #000,2px 2px 0 #000' }}
          onClick={handleAdminTrigger}>
          موقع الشاعر نائل المظفر الرسمي
        </h1>
        <p className="text-center font-bold"
          style={{ fontSize: 'clamp(9px,2vw,13px)', color: '#fff', textShadow: '0 0 8px #D4A843,0 0 16px #D4A843', animation: 'shimmer 3s ease-in-out infinite', margin: '0' }}>
          فيديوهات {sectionName}
        </p>
        <div className="flex justify-center" style={{ margin: '0' }}>
          <Clocks />
        </div>

        {/* Nav bar */}
        <div className="flex flex-col" style={{ gap: 0, margin: 0 }}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
            <button onClick={onBackToWatch} className="nav-icon-btn">
              <img src="https://nael.top/1/C.png" alt="" className="w-full h-full object-contain" />
              <span>العودة لشاهد</span>
            </button>
            <div className="nav-icon-cell relative">
              <img src="https://nael.top/1/C.png" alt="" className="absolute inset-0 w-full h-full object-fill pointer-events-none" />
              <div className="relative z-10 w-full h-full flex items-center justify-center px-1">
                <GlobalSearch
                  onNavigate={nav => {
                    if (nav.target === 'watch') {
                      if (nav.poem.section === sectionName) {
                        setActiveVideoId(nav.poem.id);
                      } else {
                        onGlobalNavigate?.(nav);
                      }
                    } else {
                      onGlobalNavigate?.(nav);
                    }
                  }}
                  defaultTarget="watch"
                />
              </div>
            </div>
            <div className="nav-icon-cell relative">
              <img src="https://nael.top/1/C.png" alt="" className="absolute inset-0 w-full h-full object-fill pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center w-full px-2">
                <span style={{ fontSize: 'clamp(11px,3vw,16px)', color: '#8B1A1A', fontWeight: 700 }}>حجم النص</span>
                <input type="range" min={4} max={200} value={cardFontSize}
                  onChange={e => setCardFontSize(Number(e.target.value))}
                  className="gold-slider w-full mt-0.5" style={{ height: 6 }} />
              </div>
            </div>
            <div className="nav-icon-cell">
              <IndexDropdown poems={poems} sectionName={sectionName} />
            </div>
            <button onClick={onGoRead} className="nav-icon-btn">
              <img src="https://nael.top/1/C.png" alt="" className="w-full h-full object-contain" />
              <span>انتقل للديوان</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── VIDEO CARDS GRID ── */}
      <div className="relative z-10 flex-1"
        style={{ paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)', paddingTop: '1%', paddingBottom: '1%' }}>
        <div className="poem-cards-grid">
          {sectionPoems.map((poem, idx) => (
            <VideoCard
              key={poem.id}
              poem={poem}
              videoUrl={SAMPLE_VIDEOS[idx % SAMPLE_VIDEOS.length]}
              artworkUrl={ARTWORK_PANELS[idx % ARTWORK_PANELS.length]}
              onReadPoem={onReadPoem}
              onGoRead={onGoRead}
              registerModal={() => setModal('register')}
              isActive={activeVideoId === poem.id}
              onActivate={() => setActiveVideoId(poem.id)}
              autoOpen={openPoemId === poem.id}
              fontSize={cardFontSize}
              isAdmin={isAdmin}
              onEdit={(p, tab) => setEditPoem({ poem: p, tab })}
            />
          ))}
        </div>
      </div>

      {editPoem && (
        <AdminEditor
          poem={editPoem.poem}
          initialTab={editPoem.tab}
          onSave={updated => updatePoem(updated)}
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
