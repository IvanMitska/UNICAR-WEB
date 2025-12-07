import React from 'react';
import { MotorcycleCard } from '../ui/MotorcycleCard';
import type { Motorcycle } from '../../types/index';

interface MotorcycleGridProps {
  motorcycles: Motorcycle[];
  showRentalPrice?: boolean;
}

export const MotorcycleGrid: React.FC<MotorcycleGridProps> = ({ motorcycles, showRentalPrice = false }) => {
  if (motorcycles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-dark-800/50 rounded-full flex items-center justify-center">
          <span className="text-4xl">🏍️</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Мотоциклы не найдены
        </h3>
        <p className="text-gray-400">
          Попробуйте изменить параметры поиска
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {motorcycles.map((motorcycle) => (
        <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} showRentalPrice={showRentalPrice} />
      ))}
    </div>
  );
};
