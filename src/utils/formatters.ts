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