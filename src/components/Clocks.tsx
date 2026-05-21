import { useState, useEffect } from 'react';

function toArabicNumerals(num: number): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().padStart(2, '0').split('').map(d => arabicDigits[parseInt(d)]).join('');
}

function getArabicDay(day: number): string {
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  return days[day];
}

function getHijriDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return 'جمادى الآخرة ١٤٤٧ هـ';
  }
}

function getGregorianDate(date: Date): string {
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  return `${toArabicNumerals(date.getDate())} ${months[date.getMonth()]} ${toArabicNumerals(date.getFullYear())}`;
}

function formatTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'مساءً' : 'صباحاً';
  hours = hours % 12 || 12;
  return `${toArabicNumerals(hours)}:${toArabicNumerals(minutes)} ${ampm}`;
}

export default function Clocks() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const greenwichOffset = now.getTimezoneOffset();
  const greenwichTime = new Date(now.getTime() + greenwichOffset * 60000);
  const basraTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);

  const fs1 = 'clamp(9px, 2.4vw, 13px)';
  const fs2 = 'clamp(8px, 2.1vw, 11px)';

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
      {/* Greenwich Clock */}
      <div className="clock-image">
        <img
          src="https://nael.top/1/D2.png"
          alt="ساعة غرنتش"
          className="clock-img"
        />
        <div className="clock-text">
          <div style={{ fontSize: fs1 }}>غرنتش {formatTime(greenwichTime)}</div>
          <div style={{ fontSize: fs2 }}>{getArabicDay(greenwichTime.getDay())} {toArabicNumerals(greenwichTime.getDate())} {getHijriDate(greenwichTime)}</div>
        </div>
      </div>

      {/* Basra Clock */}
      <div className="clock-image">
        <img
          src="https://nael.top/1/D.png"
          alt="ساعة البصرة"
          className="clock-img"
        />
        <div className="clock-text">
          <div style={{ fontSize: fs1 }}>البصرة {formatTime(basraTime)}</div>
          <div style={{ fontSize: fs2 }}>{getArabicDay(basraTime.getDay())} {getGregorianDate(basraTime)}</div>
        </div>
      </div>
    </div>
  );
}
