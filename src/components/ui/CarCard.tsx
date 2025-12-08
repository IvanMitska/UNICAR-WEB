import React, { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Fuel, Gauge, Settings2, Users } from 'lucide-react';
import type { Car } from '../../types/index';
import { formatPrice } from '../../utils/formatters';
import { cn } from '../../utils/cn';
import { useFavoritesStore } from '../../store/useFavoritesStore';

interface CarCardProps {
  car: Car;
  index?: number;
  showRentalPrice?: boolean;
}

const CarCardComponent: React.FC<CarCardProps> = ({ car }) => {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(car.id);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(car.id);
  }, [car.id, toggleFavorite]);

  const fuelLabels: Record<string, string> = {
    petrol: 'Бензин',
    diesel: 'Дизель',
    hybrid: 'Гибрид',
    electric: 'Электро',
  };

  const transmissionLabels: Record<string, string> = {
    automatic: 'Авто',
    manual: 'Механика',
  };

  return (
    <Link to={`/cars/${car.id}`} className="block group">
      <div className="bg-dark-900/50 rounded-2xl overflow-hidden border border-dark-800/50 hover:border-yellow-500/30 transition-all duration-300">
        {/* Image Container - Horizontal */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className={cn(
              "absolute top-3 right-3 p-2.5 rounded-xl bg-black/40 backdrop-blur-sm transition-all",
              favorite ? "text-yellow-500" : "text-white/70 hover:text-white"
            )}
          >
            <Heart className={cn("w-5 h-5", favorite && "fill-current")} />
          </button>

          {/* Unavailable overlay */}
          {!car.available && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Недоступен</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title & Price Row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
              {car.brand} {car.model}
            </h3>
            <div className="text-right flex-shrink-0">
              <div className="text-lg font-bold text-yellow-500">
                {formatPrice(car.pricePerDay)}
              </div>
              <div className="text-xs text-gray-500">в сутки</div>
            </div>
          </div>

          {/* Specs Row */}
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-gray-500" />
              <span>{car.specifications?.engine || '—'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Settings2 className="w-4 h-4 text-gray-500" />
              <span>{transmissionLabels[car.transmission]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-4 h-4 text-gray-500" />
              <span>{fuelLabels[car.fuel]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-gray-500" />
              <span>{car.seats}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Memoize to prevent unnecessary re-renders when parent updates
export const CarCard = memo(CarCardComponent);
