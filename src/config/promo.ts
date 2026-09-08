/**
 * Акция на весь автопарк — единая точка правды.
 *
 * Меняешь значения здесь → меняются все цены, бейджи и баннеры на сайте.
 * Чтобы выключить акцию досрочно: enabled: false (или просто дождаться endsAt).
 */
export const PROMO = {
  /** Полный выключатель кампании */
  enabled: true,
  /** Размер скидки в процентах на все автомобили */
  percent: 20,
  /** Окно акции по времени Пхукета (UTC+7) */
  startsAt: new Date('2026-09-07T00:00:00+07:00'),
  endsAt: new Date('2026-10-07T23:59:59+07:00'),
} as const;

/** Идёт ли акция прямо сейчас */
export const isPromoActive = (now: Date = new Date()): boolean =>
  PROMO.enabled && now >= PROMO.startsAt && now <= PROMO.endsAt;

/**
 * Применяет скидку к сумме в батах и округляет до «красивых» 100 ฿,
 * как это делает базовая сетка тарифов.
 */
export const applyPromo = (amount: number, now?: Date): number => {
  if (!isPromoActive(now) || amount <= 0) return amount;
  return Math.round((amount * (100 - PROMO.percent)) / 100 / 100) * 100;
};

/** Сколько сэкономит клиент на этой сумме */
export const promoSavings = (amount: number, now?: Date): number =>
  Math.max(0, amount - applyPromo(amount, now));

export interface PromoTimeLeft {
  days: number;
  hours: number;
  minutes: number;
  totalMs: number;
}

/** Остаток времени до конца акции */
export const promoTimeLeft = (now: Date = new Date()): PromoTimeLeft => {
  const totalMs = Math.max(0, PROMO.endsAt.getTime() - now.getTime());
  return {
    days: Math.floor(totalMs / 86_400_000),
    hours: Math.floor((totalMs % 86_400_000) / 3_600_000),
    minutes: Math.floor((totalMs % 3_600_000) / 60_000),
    totalMs,
  };
};

/** Дата окончания акции словами: «7 октября» / «7 October» */
export const formatPromoEndDate = (language: string): string =>
  new Intl.DateTimeFormat(language.startsWith('ru') ? 'ru-RU' : 'en-GB', {
    day: 'numeric',
    month: 'long',
  }).format(PROMO.endsAt);
