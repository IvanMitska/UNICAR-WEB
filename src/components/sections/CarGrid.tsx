import React from 'react';
import { CarCard } from '../ui/CarCard';
import type { Car } from '../../types/index';

interface CarGridProps {
  cars: Car[];
  showRentalPrice?: boolean;
}

export const CarGrid: React.FC<CarGridProps> = ({ cars, showRentalPrice = false }) => {
  if (cars.length === 0) {
    return (
      <div className="bg-primary-50 rounded-lg p-12 text-center">
        <p className="text-primary-600 text-lg">
          По вашему запросу автомобилей не найдено
        </p>
        <p className="text-primary-400 mt-2 text-sm">
          Попробуйте изменить параметры поиска
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {cars.map((car, index) => (
        <CarCard key={car.id} car={car} index={index} showRentalPrice={showRentalPrice} />
      ))}
    </div>
  );
};
