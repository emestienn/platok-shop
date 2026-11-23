import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import useLanguageStore, { L } from '../store/languageStore.js';

const stores = [
  {
    key: 'chorsu',
    image: '/images/store.png',
    nameRu: 'Чорсу / Фунча',
    nameEn: 'Chorsu / Guncha',
    nameUz: "Cho\'rsu / G'uncha",
    labelRu: 'Рынок Чорсу',
    labelEn: 'Chorsu Bazaar',
    labelUz: 'Cho\'rsu bozori',
    addressRu: 'Рынок Чорсу, Фунча павильон, Ташкент',
    addressEn: 'Chorsu Bazaar, Guncha pavilion, Tashkent',
    addressUz: 'Cho\'rsu bozori, Funcha pavilon, Toshkent',
    phone: '+998 90 XXX XX XX',
    hoursRu: 'Пн–Сб: 09:00–19:00',
    hoursEn: 'Mon–Sat: 09:00–19:00',
    hoursUz: 'Du–Sha: 09:00–19:00',
    mapsUrl: 'https://maps.google.com/?q=Chorsu+Bazaar+Tashkent',
    yandexUrl: 'https://yandex.uz/maps/?text=Chorsu+Bazaar+Tashkent',
    fallback: 'from-pink-300 to-pink-400',
  },
  {
    key: 'yunusabad',
    image: '/images/store.png',
    nameRu: 'Юнусабад',
    nameEn: 'Yunusabad',
    nameUz: 'Yunusobod',
    labelRu: 'ТЦ Юнусабад',
    labelEn: 'Yunusabad Shopping Center',
    labelUz: 'Yunusobod savdo markazi',
    addressRu: 'Юнусабадский район, ТЦ, Ташкент',
    addressEn: 'Yunusabad district, shopping center, Tashkent',
    addressUz: 'Yunusobod tumani, savdo markazi, Toshkent',
    phone: '+998 90 XXX XX XX',
    hoursRu: 'Пн–Сб: 09:00–19:00',
    hoursEn: 'Mon–Sat: 09:00–19:00',
    hoursUz: 'Du–Sha: 09:00–19:00',
    mapsUrl: 'https://maps.google.com/?q=Yunusabad+Tashkent',
    yandexUrl: 'https://yandex.uz/maps/?text=Yunusabad+Tashkent',
    fallback: 'from-gold-400 to-gold-500',
  },
  {
    key: 'abu_sahiy',
    image: '/images/store.png',
    nameRu: 'Абу Сахий',
    nameEn: 'Abu Sahiy',
    nameUz: 'Abu Sahiy',
    labelRu: 'Рынок Абу Сахий',
    labelEn: 'Abu Sahiy Market',
    labelUz: 'Abu Sahiy bozori',
    addressRu: 'Рынок Абу Сахий, Ташкент',
    addressEn: 'Abu Sahiy Market, Tashkent',
    addressUz: 'Abu Sahiy bozori, Toshkent',
    phone: '+998 90 XXX XX XX',
    hoursRu: 'Пн–Сб: 09:00–18:00',
    hoursEn: 'Mon–Sat: 09:00–18:00',
    hoursUz: 'Du–Sha: 09:00–18:00',
    mapsUrl: 'https://maps.google.com/?q=Abu+Sahiy+Bazaar+Tashkent',
    yandexUrl: 'https://yandex.uz/maps/?text=Abu+Sahiy+Tashkent',
    fallback: 'from-charcoal-500 to-charcoal-700',
  },
];

export default function Stores() {
  const { t, lang } = useLanguageStore();

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="bg-luxury-gradient border-b border-pink-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="badge-luxury bg-pink-50 text-pink-500 border border-pink-200 mb-4">
            <MapPin size={14} /> {L('Ташкент', 'Toshkent', 'Tashkent')}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal-800 mt-4">
            {t('stores.title')}
          </h1>
          <div className="gold-divider" />
          <p className="section-subtitle">{t('stores.subtitle')}</p>
        </div>
      </div>

      {/* Store cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-6 md:gap-8">
          {stores.map((store, i) => (
            <motion.div
              key={store.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-3xl shadow-luxury overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image left panel */}
                <div className={`relative md:w-64 flex-shrink-0 min-h-48 md:min-h-0 overflow-hidden bg-gradient-to-br ${store.fallback}`}>
                  <img
                    src={store.image}
                    alt={L(store.nameRu, store.nameUz, store.nameEn)}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  {/* Scrim overlay — darker at bottom for legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/30 to-transparent" />
                  {/* Name */}
                  <div className="relative z-10 h-full flex flex-col justify-end p-5 min-h-48">
                    <p className="text-[11px] text-white/60 font-medium uppercase tracking-widest mb-1">
                      {L(store.labelRu, store.labelUz, store.labelEn)}
                    </p>
                    <h2 className="font-serif text-xl text-white leading-snug drop-shadow">
                      {L(store.nameRu, store.nameUz, store.nameEn)}
                    </h2>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 p-6 md:p-8">
                  <div className="grid sm:grid-cols-2 gap-5 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0">
                        <MapPin size={16} className="text-pink-400" />
                      </div>
                      <div>
                        <p className="text-xs text-charcoal-400 font-medium mb-1 uppercase tracking-wide">{L('Адрес', 'Manzil', 'Address')}</p>
                        <p className="text-charcoal-700 text-sm leading-relaxed">
                          {L(store.addressRu, store.addressUz, store.addressEn)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0">
                        <Phone size={16} className="text-pink-400" />
                      </div>
                      <div>
                        <p className="text-xs text-charcoal-400 font-medium mb-1 uppercase tracking-wide">{L('Телефон', 'Telefon', 'Phone')}</p>
                        <a href={`tel:${store.phone}`} className="text-charcoal-700 text-sm hover:text-pink-500 transition-colors">
                          {store.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0">
                        <Clock size={16} className="text-pink-400" />
                      </div>
                      <div>
                        <p className="text-xs text-charcoal-400 font-medium mb-1 uppercase tracking-wide">{t('stores.hours')}</p>
                        <p className="text-charcoal-700 text-sm">
                          {L(store.hoursRu, store.hoursUz, store.hoursEn)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Map buttons */}
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={store.yandexUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-[#FC3F1D]/10 text-[#FC3F1D] hover:bg-[#FC3F1D]/20 rounded-xl text-sm font-medium transition-colors"
                    >
                      <Navigation size={15} />
                      {L('Яндекс Карты', 'Yandex Xaritalar', 'Yandex Maps')}
                    </a>
                    <a
                      href={store.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-charcoal-50 text-charcoal-700 hover:bg-charcoal-100 rounded-xl text-sm font-medium transition-colors"
                    >
                      <Navigation size={15} />
                      Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center bg-luxury-gradient rounded-3xl p-10 border border-pink-100"
        >
          <h3 className="font-serif text-2xl text-charcoal-800 mb-2">{L('Хотите заказать доставку?', 'Yetkazib berishga buyurtma bermoqchimisiz?', 'Want home delivery?')}</h3>
          <p className="text-charcoal-400 mb-6">{L('Доставляем по всему Ташкенту. Бесплатно при заказе от 500 000 UZS.', "Butun Toshkent bo'ylab yetkazib beramiz. 500 000 UZS dan ortiq buyurtmalarga bepul.", 'We deliver across Tashkent. Free on orders over 500,000 UZS.')}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="https://t.me/luxury_platok" target="_blank" rel="noopener noreferrer" className="btn-primary">
              {L('Написать в Telegram', 'Telegramga yozish', 'Message us on Telegram')}
            </a>
            <a href="/products" className="btn-outline">
              {t('home.cta_btn')}
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
