interface SocialIcon {
  name: string;
  nameAr: string;
  icon: string;
  url?: string;
  action?: string;
}

const socialIcons: SocialIcon[] = [
  { name: 'registration', nameAr: 'التسجيل', icon: 'https://nael.top/1/registration.png', action: 'register' },
  { name: 'CallMe', nameAr: 'اتصل بي', icon: 'https://nael.top/1/CallMe.png', action: 'call' },
  { name: 'MessageMe', nameAr: 'راسلني', icon: 'https://nael.top/1/MessageMe.png', action: 'message' },
  { name: 'SendMail', nameAr: 'البريد', icon: 'https://nael.top/1/SendMail.png', url: 'mailto:info@nael.top' },
  { name: 'WhatsApp', nameAr: 'واتساب', icon: 'https://nael.top/1/WhatsApp.png', url: 'https://wa.me/9647707322220' },
  { name: 'Facebook Messenger', nameAr: 'ماسنجر', icon: 'https://nael.top/1/Facebook%20Messenger.png', url: 'https://m.me/nael.top' },
  { name: 'Facebook', nameAr: 'فيسبوك', icon: 'https://nael.top/1/Facebook.png', url: 'https://facebook.com/nael.top' },
  { name: 'Instagram', nameAr: 'انستغرام', icon: 'https://nael.top/1/Instagram.png', url: 'https://instagram.com/nael.top' },
  { name: 'Telegram', nameAr: 'تيليغرام', icon: 'https://nael.top/1/Telegram.png', url: 'https://t.me/naeltop' },
  { name: 'XTwitter', nameAr: 'إكس', icon: 'https://nael.top/1/XTwitter.png', url: 'https://x.com/naeltop' },
  { name: 'TikTok', nameAr: 'تيك توك', icon: 'https://nael.top/1/TikTok.png', url: 'https://tiktok.com/@naeltop' },
  { name: 'YouTube', nameAr: 'يوتيوب', icon: 'https://nael.top/1/YouTube.png', url: 'https://youtube.com/@naeltop' },
  { name: 'Threads', nameAr: 'ثريدز', icon: 'https://nael.top/1/Threads.png', url: 'https://threads.net/@naeltop' },
  { name: 'SnapChat', nameAr: 'سناب شات', icon: 'https://nael.top/1/SnapChat.png', url: 'https://snapchat.com/add/naeltop' },
  { name: 'LinkedIn', nameAr: 'لينكد إن', icon: 'https://nael.top/1/LinkedIn.png', url: 'https://linkedin.com/in/naeltop' },
];

interface Props {
  onAction: (action: string) => void;
}

export default function SocialIcons({ onAction }: Props) {
  const handleClick = (icon: SocialIcon) => {
    if (icon.action) {
      onAction(icon.action);
    } else if (icon.url) {
      window.open(icon.url, '_blank');
    }
  };

  // Triple the icons for seamless infinite scroll
  const tripled = [...socialIcons, ...socialIcons, ...socialIcons];

  return (
    <div className="social-ticker-wrap">
      <div
        className="social-ticker-track"
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = 'paused'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = 'running'; }}
      >
        {tripled.map((icon, i) => (
          <div
            key={i}
            className="social-ticker-item"
            onClick={() => handleClick(icon)}
          >
            <span className="social-ticker-label">{icon.nameAr}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
