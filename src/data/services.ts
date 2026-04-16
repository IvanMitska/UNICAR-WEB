import type { LocalizedText } from '../types/index';

export interface AdditionalService {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  pricePerDay?: number;
  selected?: boolean;
}

export const services: AdditionalService[] = [
  {
    id: 'child-seat',
    name: { ru: 'Детское кресло', en: 'Child seat' },
    description: {
      ru: 'Безопасное детское кресло для детей от 9 месяцев до 12 лет',
      en: 'Safe child seat for kids from 9 months to 12 years',
    },
    price: 500,
    pricePerDay: 500,
  },
  {
    id: 'additional-driver',
    name: { ru: 'Дополнительный водитель', en: 'Additional driver' },
    description: {
      ru: 'Возможность управления автомобилем вторым водителем',
      en: 'Allows a second driver to operate the car',
    },
    price: 1000,
  },
  {
    id: 'delivery',
    name: { ru: 'Доставка автомобиля', en: 'Car delivery' },
    description: {
      ru: 'Доставка автомобиля по указанному адресу в Пхукете',
      en: 'Car delivery to the specified address in Phuket',
    },
    price: 1500,
  },
];
