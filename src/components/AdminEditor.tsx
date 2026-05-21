import { useState, useRef, useEffect, useCallback } from 'react';
import type { Poem } from '../lib/poems';
import { usePoems } from '../lib/poemsContext';

// ── Arabic fonts ──────────────────────────────────────────────────────────────
const ARABIC_FONTS = [
  { name: 'Scheherazade New', label: 'شهرزاد' },
  { name: 'Amiri', label: 'أميري' },
  { name: 'Noto Naskh Arabic', label: 'نوتو نسخ' },
  { name: 'Noto Kufi Arabic', label: 'نوتو كوفي' },
  { name: 'Cairo', label: 'القاهرة' },
  { name: 'Tajawal', label: 'تجوال' },
  { name: 'Almarai', label: 'المراعي' },
  { name: 'Lateef', label: 'لطيف' },
  { name: 'Mirza', label: 'ميرزا' },
  { name: 'Reem Kufi', label: 'ريم كوفي' },
  { name: 'Mada', label: 'مدى' },
  { name: 'Harmattan', label: 'هرماتان' },
  { name: 'Katibeh', label: 'كاتبة' },
  { name: 'El Messiri', label: 'الميسيري' },
  { name: 'Rakkas', label: 'ركاز' },
  { name: 'Jomhuria', label: 'جمهورية' },
  { name: 'Lalezar', label: 'لاله‌زار' },
  { name: 'Aref Ruqaa', label: 'عارف رقعة' },
  { name: 'Markazi Text', label: 'مركزي' },
  { name: 'Gulzar', label: 'گلزار' },
  { name: 'Vibes', label: 'مزخرف' },
  { name: 'Baloo Bhaijaan 2', label: 'بالو' },
  { name: 'Kufam', label: 'كوفام' },
  { name: 'Blaka', label: 'بلاكا' },
  { name: 'Blaka Ink', label: 'بلاكا مداد' },
  { name: 'Blaka Hollow', label: 'بلاكا فارغ' },
  { name: 'Marhey', label: 'مرهي' },
  { name: 'Noto Sans Arabic', label: 'نوتو سانس' },
  { name: 'IBM Plex Sans Arabic', label: 'IBM بلكس' },
  { name: 'Readex Pro', label: 'ريدكس برو' },
  { name: 'Changa', label: 'تشانجا' },
  { name: 'Habibi', label: 'حبيبي' },
  { name: 'Qahiri', label: 'قاهري' },
  { name: 'Ruwudu', label: 'رووودو' },
  { name: 'Baloo 2', label: 'بالو ٢' },
  { name: 'Kalam', label: 'كلام' },
  { name: 'Lemonada', label: 'ليموناضة' },
  { name: 'Rana Kufi', label: 'رانا كوفي' },
  { name: 'Expo Arabic', label: 'اكسبو' },
  { name: 'Alkalami', label: 'القلامي' },
  { name: 'Estedad', label: 'استعداد' },
  { name: 'Meie Script', label: 'ميي سكريبت' },
  { name: 'Noto Serif Arabic', label: 'نوتو سريف' },
  { name: 'Amiri Quran', label: 'أميري قرآن' },
  { name: 'Reem Kufi Fun', label: 'ريم كوفي مرح' },
];

const BG_IMAGES = [
  'https://nael.top/1/1.webp', 'https://nael.top/1/2.webp', 'https://nael.top/1/3.webp',
  'https://nael.top/1/4.webp', 'https://nael.top/1/5.webp', 'https://nael.top/1/6.webp',
  'https://nael.top/1/7.webp', 'https://nael.top/1/8.webp', 'https://nael.top/1/9.webp',
  'https://nael.top/1/10.webp', 'https://nael.top/1/11.webp', 'https://nael.top/1/12.webp',
  'https://nael.top/1/13.webp', 'https://nael.top/1/14.webp',
];

const MOTION_EFFECTS = [
  'none', 'fadeIn', 'slideRight', 'slideLeft', 'slideUp', 'slideDown',
  'zoomIn', 'zoomOut', 'bounceIn', 'flipX', 'flipY', 'rotateIn',
  'swing', 'pulse', 'shake', 'rubberBand', 'wobble', 'heartBeat',
  'lightSpeedIn', 'jackInTheBox',
];

const LIGHT_EFFECTS = [
  'none', 'glow', 'shadow', 'neon', 'fire', 'ice', 'gold', 'rainbow',
  'blur', 'sharpen', 'emboss', 'grayscale', 'sepia', 'invert',
  'hueRotate', 'saturate', 'brightness', 'contrast', 'dropShadow', 'outline',
];

const ALIGN_PRESETS = [
  { id: 'col1', label: 'عمود واحد متساوي' },
  { id: 'col2eq', label: 'عمودان متقابلان' },
  { id: 'col2nest', label: 'عمودان متداخلان' },
  { id: 'col2bot', label: 'عمودان + عمود سفلي' },
  { id: 'prose', label: 'تسطير قصيدة النثر' },
  { id: 'free', label: 'تسطير قصيدة الحر' },
  { id: 'equalize', label: 'مساواة الأبيات المحددة' },
];

interface AdminEditorProps {
  poem: Poem;
  initialTab: 'poem' | 'verses' | 'video';
  onSave: (updated: Poem) => void;
  onClose: () => void;
  cardRef?: HTMLElement | null;
}

// ── Color picker ──────────────────────────────────────────────────────────────
function ColorPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const swatches = ['#ffffff', '#000000', '#D4A843', '#8B1A1A', '#1a3a6e', '#2d5a27', '#6e2d7a', '#c0392b', '#16a085', '#f39c12', '#2980b9', '#8e44ad', 'transparent'];
  return (
    <div className="flex flex-wrap gap-1 items-center">
      {swatches.map(s => (
        <div key={s} onClick={() => onChange(s)}
          className="w-5 h-5 rounded cursor-pointer border-2 flex-shrink-0"
          style={{
            background: s === 'transparent' ? 'linear-gradient(45deg,#ccc 25%,transparent 25%,transparent 75%,#ccc 75%,#ccc),linear-gradient(45deg,#ccc 25%,#fff 25%,#fff 75%,#ccc 75%,#ccc)' : s,
            backgroundSize: s === 'transparent' ? '6px 6px' : undefined,
            backgroundPosition: s === 'transparent' ? '0 0,3px 3px' : undefined,
            borderColor: value === s ? '#D4A843' : 'rgba(255,255,255,0.2)',
          }} />
      ))}
      <input type="color" value={value === 'transparent' ? '#ffffff' : value} onChange={e => onChange(e.target.value)}
        className="w-5 h-5 rounded cursor-pointer border-0 p-0 flex-shrink-0" style={{ background: 'transparent' }} />
    </div>
  );
}

// ── Slider ────────────────────────────────────────────────────────────────────
function Slider({ label, min, max, value, onChange, unit = '' }: {
  label: string; min: number; max: number; value: number; onChange: (v: number) => void; unit?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] flex-shrink-0" style={{ color: '#aaa', minWidth: 60 }}>{label}</span>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))}
        className="flex-1 gold-slider" style={{ height: 4 }} />
      <span className="text-[9px] flex-shrink-0" style={{ color: '#D4A843', minWidth: 28 }}>{value}{unit}</span>
    </div>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ label }: { label: string }) {
  return (
    <div className="text-[9px] font-bold px-1 py-0.5 rounded mb-1 mt-2"
      style={{ background: 'rgba(212,168,67,0.15)', color: '#D4A843', borderRight: '2px solid #D4A843' }}>
      {label}
    </div>
  );
}

// ── Main AdminEditor ──────────────────────────────────────────────────────────
export default function AdminEditor({ poem, initialTab, onSave, onClose }: AdminEditorProps) {
  const { updatePoem } = usePoems();
  const [tab, setTab] = useState<'poem' | 'verses' | 'video'>(initialTab);

  // dragging / resizing
  const editorRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: 340, h: 520 });
  const [ready, setReady] = useState(false);
  const dragging = useRef(false);
  const dragStart = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });

  // poem state
  const [poemName, setPoemName] = useState(poem.name);
  const [poemLines, setPoemLines] = useState(poem.lines.join('\n'));
  // verses tab
  const [selectedVerse, setSelectedVerse] = useState(0);
  const [verseText, setVerseText] = useState(poem.lines[0] ?? '');
  // video tab
  const [videoUrl, setVideoUrl] = useState('https://nael.top');
  const [videoStart, setVideoStart] = useState(0);
  const [videoEnd, setVideoEnd] = useState(0);
  const [videoCaption, setVideoCaption] = useState('');
  const [_bgUrl, setBgUrl] = useState('');

  // style
  const [font, setFont] = useState('Scheherazade New');
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState('#ffffff');
  const [textOpacity, setTextOpacity] = useState(100);
  const [bgColor, setBgColor] = useState('transparent');
  const [bgOpacity, setBgOpacity] = useState(80);
  const [selectedBg, setSelectedBg] = useState('');
  const [align, setAlign] = useState('col1');
  const [motionX, setMotionX] = useState(0);
  const [motionY, setMotionY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [wordSpacing, setWordSpacing] = useState(0);
  const [motionEffect, setMotionEffect] = useState('none');
  const [lightEffect, setLightEffect] = useState('none');
  const [customBgUrl, setCustomBgUrl] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  // init position centered
  useEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = Math.min(360, vw * 0.92);
    const h = Math.min(560, vh * 0.88);
    setSize({ w, h });
    setPos({ x: (vw - w) / 2, y: (vh - h) / 2 });
    setReady(true);
  }, []);

  // drag
  const onMouseDownHeader = (e: React.MouseEvent) => {
    dragging.current = true;
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: pos.x, oy: pos.y };
    e.preventDefault();
  };
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - dragStart.current.mx;
      const dy = e.clientY - dragStart.current.my;
      setPos({ x: dragStart.current.ox + dx, y: dragStart.current.oy + dy });
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  const pushHistory = () => {
    setHistory(h => [...h.slice(-19), JSON.stringify({ poemName, poemLines, verseText, videoUrl, font, fontSize, textColor, textOpacity, bgColor, bgOpacity, selectedBg, motionX, motionY, rotation, letterSpacing, wordSpacing, motionEffect, lightEffect })]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = JSON.parse(history[history.length - 1]);
    setPoemName(prev.poemName); setPoemLines(prev.poemLines); setVerseText(prev.verseText);
    setVideoUrl(prev.videoUrl); setFont(prev.font); setFontSize(prev.fontSize);
    setTextColor(prev.textColor); setTextOpacity(prev.textOpacity); setBgColor(prev.bgColor);
    setBgOpacity(prev.bgOpacity); setSelectedBg(prev.selectedBg); setMotionX(prev.motionX);
    setMotionY(prev.motionY); setRotation(prev.rotation); setLetterSpacing(prev.letterSpacing);
    setWordSpacing(prev.wordSpacing); setMotionEffect(prev.motionEffect); setLightEffect(prev.lightEffect);
    setHistory(h => h.slice(0, -1));
  };

  const buildUpdated = useCallback((): Poem => ({
    ...poem,
    name: poemName,
    lines: tab === 'verses'
      ? poem.lines.map((l, i) => i === selectedVerse ? verseText : l)
      : poemLines.split('\n').filter(Boolean),
  }), [poem, poemName, poemLines, tab, selectedVerse, verseText]);

  const handleSave = () => {
    pushHistory();
    const updated = buildUpdated();
    onSave(updated);
    updatePoem(updated);
  };

  const handleSaveClose = () => {
    const updated = buildUpdated();
    onSave(updated);
    updatePoem(updated);
    onClose();
  };

  const exportAs = (format: 'json' | 'md' | 'epub') => {
    const updated = buildUpdated();
    let content = '';
    let mime = 'text/plain';
    let ext: string = format;

    if (format === 'json') {
      content = JSON.stringify(updated, null, 2);
      mime = 'application/json';
    } else if (format === 'md') {
      content = `# ${updated.name}\n\n${updated.lines.map(l => `> ${l}`).join('\n\n')}`;
      mime = 'text/markdown';
    } else if (format === 'epub') {
      content = `<?xml version="1.0"?><html xmlns="http://www.w3.org/1999/xhtml"><head><title>${updated.name}</title></head><body dir="rtl"><h1>${updated.name}</h1>${updated.lines.map(l => `<p>${l}</p>`).join('')}</body></html>`;
      mime = 'application/epub+zip';
      ext = 'epub';
    }

    onSave(updated);
    updatePoem(updated);
    onClose();
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${updated.name}.${ext}`; a.click();
    URL.revokeObjectURL(url);
  };

  const exportProjectZip = async () => {
    const updated = buildUpdated();
    onSave(updated);
    updatePoem(updated);

    // Dynamically load JSZip
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('JSZip load failed'));
      document.head.appendChild(s);
    });

    const JSZip = (window as unknown as { JSZip: new () => {
      file: (name: string, content: string) => void;
      generateAsync: (opts: { type: string }) => Promise<Blob>;
    } }).JSZip;
    const zip = new JSZip();

    // Embed updated poem data into poems.ts source
    const poemsJson = JSON.stringify(updated, null, 2);
    zip.file('poem-export.json', poemsJson);

    // Add a simple HTML viewer
    const html = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>${updated.name}</title><style>body{font-family:'Scheherazade New',serif;background:#1a0f05;color:#D4A843;padding:2rem;direction:rtl;} h1{color:#D4A843;text-align:center;} p{line-height:2.2;font-size:1.3rem;text-align:center;margin:0.3rem 0;}</style></head><body><h1>${updated.name}</h1>${updated.lines.map(l => `<p>${l}</p>`).join('')}</body></html>`;
    zip.file(`${updated.name}.html`, html);

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${updated.name}-export.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!ready) return null;

  const currentLines = poemLines.split('\n').filter(Boolean);

  return (
    <div
      ref={editorRef}
      className="fixed z-[10000] rounded-xl overflow-hidden flex flex-col"
      style={{
        left: pos.x, top: pos.y,
        width: size.w, height: size.h,
        background: 'rgba(8,5,2,0.97)',
        border: '1px solid rgba(212,168,67,0.5)',
        boxShadow: '0 16px 64px rgba(0,0,0,0.9)',
        direction: 'rtl',
        resize: 'both',
        minWidth: 280, minHeight: 360,
        userSelect: 'none',
      }}
    >
      {/* ── Drag handle / header ── */}
      <div
        ref={headerRef}
        onMouseDown={onMouseDownHeader}
        className="flex items-center justify-between px-2 py-1 cursor-move flex-shrink-0"
        style={{ background: 'rgba(212,168,67,0.18)', borderBottom: '1px solid rgba(212,168,67,0.3)' }}
      >
        <span className="text-[10px] font-bold" style={{ color: '#D4A843' }}>
          وضع المدير — {poem.name}
        </span>
        <button onClick={onClose} className="text-[11px] text-white/60 hover:text-white px-1">✕</button>
      </div>

      {/* ── Action bar row 1: undo / save / save+close ── */}
      <div className="flex gap-1 px-2 py-1 flex-shrink-0 flex-wrap"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
        <ABtn label="↩ إعادة" color="#aaa" onClick={handleUndo} />
        <ABtn label="💾 حفظ" color="#7ec87e" onClick={handleSave} />
        <ABtn label="✅ حفظ وإغلاق" color="#D4A843" onClick={handleSaveClose} />
      </div>

      {/* ── Action bar row 2: export ── */}
      <div className="flex gap-1 px-2 py-0.5 flex-shrink-0 flex-wrap"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
        <ABtn label="JSON" color="#5bc8e0" onClick={() => exportAs('json')} />
        <ABtn label="Markdown" color="#b0d4f1" onClick={() => exportAs('md')} />
        <ABtn label="EPUB" color="#d4a0e0" onClick={() => exportAs('epub')} />
        <ABtn label="📦 حفظ وتصدير ZIP" color="#7ec87e" onClick={exportProjectZip} />
      </div>

      {/* ── Tabs ── */}
      <div className="flex flex-shrink-0" style={{ borderBottom: '1px solid rgba(212,168,67,0.25)' }}>
        {(['poem', 'verses', 'video'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 text-[9px] font-bold py-1 transition-colors"
            style={{
              background: tab === t ? 'rgba(212,168,67,0.25)' : 'transparent',
              color: tab === t ? '#D4A843' : '#777',
              borderBottom: tab === t ? '2px solid #D4A843' : '2px solid transparent',
            }}>
            {t === 'poem' ? 'تحرير القصيدة' : t === 'verses' ? 'تحرير الأبيات' : 'تحرير الفيديو'}
          </button>
        ))}
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto px-2 py-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#D4A843 transparent' }}>

        {/* ════════ TAB: POEM ════════ */}
        {tab === 'poem' && (
          <div className="flex flex-col gap-1">
            <SectionHeading label="نص القصيدة" />
            <div className="text-[8px] mb-0.5" style={{ color: '#666' }}>عنوان القصيدة</div>
            <input value={poemName} onChange={e => { pushHistory(); setPoemName(e.target.value); }}
              className="w-full rounded px-2 py-1 text-white text-xs focus:outline-none mb-1"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,168,67,0.3)', fontFamily: font }} />
            <div className="text-[8px] mb-0.5" style={{ color: '#666' }}>أبيات القصيدة (كل بيت في سطر)</div>
            <textarea
              value={poemLines}
              onChange={e => { pushHistory(); setPoemLines(e.target.value); }}
              rows={5}
              className="w-full rounded px-2 py-1 text-white text-xs focus:outline-none resize-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,168,67,0.3)', fontFamily: font, lineHeight: 1.8 }}
            />

            <SectionHeading label="الخط العربي" />
            <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
              {ARABIC_FONTS.map(f => (
                <button key={f.name} onClick={() => setFont(f.name)}
                  className="text-[9px] py-0.5 rounded truncate"
                  style={{
                    fontFamily: f.name,
                    background: font === f.name ? 'rgba(212,168,67,0.3)' : 'rgba(255,255,255,0.05)',
                    color: font === f.name ? '#D4A843' : '#ccc',
                    border: font === f.name ? '1px solid #D4A843' : '1px solid transparent',
                    padding: '2px 4px',
                  }}>{f.label}</button>
              ))}
            </div>
            <div className="mt-1 flex flex-col gap-1">
              <Slider label="حجم الخط" min={8} max={48} value={fontSize} onChange={setFontSize} unit="px" />
              <div className="text-[8px] mb-0.5 mt-1" style={{ color: '#aaa' }}>لون النص</div>
              <ColorPicker value={textColor} onChange={setTextColor} />
              <Slider label="شفافية النص" min={0} max={100} value={textOpacity} onChange={setTextOpacity} unit="%" />
            </div>

            <SectionHeading label="الخلفية" />
            <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
              {BG_IMAGES.map(img => (
                <img key={img} src={img} alt="" onClick={() => { setSelectedBg(img); setBgColor('transparent'); }}
                  className="rounded cursor-pointer object-cover"
                  style={{ height: 36, border: selectedBg === img ? '2px solid #D4A843' : '2px solid transparent' }} />
              ))}
            </div>
            <div className="mt-1 text-[8px] mb-0.5" style={{ color: '#aaa' }}>لون الخلفية</div>
            <ColorPicker value={bgColor} onChange={c => { setBgColor(c); setSelectedBg(''); }} />
            <div className="flex gap-1 mt-1">
              <input value={customBgUrl} onChange={e => setCustomBgUrl(e.target.value)}
                placeholder="رابط خلفية جديدة..."
                className="flex-1 rounded px-2 py-0.5 text-white text-[9px] focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,168,67,0.25)' }} />
              <button onClick={() => { if (customBgUrl.trim()) { setSelectedBg(customBgUrl.trim()); setBgColor('transparent'); } }}
                className="text-[9px] px-2 py-0.5 rounded flex-shrink-0"
                style={{ background: 'rgba(212,168,67,0.2)', color: '#D4A843' }}>تطبيق</button>
            </div>
            <Slider label="شفافية الخلفية" min={0} max={100} value={bgOpacity} onChange={setBgOpacity} unit="%" />

            <SectionHeading label="تصفيف القصيدة" />
            <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
              {ALIGN_PRESETS.map(a => (
                <button key={a.id} onClick={() => setAlign(a.id)}
                  className="text-[9px] py-0.5 px-1 rounded text-right"
                  style={{
                    background: align === a.id ? 'rgba(212,168,67,0.25)' : 'rgba(255,255,255,0.05)',
                    color: align === a.id ? '#D4A843' : '#aaa',
                    border: align === a.id ? '1px solid #D4A843' : '1px solid transparent',
                  }}>{a.label}</button>
              ))}
            </div>

            <SectionHeading label="تحريك النص" />
            <div className="flex flex-col gap-1">
              <Slider label="يمين / يسار" min={-100} max={100} value={motionX} onChange={setMotionX} unit="%" />
              <Slider label="أعلى / أسفل" min={-100} max={100} value={motionY} onChange={setMotionY} unit="%" />
              <Slider label="دوران" min={0} max={360} value={rotation} onChange={setRotation} unit="°" />
              <Slider label="تطويل الأحرف" min={-5} max={20} value={letterSpacing} onChange={setLetterSpacing} unit="px" />
              <Slider label="تباعد الكلمات" min={0} max={20} value={wordSpacing} onChange={setWordSpacing} unit="px" />
            </div>

            <SectionHeading label="مكتبة مؤثرات الحركة" />
            <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
              {MOTION_EFFECTS.map(e => (
                <button key={e} onClick={() => setMotionEffect(e)}
                  className="text-[8px] py-0.5 px-1 rounded"
                  style={{
                    background: motionEffect === e ? 'rgba(212,168,67,0.2)' : 'rgba(255,255,255,0.04)',
                    color: motionEffect === e ? '#D4A843' : '#888',
                    border: motionEffect === e ? '1px solid #D4A843' : '1px solid transparent',
                  }}>{e}</button>
              ))}
            </div>

            <SectionHeading label="مكتبة المؤثرات الضوئية" />
            <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
              {LIGHT_EFFECTS.map(e => (
                <button key={e} onClick={() => setLightEffect(e)}
                  className="text-[8px] py-0.5 px-1 rounded"
                  style={{
                    background: lightEffect === e ? 'rgba(80,150,255,0.2)' : 'rgba(255,255,255,0.04)',
                    color: lightEffect === e ? '#80c0ff' : '#888',
                    border: lightEffect === e ? '1px solid #80c0ff' : '1px solid transparent',
                  }}>{e}</button>
              ))}
            </div>
          </div>
        )}

        {/* ════════ TAB: VERSES ════════ */}
        {tab === 'verses' && (
          <div className="flex flex-col gap-1">
            <SectionHeading label="اختر البيت للتحرير" />
            <select value={selectedVerse} onChange={e => { setSelectedVerse(Number(e.target.value)); setVerseText(currentLines[Number(e.target.value)] ?? ''); }}
              className="w-full rounded px-2 py-1 text-white text-xs focus:outline-none"
              style={{ background: 'rgba(30,20,8,0.95)', border: '1px solid rgba(212,168,67,0.35)', color: '#D4A843', direction: 'rtl' }}>
              {currentLines.map((line, i) => (
                <option key={i} value={i}>{i + 1}. {line.substring(0, 40)}{line.length > 40 ? '...' : ''}</option>
              ))}
            </select>

            <SectionHeading label="نص البيت" />
            <textarea
              value={verseText}
              onChange={e => { pushHistory(); setVerseText(e.target.value); }}
              rows={3}
              className="w-full rounded px-2 py-1 text-white text-xs focus:outline-none resize-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,168,67,0.3)', fontFamily: font, lineHeight: 1.8 }}
            />
            <div className="text-[8px] mt-0.5" style={{ color: '#888' }}>
              التعديل يُطبق على هذا البيت فقط دون المساس ببقية الأبيات
            </div>

            <SectionHeading label="الخط العربي" />
            <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
              {ARABIC_FONTS.map(f => (
                <button key={f.name} onClick={() => setFont(f.name)}
                  className="text-[9px] py-0.5 rounded truncate"
                  style={{
                    fontFamily: f.name,
                    background: font === f.name ? 'rgba(212,168,67,0.3)' : 'rgba(255,255,255,0.05)',
                    color: font === f.name ? '#D4A843' : '#ccc',
                    border: font === f.name ? '1px solid #D4A843' : '1px solid transparent',
                    padding: '2px 4px',
                  }}>{f.label}</button>
              ))}
            </div>
            <Slider label="حجم الخط" min={8} max={48} value={fontSize} onChange={setFontSize} unit="px" />
            <div className="text-[8px] mb-0.5 mt-1" style={{ color: '#aaa' }}>لون النص</div>
            <ColorPicker value={textColor} onChange={setTextColor} />
            <Slider label="شفافية النص" min={0} max={100} value={textOpacity} onChange={setTextOpacity} unit="%" />

            <SectionHeading label="مكتبة مؤثرات الحركة" />
            <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
              {MOTION_EFFECTS.map(e => (
                <button key={e} onClick={() => setMotionEffect(e)}
                  className="text-[8px] py-0.5 px-1 rounded"
                  style={{
                    background: motionEffect === e ? 'rgba(212,168,67,0.2)' : 'rgba(255,255,255,0.04)',
                    color: motionEffect === e ? '#D4A843' : '#888',
                    border: motionEffect === e ? '1px solid #D4A843' : '1px solid transparent',
                  }}>{e}</button>
              ))}
            </div>

            <SectionHeading label="مكتبة المؤثرات الضوئية" />
            <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
              {LIGHT_EFFECTS.map(e => (
                <button key={e} onClick={() => setLightEffect(e)}
                  className="text-[8px] py-0.5 px-1 rounded"
                  style={{
                    background: lightEffect === e ? 'rgba(80,150,255,0.2)' : 'rgba(255,255,255,0.04)',
                    color: lightEffect === e ? '#80c0ff' : '#888',
                    border: lightEffect === e ? '1px solid #80c0ff' : '1px solid transparent',
                  }}>{e}</button>
              ))}
            </div>
          </div>
        )}

        {/* ════════ TAB: VIDEO ════════ */}
        {tab === 'video' && (
          <div className="flex flex-col gap-1">
            <SectionHeading label="رابط الفيديو" />
            <input value={videoUrl} onChange={e => { pushHistory(); setVideoUrl(e.target.value); }}
              placeholder="https://..."
              className="w-full rounded px-2 py-1 text-white text-[10px] focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,168,67,0.3)' }} />

            <SectionHeading label="نقطة البداية والنهاية (ثانية)" />
            <Slider label="نقطة البداية" min={0} max={3600} value={videoStart} onChange={setVideoStart} unit="ث" />
            <Slider label="نقطة النهاية" min={0} max={3600} value={videoEnd} onChange={setVideoEnd} unit="ث" />

            <SectionHeading label="الكتابة على الفيديو" />
            <input value={videoCaption} onChange={e => { pushHistory(); setVideoCaption(e.target.value); }}
              placeholder="نص يظهر على الفيديو..."
              className="w-full rounded px-2 py-1 text-white text-[10px] focus:outline-none mb-1"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,168,67,0.3)', fontFamily: font }} />
            <Slider label="حجم الخط" min={8} max={48} value={fontSize} onChange={setFontSize} unit="px" />
            <div className="text-[8px] mb-0.5 mt-1" style={{ color: '#aaa' }}>لون النص</div>
            <ColorPicker value={textColor} onChange={setTextColor} />

            <SectionHeading label="الخلفية" />
            <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
              {BG_IMAGES.map(img => (
                <img key={img} src={img} alt="" onClick={() => { setSelectedBg(img); setBgColor('transparent'); setBgUrl(img); }}
                  className="rounded cursor-pointer object-cover"
                  style={{ height: 36, border: selectedBg === img ? '2px solid #D4A843' : '2px solid transparent' }} />
              ))}
            </div>
            <div className="flex gap-1 mt-1">
              <input value={customBgUrl} onChange={e => setCustomBgUrl(e.target.value)}
                placeholder="رابط خلفية جديدة..."
                className="flex-1 rounded px-2 py-0.5 text-white text-[9px] focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,168,67,0.25)' }} />
              <button onClick={() => { if (customBgUrl.trim()) { setSelectedBg(customBgUrl.trim()); setBgUrl(customBgUrl.trim()); setBgColor('transparent'); } }}
                className="text-[9px] px-2 py-0.5 rounded flex-shrink-0"
                style={{ background: 'rgba(212,168,67,0.2)', color: '#D4A843' }}>تطبيق</button>
            </div>
            <Slider label="شفافية الخلفية" min={0} max={100} value={bgOpacity} onChange={setBgOpacity} unit="%" />

            <SectionHeading label="الخط العربي" />
            <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
              {ARABIC_FONTS.map(f => (
                <button key={f.name} onClick={() => setFont(f.name)}
                  className="text-[9px] py-0.5 rounded truncate"
                  style={{
                    fontFamily: f.name,
                    background: font === f.name ? 'rgba(212,168,67,0.3)' : 'rgba(255,255,255,0.05)',
                    color: font === f.name ? '#D4A843' : '#ccc',
                    border: font === f.name ? '1px solid #D4A843' : '1px solid transparent',
                    padding: '2px 4px',
                  }}>{f.label}</button>
              ))}
            </div>

            <SectionHeading label="مكتبة مؤثرات الحركة" />
            <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
              {MOTION_EFFECTS.map(e => (
                <button key={e} onClick={() => setMotionEffect(e)}
                  className="text-[8px] py-0.5 px-1 rounded"
                  style={{
                    background: motionEffect === e ? 'rgba(212,168,67,0.2)' : 'rgba(255,255,255,0.04)',
                    color: motionEffect === e ? '#D4A843' : '#888',
                    border: motionEffect === e ? '1px solid #D4A843' : '1px solid transparent',
                  }}>{e}</button>
              ))}
            </div>

            <SectionHeading label="مكتبة المؤثرات الضوئية" />
            <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
              {LIGHT_EFFECTS.map(e => (
                <button key={e} onClick={() => setLightEffect(e)}
                  className="text-[8px] py-0.5 px-1 rounded"
                  style={{
                    background: lightEffect === e ? 'rgba(80,150,255,0.2)' : 'rgba(255,255,255,0.04)',
                    color: lightEffect === e ? '#80c0ff' : '#888',
                    border: lightEffect === e ? '1px solid #80c0ff' : '1px solid transparent',
                  }}>{e}</button>
              ))}
            </div>
          </div>
        )}

        {/* bottom padding */}
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}

// ── Small action button ───────────────────────────────────────────────────────
function ABtn({ label, color, onClick }: { label: string; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="text-[8px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 transition-opacity hover:opacity-80"
      style={{ background: 'rgba(255,255,255,0.06)', color, border: `1px solid ${color}44` }}>
      {label}
    </button>
  );
}

// ── PinModal (shared) ─────────────────────────────────────────────────────────
interface PinModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function PinModal({ onSuccess, onClose }: PinModalProps) {
  const [pin, setPin] = useState('');
  const [err, setErr] = useState(false);

  const submit = () => {
    if (pin === '7777') { onSuccess(); onClose(); }
    else { setErr(true); setTimeout(() => setErr(false), 800); setPin(''); }
  };

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={onClose}>
      <div className="rounded-xl p-5 w-72 flex flex-col items-center gap-3"
        style={{ background: 'rgba(12,8,3,0.97)', border: '1px solid rgba(212,168,67,0.4)', boxShadow: '0 8px 40px rgba(0,0,0,0.8)' }}
        onClick={e => e.stopPropagation()}>
        <div className="text-sm font-bold" style={{ color: '#D4A843', fontFamily: 'Scheherazade New, serif' }}>
          وضع المدير
        </div>
        <input
          type="password"
          value={pin}
          maxLength={6}
          autoFocus
          onChange={e => { setPin(e.target.value); setErr(false); }}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="الرمز السري"
          className="w-full text-center text-xl rounded px-3 py-2 tracking-widest focus:outline-none transition-colors"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${err ? '#e74c3c' : 'rgba(212,168,67,0.35)'}`,
            color: err ? '#e74c3c' : '#fff',
          }}
        />
        <button onClick={submit}
          className="w-full py-1.5 rounded text-sm font-bold transition-opacity hover:opacity-80"
          style={{ background: 'rgba(212,168,67,0.2)', color: '#D4A843', border: '1px solid rgba(212,168,67,0.4)' }}>
          دخول
        </button>
      </div>
    </div>
  );
}

