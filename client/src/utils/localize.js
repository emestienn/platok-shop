import useLanguageStore from '../store/languageStore.js';

// Returns the product text for the current language.
// English falls back to Uzbek (Latin script), then Russian.
export const localText = (obj, lang = useLanguageStore.getState().lang) => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || (lang === 'en' ? obj.uz : undefined) || obj.ru || obj.uz || '';
};

// Name for a cart item (stores all languages in `names` when available)
export const cartItemName = (item) => (item?.names ? localText(item.names) : item?.name || '');
