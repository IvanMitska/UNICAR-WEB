export interface Location {
  id: string;
  name: string;
  description?: string;
  popular?: boolean;
}

export const locations: Location[] = [
  // Popular locations
  {
    id: '1',
    name: 'Чалонг',
    description: 'Крупнейшая бухта Пхукета',
    popular: true,
  },
  {
    id: '2',
    name: 'Аэропорт Пхукета',
    description: 'Международный аэропорт, круглосуточно',
    popular: true,
  },
  {
    id: '3',
    name: 'Патонг Бич',
    description: 'Главный туристический район',
    popular: true,
  },
  {
    id: '4',
    name: 'Карон Бич',
    description: 'Тихий пляжный район',
    popular: true,
  },

  // Other locations
  {
    id: '5',
    name: 'Ката Бич',
    description: 'Популярный пляжный курорт',
  },
  {
    id: '6',
    name: 'Камала Бич',
    description: 'Спокойный пляжный район',
  },
  {
    id: '7',
    name: 'Раваи',
    description: 'Южный район Пхукета',
  },
  {
    id: '8',
    name: 'Пхукет Таун',
    description: 'Исторический центр города',
  },
  {
    id: '9',
    name: 'Най Харн',
    description: 'Красивый южный пляж',
  },
  {
    id: '10',
    name: 'Сурин Бич',
    description: 'Элитный пляжный район',
  },
  {
    id: '11',
    name: 'Бангтао',
    description: 'Длинный пляж с отелями',
  },
  {
    id: '12',
    name: 'Май Као',
    description: 'Северный район у аэропорта',
  },
];