import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cars as staticCars } from '../data/cars';
import type { Car } from '../types';
import { pickLocalized } from '../utils/localized';
import { CustomDatePicker } from '../components/ui/CustomDatePicker';
import { CustomLocationSelector } from '../components/ui/CustomLocationSelector';
import {
  ArrowLeft,
  Heart,
  ChevronLeft,
  ChevronRight,
  Users,
  Fuel,
  Settings,
  X,
  Shield,
  Phone,
  MessageCircle,
  Check,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { formatPrice, calculateDays, getDailyRateForDuration, calculateRentalTotal } from '../utils/formatters';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { useBookingStore } from '../store/useBookingStore';
import { format, addDays } from 'date-fns';
import { cn } from '../utils/cn';
import { SimilarCars } from '../components/sections/SimilarCars';

export const CarDetailsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const {
    setSelectedCar,
    setDates,
    setLocations,
    startDate: storedStartDate,
    endDate: storedEndDate,
    pickupLocation: storedPickupLocation,
    returnLocation: storedReturnLocation
  } = useBookingStore();

  // Car data state
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Gallery state
  const [currentImage, setCurrentImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Booking state - use stored dates if available
  const [startDate, setStartDate] = useState(() =>
    storedStartDate ? format(new Date(storedStartDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(() =>
    storedEndDate ? format(new Date(storedEndDate), 'yyyy-MM-dd') : format(addDays(new Date(), 3), 'yyyy-MM-dd')
  );
  const [pickupLocation, setPickupLocation] = useState(storedPickupLocation || t('locations.phuketAirport'));
  const [returnLocation, setReturnLocation] = useState(storedReturnLocation || t('locations.phuketAirport'));

  // Pricing state - sync with booking dates
  const currentDays = calculateDays(new Date(startDate), new Date(endDate));
  const [sliderDays, setSliderDays] = useState(currentDays || 3);

  // Sync slider with dates when dates change
  useEffect(() => {
    const days = calculateDays(new Date(startDate), new Date(endDate));
    if (days > 0 && days <= 30 && days !== sliderDays) {
      setSliderDays(days);
    }
  }, [startDate, endDate]);

  // Update end date when slider changes
  const handleSliderChange = (newDays: number) => {
    setSliderDays(newDays);
    const newEndDate = addDays(new Date(startDate), newDays);
    setEndDate(format(newEndDate, 'yyyy-MM-dd'));
  };

  // Auto-adjust end date when start date changes
  const handleStartDateChange = (newStartDate: string) => {
    setStartDate(newStartDate);
    // Keep the same number of days
    const newEndDate = addDays(new Date(newStartDate), sliderDays);
    setEndDate(format(newEndDate, 'yyyy-MM-dd'));
  };

  // Update slider when end date changes manually
  const handleEndDateChange = (newEndDate: string) => {
    setEndDate(newEndDate);
    const days = calculateDays(new Date(startDate), new Date(newEndDate));
    if (days > 0 && days <= 30) {
      setSliderDays(days);
    }
  };

  const favorite = car ? isFavorite(car.id) : false;

  // Use local car data (prices, photos, categories)
  // API is only used for bookings
  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    const staticCar = staticCars.find(c => c.id === id);
    setCar(staticCar || null);
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const nextImage = useCallback(() => {
    if (car) {
      setCurrentImage((prev) => (prev + 1) % car.images.length);
    }
  }, [car]);

  const prevImage = useCallback(() => {
    if (car) {
      setCurrentImage((prev) => (prev - 1 + car.images.length) % car.images.length);
    }
  }, [car]);

  const handleFavoriteClick = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/sign-in');
      return;
    }
    if (car) {
      toggleFavorite(car.id);
    }
  }, [car, toggleFavorite, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-24">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-400 mx-auto mb-4" />
          <p className="text-primary-500">{t('car.loading')}</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-light text-primary-900 mb-4">{t('car.notFound')}</h1>
          <button
            onClick={() => navigate('/cars')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-900 text-white rounded-full hover:bg-primary-800 transition-colors"
          >
            {t('buttons.backToCatalog')}
          </button>
        </div>
      </div>
    );
  }

  const days = calculateDays(new Date(startDate), new Date(endDate));
  const dailyRate = getDailyRateForDuration(car.pricePerDay, days);
  const totalPrice = calculateRentalTotal(car.pricePerDay, days);

  const locations = [
    { id: 'phuket-airport', name: t('locations.phuketAirport'), description: t('locations.internationalAirport'), popular: true },
    { id: 'patong', name: t('locations.patong'), description: t('locations.centralBeach'), popular: true },
    { id: 'kata', name: t('locations.kata'), description: t('locations.kataBeach') },
    { id: 'karon', name: t('locations.karon'), description: t('locations.karonBeach') },
    { id: 'phuket-town', name: t('locations.phuketTown'), description: t('locations.oldTown'), popular: true },
    { id: 'rawai', name: t('locations.rawai'), description: t('locations.southBeach') },
    { id: 'kamala', name: t('locations.kamala'), description: t('locations.kamalaBeach') },
    { id: 'surin', name: t('locations.surin'), description: t('locations.surinBeach') },
  ];

  const handleBooking = () => {
    setSelectedCar(car);
    setDates(new Date(startDate), new Date(endDate));
    setLocations(pickupLocation, returnLocation);
    navigate('/booking');
  };

  const similarCars = staticCars
    .filter(c => c.category === car.category && c.id !== car.id)
    .slice(0, 3);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Gallery Section */}
      <section className="relative bg-primary-900 overflow-hidden">
        {/* Main Image */}
        <div className="relative h-[50vh] lg:h-[85vh] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <img
                src={car.images[currentImage]}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setIsFullscreen(true)}
              />
              {/* Gradient Overlays - lighter on mobile */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 lg:from-black/70" />
              <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate(-1)}
            className="absolute top-24 left-6 lg:left-12 z-20 flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="hidden lg:block text-sm">{t('buttons.back')}</span>
          </motion.button>

          {/* Favorite Button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleFavoriteClick}
            className="absolute top-24 right-6 lg:right-12 z-20"
          >
            <div className={cn(
              "w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all",
              favorite
                ? "bg-red-500 text-white"
                : "bg-white/10 text-white hover:bg-white/20"
            )}>
              <Heart className={cn("w-5 h-5", favorite && "fill-current")} />
            </div>
          </motion.button>

          {/* Navigation Arrows */}
          {car.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            </>
          )}

          {/* Desktop Bottom Info Bar - hidden on mobile */}
          <div className="hidden lg:block absolute bottom-0 left-0 right-0 z-20">
            <div className="container mx-auto px-6 lg:px-12 pb-8">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                {/* Car Title */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-white/60 text-sm uppercase tracking-widest mb-2">
                    {car.year} • {t(`categories.${car.category}`)}
                  </p>
                  <h1 className="text-4xl lg:text-6xl font-light text-white">
                    {car.brand} <span className="font-medium">{car.model}</span>
                  </h1>
                </motion.div>

                {/* Specs Pills */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-3"
                >
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full flex items-center gap-2 text-white">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{car.seats} {t('car.seats')}</span>
                  </div>
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full flex items-center gap-2 text-white">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">{car.transmission === 'automatic' ? t('car.automatic') : t('car.manual')}</span>
                  </div>
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full flex items-center gap-2 text-white">
                    <Fuel className="w-4 h-4" />
                    <span className="text-sm">{t(`fuel.${car.fuel}`)}</span>
                  </div>
                  {car.specifications?.power && (
                    <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white">
                      <span className="text-sm">{car.specifications.power}</span>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Thumbnail Strip */}
              {car.images.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 flex gap-2 overflow-x-auto pb-2"
                >
                  {car.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={cn(
                        "flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all",
                        index === currentImage
                          ? "ring-2 ring-white opacity-100"
                          : "opacity-50 hover:opacity-80"
                      )}
                    >
                      <img
                        src={image}
                        alt={`View ${index + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Info Section - below image */}
        <div className="lg:hidden bg-white px-6 py-6">
          {/* Car Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-primary-400 text-sm uppercase tracking-widest mb-2">
              {car.year} • {t(`categories.${car.category}`)}
            </p>
            <h1 className="text-3xl font-light text-primary-900 mb-4">
              {car.brand} <span className="font-medium">{car.model}</span>
            </h1>
          </motion.div>

          {/* Specs Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            <div className="px-3 py-1.5 bg-primary-100 rounded-full flex items-center gap-2 text-primary-700">
              <Users className="w-4 h-4" />
              <span className="text-sm">{car.seats} {t('car.seats')}</span>
            </div>
            <div className="px-3 py-1.5 bg-primary-100 rounded-full flex items-center gap-2 text-primary-700">
              <Settings className="w-4 h-4" />
              <span className="text-sm">{car.transmission === 'automatic' ? t('car.automatic') : t('car.manual')}</span>
            </div>
            <div className="px-3 py-1.5 bg-primary-100 rounded-full flex items-center gap-2 text-primary-700">
              <Fuel className="w-4 h-4" />
              <span className="text-sm">{t(`fuel.${car.fuel}`)}</span>
            </div>
            {car.specifications?.power && (
              <div className="px-3 py-1.5 bg-primary-100 rounded-full text-primary-700">
                <span className="text-sm">{car.specifications.power}</span>
              </div>
            )}
          </motion.div>

          {/* Thumbnail Strip */}
          {car.images.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-2 overflow-x-auto pb-2"
            >
              {car.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={cn(
                    "flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all border-2",
                    index === currentImage
                      ? "border-primary-900"
                      : "border-transparent opacity-60"
                  )}
                >
                  <img
                    src={image}
                    alt={`View ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-12">
              {/* Price Banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center justify-between p-6 bg-primary-50 rounded-2xl"
              >
                <div>
                  <p className="text-primary-400 text-sm mb-1">{t('price.priceFrom')}</p>
                  <p className="text-4xl font-light text-primary-900">
                    {formatPrice(car.pricePerDay)}
                    <span className="text-lg text-primary-400 ml-2">{t('price.perDay')}</span>
                  </p>
                </div>
                <div className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium",
                  car.available
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                )}>
                  {car.available ? t('car.available') : t('car.booked')}
                </div>
              </motion.div>

              {/* Description */}
              {car.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-light text-primary-900 mb-4">{t('carDetails.aboutCar', { ns: 'pages' })}</h2>
                  <p className="text-primary-500 leading-relaxed">{pickLocalized(car.description, i18n.language)}</p>
                </motion.div>
              )}

              {/* Features */}
              {car.features && car.features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-light text-primary-900 mb-6">{t('carDetails.equipment', { ns: 'pages' })}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {car.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-primary-50 rounded-xl"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-primary-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Specifications */}
              {car.specifications && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-light text-primary-900 mb-6">{t('carDetails.specifications', { ns: 'pages' })}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {car.specifications.engine && (
                      <div className="text-center p-6 bg-primary-50 rounded-2xl">
                        <p className="text-3xl font-light text-primary-900 mb-2">{car.specifications.engine}</p>
                        <p className="text-primary-400 text-sm">{t('specs.engine')}</p>
                      </div>
                    )}
                    {car.specifications.power && (
                      <div className="text-center p-6 bg-primary-50 rounded-2xl">
                        <p className="text-3xl font-light text-primary-900 mb-2">{car.specifications.power}</p>
                        <p className="text-primary-400 text-sm">{t('specs.power')}</p>
                      </div>
                    )}
                    {car.specifications.acceleration && (
                      <div className="text-center p-6 bg-primary-50 rounded-2xl">
                        <p className="text-3xl font-light text-primary-900 mb-2">{car.specifications.acceleration}</p>
                        <p className="text-primary-400 text-sm">{t('specs.acceleration')}</p>
                      </div>
                    )}
                    {car.specifications.topSpeed && (
                      <div className="text-center p-6 bg-primary-50 rounded-2xl">
                        <p className="text-3xl font-light text-primary-900 mb-2">{car.specifications.topSpeed}</p>
                        <p className="text-primary-400 text-sm">{t('specs.topSpeed')}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Pricing Calculator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-light text-primary-900 mb-6">{t('carDetails.priceCalculator', { ns: 'pages' })}</h2>

                {/* Interactive Slider */}
                <div className="bg-primary-50 rounded-3xl p-6 md:p-8">
                  {/* Days Display */}
                  <div className="text-center mb-6">
                    <span className="text-6xl md:text-7xl font-light text-primary-900">{sliderDays}</span>
                    <span className="text-2xl text-primary-400 ml-2">
                      {sliderDays === 1 ? t('time.day') : sliderDays < 5 ? t('time.days_few') : t('time.days_many')}
                    </span>
                  </div>

                  {/* Slider */}
                  <div className="relative mb-8">
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={sliderDays}
                      onChange={(e) => handleSliderChange(Number(e.target.value))}
                      className="w-full h-2 bg-primary-200 rounded-full appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-6
                        [&::-webkit-slider-thumb]:h-6
                        [&::-webkit-slider-thumb]:bg-primary-900
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:transition-transform
                        [&::-webkit-slider-thumb]:hover:scale-110
                        [&::-moz-range-thumb]:w-6
                        [&::-moz-range-thumb]:h-6
                        [&::-moz-range-thumb]:bg-primary-900
                        [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:border-0
                        [&::-moz-range-thumb]:cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #111827 0%, #111827 ${((sliderDays - 1) / 29) * 100}%, #e5e7eb ${((sliderDays - 1) / 29) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    {/* Scale markers */}
                    <div className="flex justify-between mt-2 text-xs text-primary-400">
                      <span>1</span>
                      <span>7</span>
                      <span>14</span>
                      <span>21</span>
                      <span>30</span>
                    </div>
                  </div>

                  {/* Price Display */}
                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-white rounded-2xl p-5 text-center">
                      <p className="text-primary-400 text-sm mb-1">{t('price.pricePerDay')}</p>
                      <p className="text-2xl md:text-3xl font-light text-primary-900">
                        {formatPrice(getDailyRateForDuration(car.pricePerDay, sliderDays))}
                      </p>
                      {sliderDays > 1 && (
                        <p className="text-green-600 text-sm mt-1 font-medium">
                          -{Math.round((1 - getDailyRateForDuration(car.pricePerDay, sliderDays) / car.pricePerDay) * 100)}%
                        </p>
                      )}
                    </div>
                    <div className="bg-primary-900 rounded-2xl p-5 text-center">
                      <p className="text-white/60 text-sm mb-1">{t('price.total')}</p>
                      <p className="text-2xl md:text-3xl font-light text-white">
                        {formatPrice(calculateRentalTotal(car.pricePerDay, sliderDays))}
                      </p>
                      <p className="text-white/50 text-sm mt-1">
                        {t('price.forDays', { days: sliderDays })}
                      </p>
                    </div>
                  </div>

                  {/* Quick Select Buttons */}
                  <div className="flex flex-wrap justify-center gap-2 mt-6">
                    {[1, 3, 7, 14, 30].map((d) => (
                      <button
                        key={d}
                        onClick={() => handleSliderChange(d)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium transition-all",
                          sliderDays === d
                            ? "bg-primary-900 text-white"
                            : "bg-white text-primary-600 hover:bg-primary-100"
                        )}
                      >
                        {d} {d === 1 ? t('time.day') : d < 5 ? t('time.days_few') : t('time.days_many')}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Insurance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-6 bg-green-50 rounded-2xl border border-green-200"
              >
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-primary-900 mb-1">{t('booking.insuranceIncluded')}</h3>
                  <p className="text-primary-500 text-sm">{t('booking.insuranceDesc')}</p>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="sticky top-24 bg-white rounded-3xl border border-primary-200 shadow-xl"
              >
                {/* Card Header */}
                <div className="p-6 bg-primary-900 text-white rounded-t-3xl">
                  <p className="text-white/70 text-sm mb-1">{t('booking.quickBooking')}</p>
                  <p className="text-3xl font-light">
                    {formatPrice(dailyRate)}
                    <span className="text-lg text-white/60 ml-2">{t('price.perDay')}</span>
                  </p>
                  {dailyRate < car.pricePerDay && (
                    <p className="text-white/50 text-sm mt-1 line-through">
                      {formatPrice(car.pricePerDay)}{t('price.perDay')}
                    </p>
                  )}
                </div>

                {/* Booking Form */}
                <div className="p-6 space-y-4">
                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-3">
                    <CustomDatePicker
                      value={startDate}
                      onChange={handleStartDateChange}
                      label={t('booking.pickup')}
                      minDate={new Date()}
                    />
                    <CustomDatePicker
                      value={endDate}
                      onChange={handleEndDateChange}
                      label={t('booking.return')}
                      minDate={addDays(new Date(startDate), 1)}
                    />
                  </div>

                  {/* Locations */}
                  <CustomLocationSelector
                    value={pickupLocation}
                    onChange={setPickupLocation}
                    label={t('form.pickupLocation')}
                    locations={locations}
                  />
                  <CustomLocationSelector
                    value={returnLocation}
                    onChange={setReturnLocation}
                    label={t('form.returnLocation')}
                    locations={locations}
                  />

                  {/* Price Summary */}
                  <div className="pt-4 border-t border-primary-100">
                    <div className="flex justify-between mb-2">
                      <span className="text-primary-500">{formatPrice(dailyRate)} × {days} {t('price.days')}</span>
                      <span className="text-primary-900">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-medium">
                      <span className="text-primary-900">{t('price.total')}</span>
                      <span className="text-primary-900">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={handleBooking}
                    disabled={!car.available}
                    className="w-full py-4 bg-primary-900 text-white rounded-full font-medium text-lg hover:bg-primary-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  >
                    <span>{car.available ? t('buttons.bookNow') : t('car.unavailable')}</span>
                    {car.available && (
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    )}
                  </button>

                  {/* Contact Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href="tel:+66638450372"
                      className="flex items-center justify-center gap-2 py-3 border border-primary-200 text-primary-700 rounded-full hover:border-primary-400 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{t('buttons.call')}</span>
                    </a>
                    <a
                      href="https://wa.me/66638450372"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{t('buttons.whatsapp')}</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Cars */}
      {similarCars.length > 0 && (
        <section className="py-16 lg:py-24 bg-primary-50">
          <div className="container mx-auto px-6 lg:px-12">
            <SimilarCars cars={similarCars} />
          </div>
        </section>
      )}

      {/* Fullscreen Gallery */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Main Image */}
            <motion.img
              key={currentImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={car.images[currentImage]}
              alt={`${car.brand} ${car.model}`}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Navigation */}
            {car.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Thumbnails */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {car.images.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImage(index);
                  }}
                  className={cn(
                    "w-16 h-12 rounded-lg overflow-hidden transition-all",
                    index === currentImage
                      ? "ring-2 ring-white opacity-100"
                      : "opacity-50 hover:opacity-80"
                  )}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Counter */}
            <div className="absolute top-6 left-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm">
              {currentImage + 1} / {car.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
