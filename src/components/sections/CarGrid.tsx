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
      <div className="glass-effect rounded-2xl p-12 text-center border border-dark-800/50">
        <p className="text-gray-400 text-lg">
          По вашему запросу автомобилей не найдено
        </p>
        <p className="text-gray-500 mt-2">
          Попробуйте изменить параметры поиска
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {cars.map((car, index) => (
        <CarCard key={car.id} car={car} index={index} showRentalPrice={showRentalPrice} />
      ))}
    </div>
  );
};