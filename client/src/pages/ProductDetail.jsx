import { useState, useEffect } from 'react';
import { localText } from '../utils/localize.js';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Minus, Plus, ChevronRight, Star } from 'lucide-react';
import ProductImageGallery from '../components/product/ProductImageGallery.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import useCartStore from '../store/cartStore.js';
import useAuthStore from '../store/authStore.js';
import useLanguageStore, { L } from '../store/languageStore.js';
import { productsApi } from '../api/index.js';

const formatPrice = (n) => new Intl.NumberFormat('uz-UZ').format(n);

export default function ProductDetail() {
  const { slug } = useParams();
  const { t, lang } = useLanguageStore();
  const { addItem } = useCartStore();
  const { user, isWholesale } = useAuthStore();

  const [product, setProduct]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity]         = useState(1);
  const [activeTab, setActiveTab]       = useState('description');
  const [review, setReview]             = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmitting] = useState(false);
  const [added, setAdded]               = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await productsApi.getBySlug(slug);
        setProduct(data.product);
        setSelectedColor(data.product.colors?.[0] || null);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleAddToCart = () => {
    addItem(product, {
      color: selectedColor?.name,
      colorHex: selectedColor?.hex,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await productsApi.addReview(slug, review);
      const { data } = await productsApi.getBySlug(slug);
      setProduct(data.product);
      setReview({ rating: 5, comment: '' });
    } catch {
      /* handle gracefully */
    } finally {
      setSubmitting(false);
    }
  };

  const getWholesalePrice = (qty) => {
    if (!product?.wholesaleTiers?.length) return null;
    const tiers = [...product.wholesaleTiers].sort((a, b) => b.minQuantity - a.minQuantity);
    for (const tier of tiers) {
      if (qty >= tier.minQuantity) return tier.pricePerUnit;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-12">
        <div className="skeleton aspect-square rounded-3xl" />
        <div className="space-y-4">
          <div className="skeleton h-6 w-24 rounded" />
          <div className="skeleton h-10 w-3/4 rounded" />
          <div className="skeleton h-8 w-32 rounded" />
          <div className="skeleton h-24 rounded" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-5xl">😔</p>
        <h2 className="font-serif text-2xl text-charcoal-700">{L('Товар не найден', 'Mahsulot topilmadi', 'Product not found')}</h2>
        <Link to="/products" className="btn-primary">{L('Вернуться в каталог', 'Katalogga qaytish', 'Back to catalog')}</Link>
      </div>
    );
  }

  const name = localText(product.name, lang);
  const description = localText(product.description, lang);
  const galleryImages = selectedColor?.images?.length ? selectedColor.images : product.images;
  const wholesalePrice = isWholesale?.() ? getWholesalePrice(quantity) : null;

  const badgeColors = {
    premium:   'bg-gold-100 text-gold-600 border-gold-200',
    breathable:'bg-emerald-50 text-emerald-600 border-emerald-200',
    limited:   'bg-red-50 text-red-500 border-red-200',
    new:       'bg-pink-50 text-pink-500 border-pink-200',
  };

  return (
    <main>
      {/* Breadcrumb */}
      <div className="bg-luxury-gradient border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-charcoal-400">
            <Link to="/" className="hover:text-pink-500 transition-colors">{t('nav.home')}</Link>
            <ChevronRight size={14} />
            <Link to="/products" className="hover:text-pink-500 transition-colors">{t('nav.catalog')}</Link>
            <ChevronRight size={14} />
            <span className="text-charcoal-600 truncate max-w-[200px]">{name}</span>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <ProductImageGallery images={galleryImages} productName={name} />
          </motion.div>

          {/* Product info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Badges */}
            {product.badges?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {product.badges.map((b) => (
                  <span key={b} className={`badge-luxury border text-xs ${badgeColors[b] || 'bg-white text-charcoal-600 border-charcoal-200'}`}>
                    {t(`product.badges.${b}`)}
                  </span>
                ))}
              </div>
            )}

            <p className="text-xs text-charcoal-400 uppercase tracking-widest mb-2">
              {t(`filters.materials.${product.material}`) || product.material}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-charcoal-800 mb-3 leading-tight">{name}</h1>

            {/* Rating */}
            {product.numReviews > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.round(product.rating) ? '#C9A96E' : 'none'} stroke={i < Math.round(product.rating) ? '#C9A96E' : '#D1D1D1'} />
                  ))}
                </div>
                <span className="text-sm text-charcoal-400">{product.rating.toFixed(1)} ({product.numReviews} {L('отзывов', 'sharh', 'reviews')})</span>
              </div>
            )}

            {/* Price */}
            <div className="bg-pink-50/50 rounded-2xl p-5 mb-6">
              <div className="flex items-baseline gap-3">
                {product.compareAtPrice > product.retailPrice && (
                  <span className="text-charcoal-400 line-through text-lg">{formatPrice(product.compareAtPrice)} UZS</span>
                )}
                <span className="text-pink-500 font-bold text-3xl">{formatPrice(product.retailPrice)}</span>
                <span className="text-charcoal-400 text-sm">UZS</span>
              </div>

              {wholesalePrice && (
                <div className="mt-3 pt-3 border-t border-pink-100">
                  <p className="text-xs text-charcoal-400 mb-1">{L('Ваша оптовая цена:', 'Sizning ulgurji narxingiz:', 'Your wholesale price:')}</p>
                  <p className="text-gold-500 font-bold text-xl">{formatPrice(wholesalePrice)} UZS/{t('common.pieces')}</p>
                  <p className="text-xs text-charcoal-400 mt-0.5">
                    {L('Экономия', 'Tejash', 'You save')}: {formatPrice(product.retailPrice - wholesalePrice)} UZS/{t('common.pieces')}
                  </p>
                </div>
              )}

              {!isWholesale?.() && product.wholesaleTiers?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-pink-100">
                  <p className="text-xs text-charcoal-400 mb-2">{L('Оптовые цены:', 'Ulgurji narxlar:', 'Wholesale prices:')}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.wholesaleTiers.map((tier) => (
                      <span key={tier.minQuantity} className="text-xs bg-white border border-gold-200 text-gold-600 rounded-full px-3 py-1">
                        {t('common.from')} {tier.minQuantity} {t('common.pieces')} → {formatPrice(tier.pricePerUnit)} UZS
                      </span>
                    ))}
                  </div>
                  <Link to="/register" className="text-xs text-pink-400 hover:underline mt-2 block">
                    {t('footer.become_wholesale')} →
                  </Link>
                </div>
              )}
            </div>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-medium text-charcoal-700 mb-2.5">
                  {t('product.select_color')}: <span className="text-pink-500 font-normal">{selectedColor?.name}</span>
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      title={color.name}
                      onClick={() => setSelectedColor(color)}
                      className="w-9 h-9 rounded-full border-[3px] transition-all hover:scale-110 shadow-sm"
                      style={{
                        backgroundColor: color.hex,
                        borderColor: selectedColor?.name === color.name ? '#E8A2B5' : 'transparent',
                        outline: selectedColor?.name === color.name ? '2px solid #FDF2F5' : 'none',
                      }}
                    />
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-xs text-charcoal-400 mt-2">
                    {t('product.in_stock')}: {selectedColor.stock} {t('common.pieces')}
                  </p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm font-medium text-charcoal-700 mb-2.5">{t('product.quantity')}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-charcoal-50 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-pink-50 hover:text-pink-500 transition-all"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-semibold text-charcoal-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-pink-50 hover:text-pink-500 transition-all"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-xs text-charcoal-400">
                  {product.stock > 0 ? `${product.stock} ${t('common.pieces')} — ${t('product.in_stock')}` : t('product.out_of_stock')}
                </span>
              </div>
            </div>

            {/* Add to cart */}
            <div className="flex gap-3 mb-8">
              <motion.button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                whileTap={{ scale: 0.97 }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-base transition-all ${
                  added
                    ? 'bg-green-400 text-white'
                    : product.stock === 0
                    ? 'bg-charcoal-200 text-charcoal-400 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                <ShoppingBag size={20} />
                {added ? L('✓ Добавлено!', "✓ Qo'shildi!", '✓ Added!') : t('product.add_to_cart')}
              </motion.button>
            </div>

            {/* Meta */}
            <div className="text-xs text-charcoal-400 space-y-1.5 border-t border-charcoal-100 pt-5">
              {product.sku && <p>{L('Артикул', 'Artikul', 'SKU')}: {product.sku}</p>}
              <p>{t('product.material')}: {t(`filters.materials.${product.material}`) || product.material}</p>
              <p>{t('filters.category')}: {t(`filters.categories.${product.category}`) || product.category}</p>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-1 border-b border-charcoal-100 mb-8">
            {[
              { id: 'description', label: t('product.description') },
              { id: 'reviews', label: `${t('product.reviews')} (${product.numReviews})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? 'border-pink-400 text-pink-500'
                    : 'border-transparent text-charcoal-500 hover:text-charcoal-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose max-w-none">
              <p className="text-charcoal-600 leading-relaxed text-base">{description}</p>
              {product.sizes?.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-charcoal-800 mb-3">{L('Размеры', "O'lchamlar", 'Sizes')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <span key={s.label} className="px-4 py-2 bg-pink-50 border border-pink-100 rounded-full text-sm text-charcoal-700">
                        {s.label}{s.dimensions ? ` — ${s.dimensions}` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {product.reviews?.length === 0 && (
                <p className="text-charcoal-400 text-center py-8">{t('product.no_reviews')}</p>
              )}

              {product.reviews?.map((r) => (
                <div key={r._id} className="bg-white rounded-2xl p-5 shadow-luxury">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center font-medium text-pink-500">
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-charcoal-800 text-sm">{r.name}</p>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} fill={i < r.rating ? '#C9A96E' : 'none'} stroke={i < r.rating ? '#C9A96E' : '#D1D1D1'} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-charcoal-600 text-sm">{r.comment}</p>
                </div>
              ))}

              {user && (
                <form onSubmit={handleSubmitReview} className="bg-pink-50/50 rounded-2xl p-6 mt-6">
                  <h4 className="font-serif text-lg text-charcoal-800 mb-4">{t('product.write_review')}</h4>
                  <div className="flex gap-2 mb-4">
                    {[1,2,3,4,5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReview((r) => ({ ...r, rating: star }))}
                        className="transition-transform hover:scale-110"
                      >
                        <Star size={24} fill={star <= review.rating ? '#C9A96E' : 'none'} stroke={star <= review.rating ? '#C9A96E' : '#D1D1D1'} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={review.comment}
                    onChange={(e) => setReview((r) => ({ ...r, comment: e.target.value }))}
                    placeholder={L('Поделитесь своим мнением о товаре...', 'Mahsulot haqida fikringizni bildiring...', 'Share your thoughts about this product...')}
                    className="input-field resize-none mb-3"
                    rows={4}
                    required
                  />
                  <button type="submit" disabled={submittingReview} className="btn-primary text-sm">
                    {submittingReview ? L('Отправка...', 'Yuborilmoqda...', 'Sending...') : L('Отправить отзыв', 'Sharh yuborish', 'Submit review')}
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
