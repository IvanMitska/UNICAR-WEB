import type { LocalizedText } from '../types/index';

export function pickLocalized(text: LocalizedText | string | undefined, lang: string): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  const normalized = (lang || 'ru').toLowerCase().split('-')[0];
  if (normalized === 'en') return text.en || text.ru || '';
  return text.ru || text.en || '';
}
