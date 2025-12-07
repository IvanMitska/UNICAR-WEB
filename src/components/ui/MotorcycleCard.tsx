import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Zap, Gauge, Fuel, Calendar } from 'lucide-react';
import type { Motorcycle } from '../../types/index';
import { formatCurrency, calculateDays } from '../../utils/formatters';
import { useBookingStore } from '../../store/useBookingStore';

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
  showRentalPrice?: boolean;
}

export const MotorcycleCard: React.FC<MotorcycleCardProps> = ({ motorcycle, showRentalPrice = false }) => {
  const { startDate, endDate } = useBookingStore();

  // Calculate rental days and total price (only when showRentalPrice is true)
  const rentalDays = showRentalPrice && startDate && endDate ? calculateDays(new Date(startDate), new Date(endDate)) : 0;
  const totalPrice = rentalDays > 0 ? motorcycle.pricePerDay * rentalDays : 0;
  const categoryNames = {
    scooter: 'Скутер',
    sport: 'Спорт',
    touring: 'Туринг',
    cruiser: 'Круизер',
    adventure: 'Адвенчер',
  };

  return (
    <div className="group bg-dark-900/70 border border-dark-800/50 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-colors">
      <Link to={`/motorcycle/${motorcycle.id}`} className="block">
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={motorcycle.image}
              alt={`${motorcycle.brand} ${motorcycle.model}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-semibold rounded-full">
              {categoryNames[motorcycle.category]}
            </span>
          </div>

          {!motorcycle.available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold">
                Недоступен
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
                {motorcycle.brand} {motorcycle.model}
              </h3>
              <p className="text-gray-400 text-sm">{motorcycle.year} год</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-500">
                {formatCurrency(motorcycle.pricePerDay)}
              </div>
              <div className="text-xs text-gray-400">за день</div>
            </div>
          </div>

          <div className="flex items-center gap-1 mb-4">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-white font-medium">{motorcycle.rating}</span>
            <span className="text-gray-400 text-sm">({motorcycle.reviews} отзывов)</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-gray-300">
              <Gauge className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">{motorcycle.engineSize}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm capitalize">{motorcycle.transmission === 'automatic' ? 'Авто' : 'Мех'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Fuel className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">{motorcycle.fuel === 'petrol' ? 'Бензин' : 'Электро'}</span>
            </div>
          </div>

          {/* Show total price badge when dates are selected */}
          {rentalDays > 0 && (
            <div className="mb-3 p-2.5 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-yellow-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{rentalDays} {rentalDays === 1 ? 'день' : rentalDays < 5 ? 'дня' : 'дней'}</span>
                </div>
                <span className="text-sm font-bold text-yellow-400">{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-1 mb-4">
            {motorcycle.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-dark-800/50 text-gray-300 text-xs rounded-md"
              >
                {feature}
              </span>
            ))}
            {motorcycle.features.length > 3 && (
              <span className="px-2 py-1 bg-dark-800/50 text-gray-300 text-xs rounded-md">
                +{motorcycle.features.length - 3}
              </span>
            )}
          </div>

          <button
            disabled={!motorcycle.available}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              motorcycle.available
                ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {motorcycle.available ? 'Забронировать' : 'Недоступен'}
          </button>
        </div>
      </Link>
    </div>
  );
};