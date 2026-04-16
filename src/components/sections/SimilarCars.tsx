import React from 'react';
import { useTranslation } from 'react-i18next';
import { CarCard } from '../ui/CarCard';
import type { Car } from '../../types/index';

interface SimilarCarsProps {
  cars: Car[];
}

export const SimilarCars: React.FC<SimilarCarsProps> = ({ cars }) => {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('car.similarCars')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map(car => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
};