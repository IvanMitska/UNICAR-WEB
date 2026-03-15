export const formatPrice = (price: number, showOnRequest = true): string => {
  if (price === 0 && showOnRequest) {
    return 'По запросу';
  }
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatCurrency = formatPrice;

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const calculateDays = (startDate: Date, endDate: Date): number => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const calculateTotalPrice = (
  pricePerDay: number,
  days: number,
  additionalServices: { price: number; priceType: 'perDay' | 'oneTime'; selected: boolean }[]
): number => {
  let total = pricePerDay * days;

  additionalServices.forEach(service => {
    if (service.selected) {
      if (service.priceType === 'perDay') {
        total += service.price * days;
      } else {
        total += service.price;
      }
    }
  });

  return total;
};

/**
 * Плавная сетка цен 1-30 дней
 * Коэффициенты от базовой цены для каждого дня
 */
const DAILY_RATE_COEFFICIENTS: number[] = [
  1.0,      // 1 день - 100%
  0.9,      // 2 дня - 90%
  0.8,      // 3 дня - 80%
  0.7333,   // 4 дня - 73.3%
  0.6667,   // 5 дней - 66.7%
  0.6133,   // 6 дней - 61.3%
  0.5733,   // 7 дней - 57.3%
  0.56,     // 8 дней - 56%
  0.5467,   // 9 дней - 54.7%
  0.5333,   // 10 дней - 53.3%
  0.52,     // 11 дней - 52%
  0.5067,   // 12 дней - 50.7%
  0.4933,   // 13 дней - 49.3%
  0.48,     // 14 дней - 48%
  0.4667,   // 15 дней - 46.7%
  0.4533,   // 16 дней - 45.3%
  0.44,     // 17 дней - 44%
  0.4267,   // 18 дней - 42.7%
  0.4133,   // 19 дней - 41.3%
  0.4,      // 20 дней - 40%
  0.3867,   // 21 день - 38.7%
  0.38,     // 22 дня - 38%
  0.3733,   // 23 дня - 37.3%
  0.3667,   // 24 дня - 36.7%
  0.36,     // 25 дней - 36%
  0.3533,   // 26 дней - 35.3%
  0.3467,   // 27 дней - 34.7%
  0.3433,   // 28 дней - 34.3%
  0.34,     // 29 дней - 34%
  0.3333,   // 30 дней - 33.3%
];

/**
 * Возвращает цену за день в зависимости от срока аренды
 * Плавная сетка: каждый день имеет свой коэффициент
 */
export const getDailyRateForDuration = (basePrice: number, days: number): number => {
  if (days <= 0) return basePrice;

  // Для дней 1-30 используем коэффициенты из таблицы
  if (days <= 30) {
    const coefficient = DAILY_RATE_COEFFICIENTS[days - 1];
    // Округляем до ближайших 100 для красивых цен
    return Math.round(basePrice * coefficient / 100) * 100;
  }

  // Для 30+ дней используем минимальный коэффициент (33.3%)
  return Math.round(basePrice * 0.3333 / 100) * 100;
};

/**
 * Рассчитывает общую стоимость аренды с учётом плавной сетки тарифов
 */
export const calculateRentalTotal = (basePrice: number, days: number): number => {
  const dailyRate = getDailyRateForDuration(basePrice, days);
  return dailyRate * days;
};

/**
 * Возвращает информацию о тарифе: цену за день и общую стоимость
 */
export const getRentalPriceInfo = (basePrice: number, days: number): {
  dailyRate: number;
  totalPrice: number;
  discountPercent: number;
} => {
  const dailyRate = getDailyRateForDuration(basePrice, days);
  const discountPercent = Math.round((1 - dailyRate / basePrice) * 100);
  return {
    dailyRate,
    totalPrice: dailyRate * days,
    discountPercent,
  };
};