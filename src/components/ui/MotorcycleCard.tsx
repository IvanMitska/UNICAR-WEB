import React, { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowUpRight, Settings, Gauge } from 'lucide-react';
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

const MotorcycleCardComponent: React.FC<MotorcycleCardProps> = ({ motorcycle, index = 0, showRentalPrice = false }) => {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { startDate, endDate } = useBookingStore();
  const favorite = isFavorite(motorcycle.id);

  const rentalDays = showRentalPrice && startDate && endDate ? calculateDays(new Date(startDate), new Date(endDate)) : 0;
  const totalPrice = rentalDays > 0 ? motorcycle.pricePerDay * rentalDays : 0;

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(motorcycle.id);
  }, [motorcycle.id, toggleFavorite]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.15) }}
    >
      <Link to={`/motorcycle/${motorcycle.id}`} className="block group">
        <div className="relative">
          {/* Image Container */}
          <div className="aspect-[4/3] relative bg-primary-100 rounded-2xl overflow-hidden">
            <img
              src={motorcycle.image}
              alt={`${motorcycle.brand} ${motorcycle.model}`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Price Badge - Top Right */}
            <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg">
              <span className="font-medium text-primary-900">
                {formatCurrency(motorcycle.pricePerDay)}/день
              </span>
            </div>

            {/* Favorite Button - Top Left */}
            <button
              onClick={handleFavoriteClick}
              className={cn(
                "absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 shadow-lg",
                favorite
                  ? "text-red-500"
                  : "text-primary-400 hover:text-primary-900"
              )}
            >
              <Heart className={cn("w-5 h-5", favorite && "fill-current")} />
            </button>

            {/* View Button - Appears on Hover */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                <ArrowUpRight className="w-5 h-5 text-primary-900" />
              </div>
            </div>

            {/* Quick Specs - Appears on Hover */}
            <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
              <div className="flex gap-2">
                <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full flex items-center gap-1.5 text-sm text-primary-700">
                  <Settings className="w-3.5 h-3.5" />
                  <span>{motorcycle.transmission === 'automatic' ? 'Авто' : 'Механика'}</span>
                </div>
                <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full flex items-center gap-1.5 text-sm text-primary-700">
                  <Gauge className="w-3.5 h-3.5" />
                  <span>{motorcycle.engineSize}</span>
                </div>
              </div>
            </div>

            {/* Category Badge */}
            <div className="absolute top-4 left-16 ml-2 px-3 py-1.5 bg-primary-900/90 backdrop-blur-md rounded-full">
              <span className="text-xs font-medium text-white">
                {categoryNames[motorcycle.category]}
              </span>
            </div>

            {/* Unavailable overlay */}
            {!motorcycle.available && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center">
                <span className="text-primary-500 font-medium text-lg">Забронирован</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="pt-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-medium text-primary-900 group-hover:text-primary-600 transition-colors">
                  {motorcycle.brand} {motorcycle.model}
                </h3>
                <p className="text-sm text-primary-400 mt-1">
                  {motorcycle.year} • {fuelLabels[motorcycle.fuel] || motorcycle.fuel}
                </p>
              </div>
            </div>

            {/* Rental total if applicable */}
            {rentalDays > 0 && (
              <div className="mt-4 pt-4 border-t border-primary-100 flex items-center justify-between">
                <span className="text-sm text-primary-500">
                  {rentalDays} {rentalDays === 1 ? 'день' : rentalDays < 5 ? 'дня' : 'дней'}
                </span>
                <span className="font-semibold text-primary-900 text-lg">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const MotorcycleCard = memo(MotorcycleCardComponent);
