// Adds catalogue products and English names WITHOUT deleting anything.
// Safe to run many times: new products are inserted only if their slug
// doesn't exist yet; existing products only get missing English text.
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const img = (id) => `https://images.unsplash.com/photo-${id}?w=900&q=80&auto=format&fit=crop`;

// English text for the original sample products
const englishForExisting = {
  'shelkovyy-platok-roza': {
    name: 'Silk Scarf "Rose"',
    description: 'A luxurious natural silk scarf with an elegant floral print. Perfect for special occasions.',
  },
  'shifonovyy-khidzhab-nezhnost': {
    name: 'Chiffon Hijab "Tenderness"',
    description: 'An airy hijab made of premium chiffon. Breathable fabric — ideal for the hot Tashkent climate.',
  },
  'zhorzhetovaya-shal-elegant': {
    name: 'Georgette Shawl "Elegant"',
    description: 'A luxurious georgette shawl with a golden border. A flawless choice for evening looks.',
  },
  'khlopkovyy-platok-leto': {
    name: 'Cotton Scarf "Summer"',
    description: 'A light cotton scarf with a geometric print. Comfortable for everyday wear on hot days.',
  },
};

const tiers = (retail) => [
  { minQuantity: 10, maxQuantity: 29, pricePerUnit: Math.round(retail * 0.8 / 1000) * 1000, label: '10-29' },
  { minQuantity: 30, maxQuantity: 99, pricePerUnit: Math.round(retail * 0.7 / 1000) * 1000, label: '30-99' },
  { minQuantity: 100, pricePerUnit: Math.round(retail * 0.6 / 1000) * 1000, label: '100+' },
];

const newProducts = [
  {
    name: { ru: 'Хиджаб из модала "Классика"', uz: 'Modal hijob "Klassika"', en: 'Modal Hijab "Classic"' },
    description: {
      ru: 'Мягкий хиджаб из модала, который не скользит и держит форму весь день.',
      uz: "Kun bo'yi shaklini saqlaydigan, sirpanmaydigan yumshoq modal hijob.",
      en: 'A soft modal hijab that does not slip and keeps its shape all day.',
    },
    slug: 'modal-hijab-classic', sku: 'LP-MDL-002', category: 'hijab', material: 'modal', pattern: 'solid',
    colors: [
      { name: 'Молочный', hex: '#F3EDE2', images: [], stock: 30 },
      { name: 'Пудровый', hex: '#E7C9C1', images: [], stock: 24 },
      { name: 'Серый', hex: '#9A9A9A', images: [], stock: 18 },
    ],
    sizes: [{ label: '70×180 см', dimensions: '70x180' }],
    images: [img('1585728748176-455ac5eed962')],
    retailPrice: 89000, compareAtPrice: 110000, stock: 72,
    isBestSeller: true, isFeatured: true, badges: ['premium', 'sale'], tags: ['modal', 'hijab', 'classic'],
  },
  {
    name: { ru: 'Шифоновый хиджаб "Сапфир"', uz: 'Shifon hijob "Sapfir"', en: 'Chiffon Hijab "Sapphire"' },
    description: {
      ru: 'Насыщенный синий шифон с лёгким блеском. Подходит для праздников и работы.',
      uz: "Yengil yaltiroq to'q ko'k shifon. Bayram va ish uchun mos.",
      en: 'Rich blue chiffon with a light sheen. Works for celebrations and the office.',
    },
    slug: 'chiffon-hijab-sapphire', sku: 'LP-CHF-003', category: 'hijab', material: 'chiffon', pattern: 'solid',
    colors: [
      { name: 'Синий', hex: '#2C4A8A', images: [], stock: 26 },
      { name: 'Голубой', hex: '#8FB3D9', images: [], stock: 20 },
    ],
    images: [img('1581430420317-48eeec37e928'), img('1730454626266-e6d47134c044')],
    retailPrice: 98000, stock: 46,
    isNewArrival: true, badges: ['breathable', 'new'], tags: ['chiffon', 'hijab', 'blue'],
  },
  {
    name: { ru: 'Джерси хиджаб "Комфорт"', uz: 'Jersi hijob "Komfort"', en: 'Jersey Hijab "Comfort"' },
    description: {
      ru: 'Эластичный трикотаж для повседневной носки, учёбы и спорта. Не требует булавок.',
      uz: "Kundalik kiyish, o'qish va sport uchun elastik trikotaj. To'g'nog'ich kerak emas.",
      en: 'Stretchy jersey for everyday wear, study and sport. No pins needed.',
    },
    slug: 'jersey-hijab-comfort', sku: 'LP-JRS-001', category: 'hijab', material: 'jersey', pattern: 'solid',
    colors: [
      { name: 'Чёрный', hex: '#1A1A1A', images: [], stock: 50 },
      { name: 'Бежевый', hex: '#D4B896', images: [], stock: 38 },
      { name: 'Оливковый', hex: '#6B7045', images: [], stock: 22 },
    ],
    images: [img('1643326217693-d046e41815be')],
    retailPrice: 65000, stock: 110,
    isBestSeller: true, badges: ['breathable'], tags: ['jersey', 'hijab', 'everyday'],
  },
  {
    name: { ru: 'Хиджаб "Лаванда"', uz: 'Hijob "Lavanda"', en: 'Hijab "Lavender"' },
    description: {
      ru: 'Нежный лавандовый оттенок из вискозы. Лёгкий и приятный к телу.',
      uz: "Viskozadan nozik lavanda rangidagi hijob. Yengil va tanaga yoqimli.",
      en: 'A gentle lavender shade in viscose. Light and soft against the skin.',
    },
    slug: 'hijab-lavender', sku: 'LP-VSC-002', category: 'hijab', material: 'viscose', pattern: 'solid',
    colors: [{ name: 'Лавандовый', hex: '#9C7BB5', images: [], stock: 34 }],
    images: [img('1693985007521-e08e64770947')],
    retailPrice: 79000, stock: 34,
    isNewArrival: true, badges: ['new'], tags: ['viscose', 'hijab', 'lavender'],
  },
  {
    name: { ru: 'Платок с орнаментом "Самарканд"', uz: 'Naqshli ro\'mol "Samarqand"', en: 'Ornament Scarf "Samarkand"' },
    description: {
      ru: 'Платок с восточным орнаментом в синих тонах, вдохновлённый узорами Самарканда.',
      uz: "Samarqand naqshlaridan ilhomlangan, ko'k tusdagi sharqona naqshli ro'mol.",
      en: 'A scarf with an oriental ornament in blue tones, inspired by the patterns of Samarkand.',
    },
    slug: 'ornament-scarf-samarkand', sku: 'LP-SLK-004', category: 'platok', material: 'silk', pattern: 'patterned',
    colors: [{ name: 'Синий орнамент', hex: '#2E4C7D', images: [], stock: 15 }],
    sizes: [{ label: '90×90 см', dimensions: '90x90' }, { label: '110×110 см', dimensions: '110x110' }],
    images: [img('1783853849972-2315a6ad181d')],
    retailPrice: 210000, compareAtPrice: 250000, stock: 15,
    isFeatured: true, isBestSeller: true, badges: ['premium', 'limited'], tags: ['silk', 'ornament', 'samarkand'],
  },
  {
    name: { ru: 'Шёлковый платок "Виолетта"', uz: 'Ipak ro\'mol "Violetta"', en: 'Silk Scarf "Violetta"' },
    description: {
      ru: 'Фиолетовый шёлк с узором из цепочек — яркий акцент для вечернего образа.',
      uz: "Zanjir naqshli binafsha ipak — kechki libos uchun yorqin urg'u.",
      en: 'Purple silk with a chain print — a bold accent for an evening look.',
    },
    slug: 'silk-scarf-violetta', sku: 'LP-SLK-005', category: 'platok', material: 'silk', pattern: 'patterned',
    colors: [{ name: 'Фиолетовый', hex: '#5B2A86', images: [], stock: 12 }],
    sizes: [{ label: '90×90 см', dimensions: '90x90' }],
    images: [img('1551028442-ee84b4d3a50a')],
    retailPrice: 195000, stock: 12,
    isNewArrival: true, badges: ['exclusive', 'premium'], tags: ['silk', 'purple', 'evening'],
  },
  {
    name: { ru: 'Шёлковый платок "Жемчуг"', uz: 'Ipak ro\'mol "Marvarid"', en: 'Silk Scarf "Pearl"' },
    description: {
      ru: 'Однотонный шёлк жемчужного цвета с мягким блеском. Универсальная классика.',
      uz: "Yumshoq yaltiroq marvarid rangidagi bir xil ipak. Universal klassika.",
      en: 'Solid pearl-coloured silk with a soft sheen. A versatile classic.',
    },
    slug: 'silk-scarf-pearl', sku: 'LP-SLK-006', category: 'platok', material: 'silk', pattern: 'solid',
    colors: [
      { name: 'Жемчужный', hex: '#EAE4D9', images: [], stock: 20 },
      { name: 'Шампань', hex: '#E5D3B3', images: [], stock: 14 },
    ],
    images: [img('1606259458027-54d2a728b6ab')],
    retailPrice: 175000, stock: 34,
    badges: ['premium'], tags: ['silk', 'pearl', 'classic'],
  },
  {
    name: { ru: 'Платок "Подсолнух"', uz: 'Ro\'mol "Kungaboqar"', en: 'Scarf "Sunflower"' },
    description: {
      ru: 'Солнечный жёлто-оранжевый платок из лёгкого шифона для летних прогулок.',
      uz: "Yozgi sayrlar uchun yengil shifondan quyoshli sariq-to'q sariq ro'mol.",
      en: 'A sunny yellow-orange scarf in light chiffon for summer walks.',
    },
    slug: 'scarf-sunflower', sku: 'LP-CHF-004', category: 'platok', material: 'chiffon', pattern: 'solid',
    colors: [{ name: 'Жёлтый', hex: '#E9A23B', images: [], stock: 27 }],
    images: [img('1677478863154-55ecce8c7536')],
    retailPrice: 72000, compareAtPrice: 85000, stock: 27,
    isNewArrival: true, badges: ['sale', 'breathable'], tags: ['chiffon', 'yellow', 'summer'],
  },
  {
    name: { ru: 'Шаль с цветочным принтом "Бахор"', uz: 'Gulli shal "Bahor"', en: 'Floral Shawl "Bahor"' },
    description: {
      ru: 'Тёплая шаль с бахромой и крупным цветочным принтом. Для прохладных вечеров.',
      uz: "Popukli va yirik gul naqshli iliq shal. Salqin kechalar uchun.",
      en: 'A warm fringed shawl with a large floral print. Made for cool evenings.',
    },
    slug: 'floral-shawl-bahor', sku: 'LP-VSC-003', category: 'shawl', material: 'viscose', pattern: 'floral',
    colors: [{ name: 'Чёрный с цветами', hex: '#2B2B2B', images: [], stock: 16 }],
    sizes: [{ label: '70×200 см', dimensions: '70x200' }],
    images: [img('1759355346769-bc38a7c3e5e5')],
    retailPrice: 155000, stock: 16,
    isFeatured: true, badges: ['limited'], tags: ['shawl', 'floral', 'fringe'],
  },
  {
    name: { ru: 'Шерстяная шаль "Зимний сад"', uz: 'Jun shal "Qishki bog\'"', en: 'Warm Shawl "Winter Garden"' },
    description: {
      ru: 'Мягкая тёплая шаль с бахромой в зелёных и серых тонах.',
      uz: "Yashil va kulrang tusdagi popukli yumshoq iliq shal.",
      en: 'A soft, warm fringed shawl in green and grey tones.',
    },
    slug: 'warm-shawl-winter-garden', sku: 'LP-OTH-001', category: 'shawl', material: 'other', pattern: 'solid',
    colors: [
      { name: 'Зелёный', hex: '#9BAF3A', images: [], stock: 14 },
      { name: 'Серый', hex: '#8A8D91', images: [], stock: 11 },
    ],
    images: [img('1457545195570-67f207084966')],
    retailPrice: 168000, stock: 25,
    isBestSeller: true, badges: ['premium'], tags: ['shawl', 'warm', 'winter'],
  },
  {
    name: { ru: 'Шарф "Олива"', uz: 'Sharf "Zaytun"', en: 'Neck Scarf "Olive"' },
    description: {
      ru: 'Однотонный шарф оливкового цвета из хлопка с мягкой фактурой.',
      uz: "Yumshoq teksturali paxtadan zaytun rangidagi bir xil sharf.",
      en: 'A solid olive neck scarf in soft-textured cotton.',
    },
    slug: 'neck-scarf-olive', sku: 'LP-CTN-002', category: 'scarf', material: 'cotton', pattern: 'solid',
    colors: [{ name: 'Оливковый', hex: '#6E7A3E', images: [], stock: 40 }],
    images: [img('1643312892626-80632ef6d7dc')],
    retailPrice: 58000, stock: 40,
    badges: ['breathable'], tags: ['cotton', 'scarf', 'olive'],
  },
  {
    name: { ru: 'Набор шарфов "Радуга"', uz: '"Kamalak" sharflar to\'plami', en: 'Scarf Set "Rainbow"' },
    description: {
      ru: 'Набор из 5 лёгких шарфов разных цветов — популярный выбор для подарка и опта.',
      uz: "Turli rangdagi 5 ta yengil sharf to'plami — sovg'a va ulgurji savdo uchun mashhur tanlov.",
      en: 'A set of 5 light scarves in different colours — a popular choice for gifts and wholesale.',
    },
    slug: 'scarf-set-rainbow', sku: 'LP-SET-001', category: 'scarf', material: 'viscose', pattern: 'solid',
    colors: [{ name: 'Ассорти', hex: '#C04A7A', images: [], stock: 60 }],
    images: [img('1571498521264-5fcaa7f8edf4'), img('1517472292914-9570a594783b')],
    retailPrice: 240000, compareAtPrice: 290000, stock: 60,
    isFeatured: true, isBestSeller: true, badges: ['sale', 'exclusive'], tags: ['set', 'gift', 'wholesale'],
  },
  {
    name: { ru: 'Хиджаб с принтом "Пейсли"', uz: '"Peysli" naqshli hijob', en: 'Paisley Print Hijab' },
    description: {
      ru: 'Хиджаб с классическим узором пейсли в синих тонах. Красиво драпируется.',
      uz: "Ko'k tusdagi klassik peysli naqshli hijob. Chiroyli taxlanadi.",
      en: 'A hijab with a classic paisley pattern in blue tones. Drapes beautifully.',
    },
    slug: 'paisley-print-hijab', sku: 'LP-VSC-004', category: 'hijab', material: 'viscose', pattern: 'patterned',
    colors: [{ name: 'Синий пейсли', hex: '#2D3E73', images: [], stock: 22 }],
    images: [img('1758888678560-e27fcd7e4ce4')],
    retailPrice: 92000, stock: 22,
    isNewArrival: true, badges: ['new'], tags: ['hijab', 'paisley', 'print'],
  },
  {
    name: { ru: 'Платок "Дымка"', uz: 'Ro\'mol "Tuman"', en: 'Scarf "Mist"' },
    description: {
      ru: 'Серо-голубой платок с мягким переходом цвета. Сочетается с любым образом.',
      uz: "Rangi yumshoq o'tadigan kulrang-havorang ro'mol. Har qanday libosga mos.",
      en: 'A grey-blue scarf with a soft colour gradient. Goes with any outfit.',
    },
    slug: 'scarf-mist', sku: 'LP-GRG-002', category: 'platok', material: 'georgette', pattern: 'abstract',
    colors: [{ name: 'Серо-голубой', hex: '#8E9AAB', images: [], stock: 19 }],
    images: [img('1677478989068-38a2f447ab44')],
    retailPrice: 118000, stock: 19,
    badges: ['breathable'], tags: ['georgette', 'scarf', 'grey'],
  },
].map((p) => ({ ...p, wholesaleTiers: tiers(p.retailPrice) }));


// Product photos (shop-style). Applied on every run so they stay in sync.
const productImages = {
  'modal-hijab-classic': ['1545266241-3516e2a6e016', '1550546094-9835463f9f71'],
  'chiffon-hijab-sapphire': ['1627359212239-3d82a215af75', '1676696706907-0e04665b80bd'],
  'jersey-hijab-comfort': ['1613611927458-3ddd4b0afdb9', '1613909707776-098e961198dc'],
  'hijab-lavender': ['1626497361649-81cc097e9bfd', '1617055407123-3d7130c1f940'],
  'paisley-print-hijab': ['1640154852340-9de73a0643a8'],
  'ornament-scarf-samarkand': ['1623832101624-ecd47c803527'],
  'silk-scarf-violetta': ['1551028442-ee84b4d3a50a'],
  'silk-scarf-pearl': ['1619043518800-7f14be467dca', '1606259457945-67dc66271ee6'],
  'scarf-sunflower': ['1620763050148-af058ab2fff0', '1613447895817-e617a4093f50'],
  'floral-shawl-bahor': ['1609803364911-9e275e5a2b44'],
  'warm-shawl-winter-garden': ['1789845137167-5a6fed517e65', '1527167598984-8802d8028eea'],
  'neck-scarf-olive': ['1527167598984-8802d8028eea'],
  'scarf-set-rainbow': ['1776127839720-c0ab710d9d37', '1545153252-0e2e698f0330'],
  'scarf-mist': ['1558027309-0844844295f7', '1594734415578-00fc9540929b'],
};

const run = async () => {
  await connectDB();

  let added = 0;
  for (const p of newProducts) {
    try {
      const res = await Product.updateOne({ slug: p.slug }, { $setOnInsert: p }, { upsert: true });
      if (res.upsertedCount) added++;
    } catch (err) {
      // e.g. an existing product already uses this SKU — keep it, skip ours
      console.warn(`skipped ${p.slug}: ${err.message}`);
    }
  }

  let translated = 0;
  for (const [slug, en] of Object.entries(englishForExisting)) {
    const res = await Product.updateOne(
      { slug, 'name.en': { $in: [null, ''] } },
      { $set: { 'name.en': en.name, 'description.en': en.description } }
    );
    translated += res.modifiedCount;
  }

  let photos = 0;
  for (const [slug, ids] of Object.entries(productImages)) {
    const res = await Product.updateOne({ slug }, { $set: { images: ids.map(img) } });
    photos += res.modifiedCount;
  }
  console.log(`🖼  Updated photos on ${photos} products`);

  // Give admin rights to the account in ADMIN_EMAIL (set in Render env vars)
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (adminEmail) {
    const res = await User.updateOne({ email: adminEmail }, { $set: { role: 'admin' } });
    console.log(res.matchedCount ? `👑 ${adminEmail} is now an admin` : `⚠️  No user found with email ${adminEmail}`);
  }

  console.log(`✨ Products: ${added} added, ${translated} existing translated to English`);
  await mongoose.disconnect();
};

run().catch((err) => {
  // Never block a deploy because of catalogue data
  console.error('addProducts skipped:', err.message);
  process.exit(0);
});
