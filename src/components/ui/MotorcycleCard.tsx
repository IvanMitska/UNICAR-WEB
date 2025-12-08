import React, { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar } from 'lucide-react';
import type { Motorcycle } from '../../types/index';
import { formatCurrency, calculateDays } from '../../utils/formatters';
import { cn } from '../../utils/cn';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useBookingStore } from '../../store/useBookingStore';

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
  index?: number;
  showRentalPrice?: boolean;
}

const categoryNames: Record<string, string> = {
  scooter: 'Скутер',
  sport: 'Спорт',
  touring: 'Туринг',
  cruiser: 'Круизер',
  adventure: 'Адвенчер',
};

const fuelLabels: Record<string, string> = {
  petrol: 'Бензин',
  electric: 'Электро',
};

const MotorcycleCardComponent: React.FC<MotorcycleCardProps> = ({ motorcycle, showRentalPrice = false }) => {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { startDate, endDate } = useBookingStore();
  const favorite = isFavorite(motorcycle.id);

  // Calculate rental days and total price (only when showRentalPrice is true)
  const rentalDays = showRentalPrice && startDate && endDate ? calculateDays(new Date(startDate), new Date(endDate)) : 0;
  const totalPrice = rentalDays > 0 ? motorcycle.pricePerDay * rentalDays : 0;

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(motorcycle.id);
  }, [motorcycle.id, toggleFavorite]);

  return (
    <Link to={`/motorcycle/${motorcycle.id}`} className="block group">
      <div className="relative bg-dark-900/50 rounded-2xl overflow-hidden">
        {/* Header - always visible */}
        <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-start">
          <div>
            <div className="mb-2">
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-xs font-semibold rounded-full">
                {categoryNames[motorcycle.category]}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white drop-shadow-lg">
              {motorcycle.brand} {motorcycle.model}
            </h3>
            <p className="text-xl text-white/90 font-medium drop-shadow-lg mt-1">
              {formatCurrency(motorcycle.pricePerDay)}<span className="text-lg font-normal">/сут.</span>
            </p>
          </div>
          <button
            onClick={handleFavoriteClick}
            className={cn(
              "p-2 rounded-xl transition-colors",
              favorite ? "text-yellow-500" : "text-white/80 hover:text-yellow-400"
            )}
          >
            <Heart className={cn("w-8 h-8 drop-shadow-lg", favorite && "fill-current")} />
          </button>
        </div>

        {/* Image - large, fills the card */}
        <div className="aspect-[3/4] relative">
          <img
            src={motorcycle.image}
            alt={`${motorcycle.brand} ${motorcycle.model}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

          {/* Unavailable overlay */}
          {!motorcycle.available && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
              <span className="text-white font-semibold text-lg">Недоступен</span>
            </div>
          )}
        </div>

        {/* Rental period badge - fixed position */}
        {rentalDays > 0 && (
          <div className="absolute bottom-20 left-6 right-6 z-20 p-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/70">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {rentalDays} {rentalDays === 1 ? 'день' : rentalDays < 5 ? 'дня' : 'дней'}
                </span>
              </div>
              <span className="text-lg font-semibold text-yellow-400">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        )}

        {/* Specs row - appears on hover at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
          <div className="flex items-center justify-between gap-3 text-white text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
            <span className="drop-shadow-lg">{motorcycle.specifications?.engine || motorcycle.engineSize}</span>
            <span className="drop-shadow-lg">{motorcycle.specifications?.power || ''}</span>
            <span className="drop-shadow-lg">{motorcycle.year} г.</span>
            <span className="drop-shadow-lg">{fuelLabels[motorcycle.fuel]}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Memoize to prevent unnecessary re-renders when parent updates
export const MotorcycleCard = memo(MotorcycleCardComponent);
