import ru from './ru.js';
import uz from './uz.js';
import en from './en.js';

export const translations = { ru, uz, en };

export const t = (lang, key) => {
  const keys = key.split('.');
  let result = translations[lang] || translations.ru;
  for (const k of keys) {
    result = result?.[k];
    if (result === undefined) break;
  }
  return result ?? key;
};
