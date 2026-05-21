import { useState } from 'react';
import { X, Phone, MessageSquare, Mail, Send } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    country: '',
    interest: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('تم التسجيل بنجاح! شكراً لانضمامك');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold" style={{ color: '#D4A843' }}>التسجيل في الموقع</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">الاسم الكامل</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-[#D4A843] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-[#D4A843] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">رقم الهاتف</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-[#D4A843] focus:outline-none transition-colors"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">كلمة المرور</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-[#D4A843] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">تأكيد كلمة المرور</label>
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-[#D4A843] focus:outline-none transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">المدينة</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-[#D4A843] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">البلد</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-[#D4A843] focus:outline-none transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">الاهتمام</label>
            <select
              value={form.interest}
              onChange={(e) => setForm({ ...form, interest: e.target.value })}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-[#D4A843] focus:outline-none transition-colors"
            >
              <option value="">اختر...</option>
              <option value="poetry">الشعر</option>
              <option value="literature">الأدب</option>
              <option value="culture">الثقافة</option>
              <option value="art">الفن</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #D4A843, #A07C2E)', color: '#1a1a1a' }}
          >
            تسجيل
          </button>
        </form>
      </div>
    </div>
  );
}

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CallModal({ isOpen, onClose }: CallModalProps) {
  if (!isOpen) return null;

  const phone = '+9647707322220';

  const methods = [
    { name: 'اتصال مباشر', icon: <Phone size={20} />, action: `tel:${phone}` },
    { name: 'واتساب', icon: <MessageSquare size={20} />, action: `https://wa.me/9647707322220` },
    { name: 'فيسبوك ماسنجر', icon: <MessageSquare size={20} />, action: 'https://m.me/nael.top' },
    { name: 'تيليغرام', icon: <Send size={20} />, action: 'https://t.me/naeltop' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold" style={{ color: '#D4A843' }}>اتصل بي</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-300 mb-4">اختر وسيلة الاتصال</p>
        <div className="space-y-3">
          {methods.map((method, i) => (
            <a
              key={i}
              href={method.action}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn"
            >
              <span style={{ color: '#D4A843' }}>{method.icon}</span>
              <span>{method.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MessageModal({ isOpen, onClose }: MessageModalProps) {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const methods = [
    { name: 'واتساب', icon: <MessageSquare size={20} />, action: `https://wa.me/9647707322220?text=${encodeURIComponent(message)}` },
    { name: 'فيسبوك ماسنجر', icon: <MessageSquare size={20} />, action: 'https://m.me/nael.top' },
    { name: 'تيليغرام', icon: <Send size={20} />, action: `https://t.me/naeltop` },
    { name: 'البريد الإلكتروني', icon: <Mail size={20} />, action: `mailto:info@nael.top?body=${encodeURIComponent(message)}` },
  ];

  const handleSend = (action: string) => {
    window.open(action, '_blank');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold" style={{ color: '#D4A843' }}>راسلني</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-300 mb-4">شكراً لاهتمامك، أرسل رسالتك وسنرد عليك فور قراءتها</p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#D4A843] focus:outline-none transition-colors mb-4 min-h-[100px] resize-y"
        />
        <p className="text-sm text-gray-400 mb-3">اختر وسيلة المراسلة</p>
        <div className="space-y-3">
          {methods.map((method, i) => (
            <button
              key={i}
              onClick={() => handleSend(method.action)}
              className="contact-btn"
            >
              <span style={{ color: '#D4A843' }}>{method.icon}</span>
              <span>{method.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface IndexModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IndexModal({ isOpen, onClose }: IndexModalProps) {
  if (!isOpen) return null;

  const sections = [
    'الرئيسة', 'الوطنية', 'العاطفية', 'الاجتماعية', 'الدينية',
    'الرثائية', 'الفلسفية', 'الوصفية', 'الحكمية', 'المناسبات',
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="index-popup" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold" style={{ color: '#D4A843' }}>فهرست القصائد</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section}>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#D4A843' }}>{section}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Array.from({ length: 40 }, (_, i) => (
                  <button
                    key={i}
                    className="text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded px-2 py-1 transition-colors text-right"
                  >
                    {section} {i + 1}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
