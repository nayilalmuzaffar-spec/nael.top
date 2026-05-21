import { useState } from 'react';
import Clocks from './components/Clocks';
import GlobalSearch from './components/GlobalSearch';
import Hearts from './components/Hearts';
import Biography from './components/Biography';
import ReadPage from './components/ReadPage';
import SectionPage from './components/SectionPage';
import WatchPage from './components/WatchPage';
import WatchSectionPage from './components/WatchSectionPage';
import SocialIcons from './components/SocialIcons';
import { RegistrationModal, CallModal, MessageModal, IndexModal } from './components/Modals';
import { PinModal } from './components/AdminEditor';
import { type Poem } from './lib/poems';

type Page = 'home' | 'biography' | 'read' | 'watch' | 'section' | 'watch-section';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [modal, setModal] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('');
  const [crossPoem, setCrossPoem] = useState<Poem | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleAdminTrigger = () => {
    if (isAdmin) { setIsAdmin(false); } else { setShowPinModal(true); }
  };

  const handleWatchPoem = (poem: Poem) => {
    setCrossPoem(poem);
    setActiveSection(poem.section);
    setPage('watch-section');
  };

  const handleReadPoem = (poem: Poem) => {
    setCrossPoem(poem);
    setActiveSection(poem.section);
    setPage('section');
  };

  const handleGlobalNavigate = ({ poem, target }: { poem: Poem; target: 'read' | 'watch' }) => {
    setCrossPoem(poem);
    setActiveSection(poem.section);
    setPage(target === 'watch' ? 'watch-section' : 'section');
  };

  const renderPage = () => {
    if (page === 'biography') {
      return <Biography onBack={() => setPage('home')} />;
    }

    if (page === 'section' && activeSection) {
      return (
        <SectionPage
          sectionName={activeSection}
          onBackToDiwan={() => { setCrossPoem(null); setPage('read'); }}
          onGoWatch={() => { setCrossPoem(null); setPage('watch'); }}
          onWatchPoem={handleWatchPoem}
          onAction={(a) => setModal(a)}
          openPoemId={crossPoem?.section === activeSection ? crossPoem.id : null}
          onGlobalNavigate={handleGlobalNavigate}
        />
      );
    }

    if (page === 'read') {
      return (
        <ReadPage
          onBack={() => setPage('home')}
          onGoWatch={() => setPage('watch')}
          onAction={(a) => setModal(a)}
          onGoSection={(sec) => { setCrossPoem(null); setActiveSection(sec); setPage('section'); }}
          onWatchPoem={handleWatchPoem}
          onGlobalNavigate={handleGlobalNavigate}
        />
      );
    }

    if (page === 'watch') {
      return (
        <WatchPage
          onBack={() => setPage('home')}
          onGoRead={() => setPage('read')}
          onAction={(a) => setModal(a)}
          onGoSection={(sec) => { setCrossPoem(null); setActiveSection(sec); setPage('watch-section'); }}
          onWatchPoem={handleWatchPoem}
          onGlobalNavigate={handleGlobalNavigate}
        />
      );
    }

    if (page === 'watch-section' && activeSection) {
      return (
        <WatchSectionPage
          sectionName={activeSection}
          onBackToWatch={() => { setCrossPoem(null); setPage('watch'); }}
          onGoRead={() => { setCrossPoem(null); setPage('read'); }}
          onReadPoem={handleReadPoem}
          onAction={(a) => setModal(a)}
          openPoemId={crossPoem?.section === activeSection ? crossPoem.id : null}
          onGlobalNavigate={handleGlobalNavigate}
        />
      );
    }

    return (
      <div className="relative z-10 flex flex-col items-center w-full px-2 pb-4"
        style={{ paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}>

        <h1
          className="site-title font-bold text-white text-center px-2 mt-2 cursor-pointer select-none"
          style={{ fontSize: 'clamp(16px, 4.5vw, 30px)', textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 3px 6px rgba(0,0,0,0.9)' }}
          onClick={handleAdminTrigger}
          title={isAdmin ? 'إغلاق وضع المدير' : 'وضع المدير'}
        >
          موقع الشاعر نائل المظفر الرسمي الوحيد
        </h1>

        <Clocks />

        <div className="flex flex-col items-center gap-1 w-full max-w-3xl">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <button onClick={() => setPage('biography')} className="relative group h-[40px] sm:h-[48px]" style={{ width: 'clamp(90px, 25vw, 120px)' }}>
              <img src="https://nael.top/1/C.png" alt="السيرة الذاتية" className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-110" />
              <span className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-bold" style={{ color: '#8B1A1A' }}>السيرة</span>
            </button>
            <button onClick={() => setModal('index')} className="relative group h-[40px] sm:h-[48px]" style={{ width: 'clamp(90px, 25vw, 120px)' }}>
              <img src="https://nael.top/1/C.png" alt="الفهرست" className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-110" />
              <span className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-bold" style={{ color: '#8B1A1A' }}>الفهرست</span>
            </button>
          </div>
          <GlobalSearch onNavigate={handleGlobalNavigate} defaultTarget="read" />
        </div>

        <Hearts onReadClick={() => setPage('read')} onWatchClick={() => setPage('watch')} />

        <p className="rainbow-text text-xl sm:text-2xl md:text-3xl font-bold mt-0">الشاعر نائل المظفر</p>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen min-h-dvh relative flex flex-col items-center"
      style={{
        backgroundImage: "url('https://nael.top/1/A.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll',
      }}
    >
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* Social ticker — full width, shown on all pages */}
      <div className="social-ticker-global">
        <SocialIcons onAction={(a) => setModal(a)} />
      </div>

      {renderPage()}

      {showPinModal && (
        <PinModal
          onSuccess={() => setIsAdmin(true)}
          onClose={() => setShowPinModal(false)}
        />
      )}

      <RegistrationModal isOpen={modal === 'register'} onClose={() => setModal(null)} />
      <CallModal isOpen={modal === 'call'} onClose={() => setModal(null)} />
      <MessageModal isOpen={modal === 'message'} onClose={() => setModal(null)} />
      <IndexModal isOpen={modal === 'index'} onClose={() => setModal(null)} />
    </div>
  );
}

export default App;
