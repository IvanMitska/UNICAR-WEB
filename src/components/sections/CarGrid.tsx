import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { CarCard } from '../ui/CarCard';
import type { Car } from '../../types/index';

interface CarGridProps {
  cars: Car[];
  showRentalPrice?: boolean;
}

const CarGridComponent: React.FC<CarGridProps> = ({ cars, showRentalPrice = false }) => {
  const { t } = useTranslation();

  if (cars.length === 0) {
    return (
      <div className="bg-primary-50 rounded-lg p-12 text-center">
        <p className="text-primary-600 text-lg">
          {t('cars.noResults', { ns: 'pages' })}
        </p>
        <p className="text-primary-400 mt-2 text-sm">
          {t('cars.tryOther', { ns: 'pages' })}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {cars.map((car, index) => (
        <CarCard key={car.id} car={car} index={index} showRentalPrice={showRentalPrice} />
      ))}
    </div>
  );
};

export const CarGrid = memo(CarGridComponent);
