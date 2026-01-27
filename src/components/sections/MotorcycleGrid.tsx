import React, { memo } from 'react';
import { MotorcycleCard } from '../ui/MotorcycleCard';
import type { Motorcycle } from '../../types/index';

interface MotorcycleGridProps {
  motorcycles: Motorcycle[];
  showRentalPrice?: boolean;
}

const MotorcycleGridComponent: React.FC<MotorcycleGridProps> = ({ motorcycles, showRentalPrice = false }) => {
  if (motorcycles.length === 0) {
    return (
      <div className="bg-primary-50 rounded-lg p-12 text-center">
        <p className="text-primary-600 text-lg">
          По вашему запросу мотоциклов не найдено
        </p>
        <p className="text-primary-400 mt-2 text-sm">
          Попробуйте изменить параметры поиска
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {motorcycles.map((motorcycle, index) => (
        <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} index={index} showRentalPrice={showRentalPrice} />
      ))}
    </div>
  );
};

// Мемоизация для предотвращения лишних ре-рендеров
export const MotorcycleGrid = memo(MotorcycleGridComponent);
