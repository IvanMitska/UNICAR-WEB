import React, { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Heart } from 'lucide-react';
import type { Car } from '../../types/index';
import { formatPrice } from '../../utils/formatters';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';

// Helper to get WebP path from original image path
const getWebPPath = (src: string): string => {
  const lastDot = src.lastIndexOf('.');
  if (lastDot === -1) return src;
  return `${src.substring(0, lastDot)}.webp`;
};

interface CarCardProps {
  car: Car;
  index?: number;
  showRentalPrice?: boolean;
}

const getVehicleType = (car: Car): string => {
  const typeMap: Record<string, string> = {
    suv: 'Luxury SUV',
    premium: 'Premium Sedan',
    sport: 'Sports Car',
    business: 'Business Class',
    comfort: 'Comfort Sedan',
    economy: 'Economy',
  };
  return typeMap[car.category] || 'Vehicle';
};

const getTopFeatures = (car: Car): string[] => {
  const features: string[] = [];

  if (car.fuel === 'electric') {
    features.push('Zero Emissions');
  } else if (car.fuel === 'hybrid') {
    features.push('Hybrid Engine');
  }

  if (car.transmission === 'automatic') {
    features.push('Automatic Transmission');
  }

  if (car.seats >= 5) {
    features.push(`${car.seats} Seats`);
  }

  // Add from car features if needed
  if (features.length < 3 && car.features.length > 0) {
    const additionalFeatures = car.features.slice(0, 3 - features.length);
    features.push(...additionalFeatures);
  }

  return features.slice(0, 3);
};

const CarCardComponent: React.FC<CarCardProps> = ({ car, index = 0 }) => {
  const vehicleType = getVehicleType(car);
  const topFeatures = getTopFeatures(car);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/sign-in');
      return;
    }

    await toggleFavorite(car.id);
  };

  const isCarFavorite = isFavorite(car.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.15) }}
    >
      <Link to={`/cars/${car.id}`} className="block group h-full">
        <div className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
          <div className="flex flex-col sm:flex-row h-full">
            {/* Left Side - Info */}
            <div className="flex-1 p-6 flex flex-col justify-between min-h-[280px]">
              <div>
                {/* Car Name */}
                <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-gray-600 transition-colors">
                  {car.brand} {car.model}
                </h3>

                {/* Type + Year */}
                <p className="text-sm text-gray-400 mb-4">
                  {vehicleType} • {car.year}
                </p>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(car.pricePerDay)}
                  </span>
                  <span className="text-gray-400 text-sm ml-1">/day</span>
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {topFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-gray-900 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* View Details Button */}
              <button className="w-full sm:w-auto mt-6 px-6 py-3 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors text-center">
                View Details
              </button>
            </div>

            {/* Right Side - Image */}
            <div className="sm:w-[45%] relative bg-gray-50 order-first sm:order-last">
              <div className="aspect-[4/3] sm:aspect-auto sm:absolute sm:inset-0 relative overflow-hidden">
                <picture>
                  <source srcSet={getWebPPath(car.image)} type="image/webp" />
                  <img
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    loading="lazy"
                    decoding="async"
                    fetchPriority={index < 3 ? "auto" : "low"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </picture>

                {/* Favorite Button */}
                <button
                  onClick={handleFavoriteClick}
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
                    isCarFavorite
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 shadow-md'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isCarFavorite ? 'fill-current' : ''}`}
                  />
                </button>

                {/* Unavailable overlay */}
                {!car.available && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-gray-500 font-medium text-lg">Unavailable</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const CarCard = memo(CarCardComponent);
