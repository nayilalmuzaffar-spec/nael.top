interface Props {
  onReadClick: () => void;
  onWatchClick: () => void;
}

export default function Hearts({ onReadClick, onWatchClick }: Props) {
  return (
    <div className="flex items-start justify-center gap-2 sm:gap-6 md:gap-12 w-full">
      {/* Read Heart */}
      <div className="flex flex-col items-center relative">
        <div className="relative heartbeat cursor-pointer" onClick={onReadClick}>
          <img
            src="https://nael.top/1/B2.png"
            alt="اقرأ"
            className="heart-img"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-rise heart-label font-bold diwan-font" style={{ color: '#D4A843' }}>
              اقرأ
            </span>
          </div>
        </div>
        <div className="text-center mt-1">
          <p className="rainbow-text heart-sub diwan-font">المعنى في قلب الصفحة</p>
          <p className="rainbow-text heart-sub diwan-font">المجموعة الكاملة</p>
        </div>
      </div>

      {/* Watch Heart */}
      <div className="flex flex-col items-center relative">
        <div className="relative heartbeat cursor-pointer" onClick={onWatchClick}>
          <img
            src="https://nael.top/1/B2.png"
            alt="شاهد"
            className="heart-img"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-rise heart-label font-bold diwan-font" style={{ color: '#D4A843' }}>
              شاهد
            </span>
          </div>
        </div>
        <div className="text-center mt-1">
          <p className="rainbow-text heart-sub diwan-font">قطرات من محيط</p>
          <p className="rainbow-text heart-sub diwan-font">المجموعة المرئية</p>
        </div>
      </div>
    </div>
  );
}
