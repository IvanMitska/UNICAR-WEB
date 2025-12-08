import React, { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Fuel, Gauge, Settings2 } from 'lucide-react';
import type { Motorcycle } from '../../types/index';
import { formatCurrency } from '../../utils/formatters';
import { cn } from '../../utils/cn';
import { useFavoritesStore } from '../../store/useFavoritesStore';

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
  index?: number;
  showRentalPrice?: boolean;
}

const categoryNames: Record<string, string> = {
  scooter: 'Скутер',
  sport: 'Спортбайк',
  touring: 'Туринг',
  cruiser: 'Круизер',
  adventure: 'Адвенчер',
};

const fuelLabels: Record<string, string> = {
  petrol: 'Бензин',
  electric: 'Электро',
};

const transmissionLabels: Record<string, string> = {
  automatic: 'Авто',
  manual: 'Механика',
};

const MotorcycleCardComponent: React.FC<MotorcycleCardProps> = ({ motorcycle }) => {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(motorcycle.id);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(motorcycle.id);
  }, [motorcycle.id, toggleFavorite]);

  return (
    <Link to={`/motorcycle/${motorcycle.id}`} className="block group">
      <div className="bg-dark-900/50 rounded-2xl overflow-hidden border border-dark-800/50 hover:border-yellow-500/30 transition-all duration-300">
        {/* Image Container - Horizontal */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={motorcycle.image}
            alt={`${motorcycle.brand} ${motorcycle.model}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-yellow-500 text-black text-xs font-semibold rounded-lg">
              {categoryNames[motorcycle.category]}
            </span>
          </div>

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
          {!motorcycle.available && (
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
              {motorcycle.brand} {motorcycle.model}
            </h3>
            <div className="text-right flex-shrink-0">
              <div className="text-lg font-bold text-yellow-500">
                {formatCurrency(motorcycle.pricePerDay)}
              </div>
              <div className="text-xs text-gray-500">в сутки</div>
            </div>
          </div>

          {/* Specs Row */}
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-gray-500" />
              <span>{motorcycle.engineSize}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Settings2 className="w-4 h-4 text-gray-500" />
              <span>{transmissionLabels[motorcycle.transmission]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-4 h-4 text-gray-500" />
              <span>{fuelLabels[motorcycle.fuel]}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Memoize to prevent unnecessary re-renders when parent updates
export const MotorcycleCard = memo(MotorcycleCardComponent);
