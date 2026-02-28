import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cars as staticCars } from '../data/cars';
import type { Car } from '../types';
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
import { formatPrice, calculateDays } from '../utils/formatters';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { useBookingStore } from '../store/useBookingStore';
import { format, addDays } from 'date-fns';
import { cn } from '../utils/cn';
import { SimilarCars } from '../components/sections/SimilarCars';

type PricingTab = 'daily' | 'monthly';

const fuelLabels: Record<string, string> = {
  petrol: 'Бензин',
  diesel: 'Дизель',
  hybrid: 'Гибрид',
  electric: 'Электро',
};

const pricingTabs = [
  { id: 'daily' as PricingTab, label: 'Посуточно' },
  { id: 'monthly' as PricingTab, label: 'Помесячно' },
];

export const CarDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const { setSelectedCar, setDates, setLocations } = useBookingStore();

  // Car data state
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Gallery state
  const [currentImage, setCurrentImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Pricing state
  const [activeTab, setActiveTab] = useState<PricingTab>('daily');
  const [selectedTier, setSelectedTier] = useState(0);

  // Booking state
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 3), 'yyyy-MM-dd'));
  const [pickupLocation, setPickupLocation] = useState('Аэропорт Пхукета');
  const [returnLocation, setReturnLocation] = useState('Аэропорт Пхукета');

  // Auto-adjust end date when start date changes
  const handleStartDateChange = (newStartDate: string) => {
    setStartDate(newStartDate);
    // If end date is before or equal to new start date, set it to start + 1 day
    if (new Date(endDate) <= new Date(newStartDate)) {
      setEndDate(format(addDays(new Date(newStartDate), 1), 'yyyy-MM-dd'));
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
          <p className="text-primary-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-light text-primary-900 mb-4">Автомобиль не найден</h1>
          <button
            onClick={() => navigate('/cars')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-900 text-white rounded-full hover:bg-primary-800 transition-colors"
          >
            Вернуться к каталогу
          </button>
        </div>
      </div>
    );
  }

  const days = calculateDays(new Date(startDate), new Date(endDate));
  const totalPrice = car.pricePerDay * days;

  // Pricing tiers based on duration
  const pricingTiers = {
    daily: [
      { duration: '1-2 дня', price: car.pricePerDay },
      { duration: '3-6 дней', price: Math.round(car.pricePerDay * 0.9) },
      { duration: '7-13 дней', price: Math.round(car.pricePerDay * 0.85) },
      { duration: '14-29 дней', price: Math.round(car.pricePerDay * 0.8) },
      { duration: '30+ дней', price: Math.round(car.pricePerDay * 0.7) },
    ],
    monthly: [
      { duration: '1 месяц', price: Math.round(car.pricePerDay * 8.75) },
      { duration: '2 месяца', price: Math.round(car.pricePerDay * 7.5) },
      { duration: '3+ месяца', price: Math.round(car.pricePerDay * 6.5) },
    ],
  };

  const locations = [
    { id: 'phuket-airport', name: 'Аэропорт Пхукета', description: 'Международный аэропорт', popular: true },
    { id: 'patong', name: 'Патонг', description: 'Центральный пляж', popular: true },
    { id: 'kata', name: 'Ката', description: 'Пляж Ката' },
    { id: 'karon', name: 'Карон', description: 'Пляж Карон' },
    { id: 'phuket-town', name: 'Пхукет Таун', description: 'Старый город', popular: true },
    { id: 'rawai', name: 'Рауай', description: 'Южный пляж' },
    { id: 'kamala', name: 'Камала', description: 'Пляж Камала' },
    { id: 'surin', name: 'Сурин', description: 'Пляж Сурин' },
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
            <span className="hidden lg:block text-sm">Назад</span>
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
                    {car.year} • {car.category === 'premium' ? 'Премиум' : car.category === 'sport' ? 'Спорткар' : car.category}
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
                    <span className="text-sm">{car.seats} мест</span>
                  </div>
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full flex items-center gap-2 text-white">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">{car.transmission === 'automatic' ? 'Автомат' : 'Механика'}</span>
                  </div>
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full flex items-center gap-2 text-white">
                    <Fuel className="w-4 h-4" />
                    <span className="text-sm">{fuelLabels[car.fuel]}</span>
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
              {car.year} • {car.category === 'premium' ? 'Премиум' : car.category === 'sport' ? 'Спорткар' : car.category}
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
              <span className="text-sm">{car.seats} мест</span>
            </div>
            <div className="px-3 py-1.5 bg-primary-100 rounded-full flex items-center gap-2 text-primary-700">
              <Settings className="w-4 h-4" />
              <span className="text-sm">{car.transmission === 'automatic' ? 'Автомат' : 'Механика'}</span>
            </div>
            <div className="px-3 py-1.5 bg-primary-100 rounded-full flex items-center gap-2 text-primary-700">
              <Fuel className="w-4 h-4" />
              <span className="text-sm">{fuelLabels[car.fuel]}</span>
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
                  <p className="text-primary-400 text-sm mb-1">Стоимость аренды от</p>
                  <p className="text-4xl font-light text-primary-900">
                    {formatPrice(car.pricePerDay)}
                    <span className="text-lg text-primary-400 ml-2">/день</span>
                  </p>
                </div>
                <div className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium",
                  car.available
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                )}>
                  {car.available ? 'Доступен' : 'Забронирован'}
                </div>
              </motion.div>

              {/* Description */}
              {car.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-light text-primary-900 mb-4">Об автомобиле</h2>
                  <p className="text-primary-500 leading-relaxed">{car.description}</p>
                </motion.div>
              )}

              {/* Features */}
              {car.features && car.features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-light text-primary-900 mb-6">Комплектация</h2>
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
                  <h2 className="text-2xl font-light text-primary-900 mb-6">Характеристики</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {car.specifications.engine && (
                      <div className="text-center p-6 bg-primary-50 rounded-2xl">
                        <p className="text-3xl font-light text-primary-900 mb-2">{car.specifications.engine}</p>
                        <p className="text-primary-400 text-sm">Двигатель</p>
                      </div>
                    )}
                    {car.specifications.power && (
                      <div className="text-center p-6 bg-primary-50 rounded-2xl">
                        <p className="text-3xl font-light text-primary-900 mb-2">{car.specifications.power}</p>
                        <p className="text-primary-400 text-sm">Мощность</p>
                      </div>
                    )}
                    {car.specifications.acceleration && (
                      <div className="text-center p-6 bg-primary-50 rounded-2xl">
                        <p className="text-3xl font-light text-primary-900 mb-2">{car.specifications.acceleration}</p>
                        <p className="text-primary-400 text-sm">0-100 км/ч</p>
                      </div>
                    )}
                    {car.specifications.topSpeed && (
                      <div className="text-center p-6 bg-primary-50 rounded-2xl">
                        <p className="text-3xl font-light text-primary-900 mb-2">{car.specifications.topSpeed}</p>
                        <p className="text-primary-400 text-sm">Макс. скорость</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Pricing Tiers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-light text-primary-900 mb-6">Тарифы</h2>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                  {pricingTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSelectedTier(0);
                      }}
                      className={cn(
                        "px-6 py-3 rounded-full text-sm font-medium transition-all",
                        activeTab === tab.id
                          ? "bg-primary-900 text-white"
                          : "bg-primary-100 text-primary-600 hover:bg-primary-200"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pricingTiers[activeTab].map((tier, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTier(index)}
                      className={cn(
                        "p-6 rounded-2xl border-2 transition-all text-left cursor-pointer",
                        selectedTier === index
                          ? "border-primary-900 bg-primary-900 text-white"
                          : "border-primary-200 bg-white hover:border-primary-400"
                      )}
                    >
                      <p className={cn(
                        "text-sm mb-2",
                        selectedTier === index ? "text-white/70" : "text-primary-400"
                      )}>
                        {tier.duration}
                      </p>
                      <p className={cn(
                        "text-3xl font-light",
                        selectedTier === index ? "text-white" : "text-primary-900"
                      )}>
                        {formatPrice(tier.price)}
                        <span className={cn(
                          "text-sm ml-1",
                          selectedTier === index ? "text-white/60" : "text-primary-400"
                        )}>
                          {activeTab === 'daily' ? '/день' : '/мес'}
                        </span>
                      </p>
                    </button>
                  ))}
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
                  <h3 className="text-lg font-medium text-primary-900 mb-1">Полная страховка включена</h3>
                  <p className="text-primary-500 text-sm">КАСКО и ОСАГО входят в стоимость аренды</p>
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
                  <p className="text-white/70 text-sm mb-1">Быстрое бронирование</p>
                  <p className="text-3xl font-light">
                    {formatPrice(car.pricePerDay)}
                    <span className="text-lg text-white/60 ml-2">/день</span>
                  </p>
                </div>

                {/* Booking Form */}
                <div className="p-6 space-y-4">
                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-3">
                    <CustomDatePicker
                      value={startDate}
                      onChange={handleStartDateChange}
                      label="Получение"
                      minDate={new Date()}
                    />
                    <CustomDatePicker
                      value={endDate}
                      onChange={setEndDate}
                      label="Возврат"
                      minDate={addDays(new Date(startDate), 1)}
                    />
                  </div>

                  {/* Locations */}
                  <CustomLocationSelector
                    value={pickupLocation}
                    onChange={setPickupLocation}
                    label="Место получения"
                    locations={locations}
                  />
                  <CustomLocationSelector
                    value={returnLocation}
                    onChange={setReturnLocation}
                    label="Место возврата"
                    locations={locations}
                  />

                  {/* Price Summary */}
                  <div className="pt-4 border-t border-primary-100">
                    <div className="flex justify-between mb-2">
                      <span className="text-primary-500">{formatPrice(car.pricePerDay)} × {days} дн.</span>
                      <span className="text-primary-900">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-medium">
                      <span className="text-primary-900">Итого</span>
                      <span className="text-primary-900">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={handleBooking}
                    disabled={!car.available}
                    className="w-full py-4 bg-primary-900 text-white rounded-full font-medium text-lg hover:bg-primary-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  >
                    <span>{car.available ? 'Забронировать' : 'Недоступен'}</span>
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
                      <span className="text-sm">Позвонить</span>
                    </a>
                    <a
                      href="https://wa.me/66638450372"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">WhatsApp</span>
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
