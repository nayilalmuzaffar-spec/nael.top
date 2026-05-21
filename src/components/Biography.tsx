import { useState } from 'react';
import { Award, Globe, BookOpen, Camera, Users, Star } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const awards = [
  { title: 'جائزة الشعر العربي', year: '2019', desc: 'جائزة تقديرية من اتحاد الأدباء العرب للإبداع الشعري' },
  { title: 'جائزة المبدعين العراقيين', year: '2020', desc: 'تكريم من وزارة الثقافة العراقية للمساهمة في الحركة الأدبية' },
  { title: 'جائزة القصيدة العربية', year: '2021', desc: 'المركز الأول في مسابقة القصيدة العربية الدولية' },
  { title: 'وسام الإبداع الثقافي', year: '2022', desc: 'منح وسام الإبداع من المنظمة العربية للثقافة والفنون' },
  { title: 'جائزة نجلاء للشعر', year: '2023', desc: 'جائزة خاصة للتميز في الشعر العربي المعاصر' },
];

const localParticipations = [
  { title: 'مهرجان بغداد الدولي للشعر', year: '2018', desc: 'مشاركة كشاعر ضيف في مهرجان بغداد الدولي' },
  { title: 'ملتقى البصرة الثقافي', year: '2019', desc: 'تقديم ورقة نقدية في ملتقى البصرة الثقافي السنوي' },
  { title: 'مهرجان المربد', year: '2020', desc: 'مشاركة فاعلة في فعاليات مهرجان المربد' },
  { title: 'مؤتمر الأدباء العراقيين', year: '2021', desc: 'المشاركة في المؤتمر السنوي للأدباء والكتاب العراقيين' },
  { title: 'مهرجان كربلاء للشعر', year: '2022', desc: 'إلقاء قصيدة الافتتاح في مهرجان كربلاء للشعر الحسيني' },
];

const internationalParticipations = [
  { title: 'مهرجان الشعر العالمي - لندن', year: '2019', desc: 'تمثيل العراق في مهرجان الشعر العالمي بلندن' },
  { title: 'ملتقى الشعراء العرب - القاهرة', year: '2020', desc: 'المشاركة في ملتقى الشعراء العرب بالقاهرة' },
  { title: 'مهرجان جرش - الأردن', year: '2021', desc: 'مشاركة في فعاليات مهرجان جرش للثقافة والفنون' },
  { title: 'معرض الكتاب الدولي - فرانكفورت', year: '2022', desc: 'توقيع ديوان شعري في معرض فرانكفورت الدولي للكتاب' },
  { title: 'مهرجان الشعر العربي - تونس', year: '2023', desc: 'ضيف شرف في مهرجان الشعر العربي بتونس العاصمة' },
];

const featuredPoems = [
  { title: 'أنا العراق', excerpt: 'أنا العراقُ وفي عروقي دمُهْ\nوفي فؤادي نبضُ شمسِهِ وأنا' },
  { title: 'همسة وطن', excerpt: 'همسةٌ من شفاهِ الوطنِ\nتوقظُ في الروحِ ألفَ أماني' },
  { title: 'أحبك', excerpt: 'أحبكِ حتى يذوبَ القلبُ\nمن شدةِ الحبِّ والأشواقِ' },
  { title: 'الله أكبر', excerpt: 'اللهُ أكبرُ في كلِّ الذرى\nاللهُ أكبرُ في كلِّ السماء' },
  { title: 'الحقيقة', excerpt: 'ما الحقُّ إلا نورٌ يسعى\nفي ظلامِ الليلِ يهدي الأنام' },
  { title: 'الشمس', excerpt: 'يا شمسُ يا نورَ عيني\nأشرقي أبداً على دنياي' },
];

const photos = Array.from({ length: 20 }, (_, i) => ({
  url: `https://images.pexels.com/photos/${1010000 + i * 137}/pexels-photo-${1010000 + i * 137}.jpeg?auto=compress&cs=tinysrgb&w=400`,
  caption: `صورة ${i + 1}`,
}));

export default function Biography({ onBack }: Props) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div
      className="bio-page"
      style={{ backgroundImage: "url('https://nael.top/1/0.webp')" }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="fixed top-4 right-4 z-50 opacity-70 hover:opacity-100 transition-opacity"
      >
        <img src="https://nael.top/1/C.png" alt="عودة" className="w-10 h-10" />
      </button>

      {/* Page badge */}
      <div className="fixed top-1/2 -translate-y-1/2 right-2 z-40">
        <img src="https://nael.top/1/C2.png" alt="شارة" className="w-8 h-8" />
        <div className="vertical-text text-center mt-1">الصفحة 2 السيرة</div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Public Life */}
        <div className="bio-section">
          <h2><Users size={24} className="inline ml-2" />حياة الشاعر العامة</h2>
          <p>
            وُلد الشاعر نائل المظفر في مدينة البصرة، جنوب العراق، في بيئة أدبية وثقافية غنية.
            نشأ في كنف عائلة تهتم بالأدب والشعر، فتغذت روحه بالكلمة الطيبة والبيان العربي.
            عاش طفولته بين أزقة البصرة العتيقة، يستلهم من نخلها ونهرها وجوها الدافئ صوراً شعرية
            ظلت ترافقه طوال مسيرته الإبداعية. تلقى تعليمه الأولي في البصرة، ثم واصل مسيرته
            الأكاديمية حتى أصبح من أبرز الأصوات الشعرية في العراق والعالم العربي.
          </p>
        </div>

        {/* Literary Life */}
        <div className="bio-section">
          <h2><BookOpen size={24} className="inline ml-2" />حياته الأدبية</h2>
          <p>
            بدأ نائل المظفر كتابة الشعر في سنٍّ مبكرة، وتأثر بأساتذة الشعر العربي الكبار.
            تميز شعره بالعمق الفلسفي والجمال اللغوي، فجمع بين أصالة التراث وحداثة الرؤية.
            أصدر عدة دواوين شعرية لاقت اهتماماً واسعاً في الأوساط الأدبية، وشارك في مهرجانات
            شعرية عربية ودولية. يُعرف بقدرته على المزج بين القصيدة العمودية والشعر الحر،
            مما جعله صوتاً فريداً في المشهد الشعري المعاصر.
          </p>
        </div>

        {/* Awards */}
        <div className="bio-section">
          <h2><Award size={24} className="inline ml-2" />الجوائز التي حصل عليها</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {awards.map((award, i) => (
              <div
                key={i}
                className="info-card"
                onClick={() => toggleCard(`award-${i}`)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold" style={{ color: '#D4A843' }}>{award.title}</h3>
                  <span className="text-sm text-gray-400">{award.year}</span>
                </div>
                {expandedCard === `award-${i}` && (
                  <p className="text-sm text-gray-300 mt-2">{award.desc}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Local Participations */}
        <div className="bio-section">
          <h2><Star size={24} className="inline ml-2" />مشاركاته المحلية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localParticipations.map((p, i) => (
              <div
                key={i}
                className="info-card"
                onClick={() => toggleCard(`local-${i}`)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold" style={{ color: '#D4A843' }}>{p.title}</h3>
                  <span className="text-sm text-gray-400">{p.year}</span>
                </div>
                {expandedCard === `local-${i}` && (
                  <p className="text-sm text-gray-300 mt-2">{p.desc}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* International Participations */}
        <div className="bio-section">
          <h2><Globe size={24} className="inline ml-2" />مشاركاته الدولية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {internationalParticipations.map((p, i) => (
              <div
                key={i}
                className="info-card"
                onClick={() => toggleCard(`intl-${i}`)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold" style={{ color: '#D4A843' }}>{p.title}</h3>
                  <span className="text-sm text-gray-400">{p.year}</span>
                </div>
                {expandedCard === `intl-${i}` && (
                  <p className="text-sm text-gray-300 mt-2">{p.desc}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Featured Poems */}
        <div className="bio-section">
          <h2><BookOpen size={24} className="inline ml-2" />أهم قصائده</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredPoems.map((poem, i) => (
              <div
                key={i}
                className="poem-card"
                onClick={() => toggleCard(`poem-${i}`)}
              >
                <h3>{poem.title}</h3>
                {expandedCard === `poem-${i}` ? (
                  <p className="whitespace-pre-line">{poem.excerpt}</p>
                ) : (
                  <p className="text-gray-500 text-sm">انقر لقراءة المقتطف</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="bio-section">
          <h2><Camera size={24} className="inline ml-2" />معرض الصور</h2>
          <div className="photo-grid">
            {photos.map((photo, i) => (
              <img
                key={i}
                src={photo.url}
                alt={photo.caption}
                loading="lazy"
              />
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-4 text-center">سيتم استبدال الروابط بالصور الحقيقية لاحقاً</p>
        </div>
      </div>
    </div>
  );
}
