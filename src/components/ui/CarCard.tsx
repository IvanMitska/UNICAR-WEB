import React, { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import type { Car } from '../../types/index';
import { formatPrice, calculateDays } from '../../utils/formatters';
import { cn } from '../../utils/cn';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useBookingStore } from '../../store/useBookingStore';

interface CarCardProps {
  car: Car;
  index?: number;
  showRentalPrice?: boolean;
}

const CarCardComponent: React.FC<CarCardProps> = ({ car, showRentalPrice = false }) => {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { startDate, endDate } = useBookingStore();
  const favorite = isFavorite(car.id);

  const rentalDays = showRentalPrice && startDate && endDate ? calculateDays(new Date(startDate), new Date(endDate)) : 0;
  const totalPrice = rentalDays > 0 ? car.pricePerDay * rentalDays : 0;

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(car.id);
  }, [car.id, toggleFavorite]);

  return (
    <Link to={`/cars/${car.id}`} className="block group">
      <div className="relative">
        {/* Image Container */}
        <div className="aspect-[4/3] relative bg-primary-100 rounded-lg overflow-hidden">
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
              "absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm transition-all",
              favorite
                ? "text-red-500"
                : "text-primary-400 hover:text-primary-600"
            )}
          >
            <Heart className={cn("w-5 h-5", favorite && "fill-current")} />
          </button>

          {/* Unavailable overlay */}
          {!car.available && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <span className="text-primary-500 font-medium">Недоступен</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pt-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium text-primary-900">
                {car.brand} {car.model}
              </h3>
              <p className="text-sm text-primary-500 mt-1">
                {car.year} • {car.transmission === 'automatic' ? 'Автомат' : 'Механика'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-medium text-primary-900">
                {formatPrice(car.pricePerDay)}
              </p>
              <p className="text-sm text-primary-400">в день</p>
            </div>
          </div>

          {/* Rental total if applicable */}
          {rentalDays > 0 && (
            <div className="mt-3 pt-3 border-t border-primary-100 flex items-center justify-between">
              <span className="text-sm text-primary-500">
                {rentalDays} {rentalDays === 1 ? 'день' : rentalDays < 5 ? 'дня' : 'дней'}
              </span>
              <span className="font-medium text-primary-900">
                {formatPrice(totalPrice)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export const CarCard = memo(CarCardComponent);
