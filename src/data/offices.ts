import type { Office, LocalizedText } from '../types/index';

export interface OfficeL10n extends Omit<Office, 'name' | 'workingHours'> {
  name: LocalizedText;
  workingHours: LocalizedText;
}

export const offices: OfficeL10n[] = [
  {
    id: '1',
    name: { ru: 'Главный офис Пхукет', en: 'Main office Phuket' },
    address: '24/31 Wichit, Mueang District, Phuket 83000, Thailand',
    phone: '+66 95-965-7805',
    workingHours: { ru: '08:00 – 20:00', en: '08:00 – 20:00' },
    coordinates: {
      lat: 7.8804,
      lng: 98.3923,
    },
  },
  {
    id: '2',
    name: { ru: 'Аэропорт Пхукет', en: 'Phuket Airport' },
    address: 'Phuket International Airport, Arrival Hall',
    phone: '+66 95-965-7805',
    workingHours: { ru: 'Круглосуточно', en: '24/7' },
    coordinates: {
      lat: 8.1132,
      lng: 98.3169,
    },
  },
  {
    id: '3',
    name: { ru: 'Патонг Бич', en: 'Patong Beach' },
    address: 'Patong Beach Road, Kathu, Phuket',
    phone: '+66 95-965-7805',
    workingHours: { ru: '09:00 – 19:00', en: '09:00 – 19:00' },
    coordinates: {
      lat: 7.8967,
      lng: 98.2958,
    },
  },
  {
    id: '4',
    name: { ru: 'Пхукет Таун', en: 'Phuket Town' },
    address: 'Phuket Town, Old Town District',
    phone: '+66 95-965-7805',
    workingHours: { ru: '09:00 – 18:00', en: '09:00 – 18:00' },
    coordinates: {
      lat: 7.8906,
      lng: 98.3981,
    },
  },
];
