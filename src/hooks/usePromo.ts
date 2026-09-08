import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PROMO,
  formatPromoEndDate,
  isPromoActive,
  promoTimeLeft,
  type PromoTimeLeft,
} from '../config/promo';

interface UsePromoResult {
  /** Идёт ли акция сейчас */
  active: boolean;
  /** Размер скидки, % */
  percent: number;
  /** Живой остаток времени до конца акции */
  timeLeft: PromoTimeLeft;
  /** Дата окончания словами на текущем языке */
  endsOn: string;
}

/**
 * Состояние акции для UI. Тикает раз в минуту — этого достаточно
 * для отсчёта «дни / часы / минуты» и не нагружает рендер.
 */
export const usePromo = (): UsePromoResult => {
  const { i18n } = useTranslation();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!isPromoActive(now)) return;
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    active: isPromoActive(now),
    percent: PROMO.percent,
    timeLeft: promoTimeLeft(now),
    endsOn: formatPromoEndDate(i18n.language),
  };
};
