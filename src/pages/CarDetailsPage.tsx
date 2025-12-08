import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cars } from '../data/cars';
import { Button } from '../components/ui/Button';
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
  Star,
  Shield,
  Phone,
  MessageCircle
} from 'lucide-react';
import { formatPrice, calculateDays } from '../utils/formatters';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useBookingStore } from '../store/useBookingStore';
import { format, addDays } from 'date-fns';
import { cn } from '../utils/cn';
import { SimilarCars } from '../components/sections/SimilarCars';

type PricingTab = 'daily' | 'monthly' | 'withDriver';

const fuelLabels: Record<string, string> = {
  petrol: 'Бензин',
  diesel: 'Дизель',
  hybrid: 'Гибрид',
  electric: 'Электро',
};

const pricingTabs = [
  { id: 'daily' as PricingTab, label: 'Посуточно' },
  { id: 'monthly' as PricingTab, label: 'Помесячно' },
  { id: 'withDriver' as PricingTab, label: 'С водителем' },
];

export const CarDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { setSelectedCar, setDates, setLocations } = useBookingStore();

  // Gallery state
  const [currentImage, setCurrentImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Pricing state
  const [activeTab, setActiveTab] = useState<PricingTab>('daily');

  // Booking state
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 3), 'yyyy-MM-dd'));
  const [pickupLocation, setPickupLocation] = useState('Аэропорт Пхукета');
  const [returnLocation, setReturnLocation] = useState('Аэропорт Пхукета');

  const car = cars.find(c => c.id === id);
  const favorite = car ? isFavorite(car.id) : false;

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
    if (car) {
      toggleFavorite(car.id);
    }
  }, [car, toggleFavorite]);

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Автомобиль не найден</h1>
        <Button onClick={() => navigate('/cars')}>Вернуться к каталогу</Button>
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
      { duration: '1 месяц', price: Math.round(car.pricePerDay * 25) },
      { duration: '2 месяца', price: Math.round(car.pricePerDay * 23) },
      { duration: '3+ месяца', price: Math.round(car.pricePerDay * 20) },
    ],
    withDriver: [
      { duration: '4 часа', price: Math.round(car.pricePerDay * 0.6) },
      { duration: '8 часов', price: Math.round(car.pricePerDay * 1.2) },
      { duration: 'Весь день', price: Math.round(car.pricePerDay * 1.5) },
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

  const similarCars = cars
    .filter(c => c.category === car.category && c.id !== car.id)
    .slice(0, 3);

  return (
    <div className="bg-dark-950 min-h-screen">
      {/* Back button - mobile only */}
      <div className="lg:hidden fixed top-20 left-4 z-30">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Image Gallery - Carousel with side previews */}
      <div className="relative bg-dark-900 h-[50vh] md:h-[70vh] overflow-hidden">
        {/* Side images - previous */}
        {car.images.length > 1 && (
          <div
            className="hidden md:block absolute left-0 top-0 bottom-0 w-[15%] z-10 cursor-pointer"
            onClick={prevImage}
          >
            <img
              src={car.images[(currentImage - 1 + car.images.length) % car.images.length]}
              alt="Previous"
              className="w-full h-full object-cover opacity-40 hover:opacity-60 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
          </div>
        )}

        {/* Main image - centered */}
        <div className="absolute inset-0 md:left-[15%] md:right-[15%]">
          <motion.img
            key={currentImage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            src={car.images[currentImage]}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setIsFullscreen(true)}
          />
        </div>

        {/* Side images - next */}
        {car.images.length > 1 && (
          <div
            className="hidden md:block absolute right-0 top-0 bottom-0 w-[15%] z-10 cursor-pointer"
            onClick={nextImage}
          >
            <img
              src={car.images[(currentImage + 1) % car.images.length]}
              alt="Next"
              className="w-full h-full object-cover opacity-40 hover:opacity-60 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent" />
          </div>
        )}

        {/* Navigation arrows */}
        {car.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 md:left-[16%] top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full transition-colors z-20"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 md:right-[16%] top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full transition-colors z-20"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        {/* Image counter */}
        <div className="absolute bottom-4 right-4 md:right-[16%] px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm z-20">
          {currentImage + 1} / {car.images.length}
        </div>

        {/* Specs bar at bottom - like Carloson */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent pt-12 pb-4">
          <div className="container mx-auto px-4 flex items-center justify-between">
            {/* Left side - will be filled by content below */}
            <div />
            {/* Right side - specs icons */}
            <div className="hidden md:flex items-center gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{car.seats}</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                <span>{car.transmission === 'automatic' ? 'Автомат' : 'Механика'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Fuel className="w-5 h-5" />
                <span>{fuelLabels[car.fuel]}</span>
              </div>
              {car.specifications?.power && (
                <div className="flex items-center gap-2">
                  <span>{car.specifications.power}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back button - desktop */}
        <button
          onClick={() => navigate(-1)}
          className="hidden lg:flex items-center gap-2 text-gray-500 hover:text-white mb-4 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к каталогу
        </button>

        {/* Car title and favorite */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {car.brand} {car.model}
            </h1>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-white">{car.rating}</span>
                <span>({car.reviews} отзывов)</span>
              </div>
              <span>•</span>
              <span>{car.year} год</span>
            </div>
          </div>
          <button
            onClick={handleFavoriteClick}
            className={cn(
              "p-3 rounded-full border transition-all",
              favorite
                ? "bg-yellow-500/10 border-yellow-500/50 text-yellow-500"
                : "border-dark-700 text-gray-500 hover:text-white hover:border-gray-500"
            )}
          >
            <Heart className={cn("w-6 h-6", favorite && "fill-current")} />
          </button>
        </div>

        {/* Pricing tabs */}
        <div className="mb-4">
          <div className="inline-flex gap-1 p-1 bg-dark-800/80 rounded-lg">
            {pricingTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-5 py-2.5 rounded-md font-medium transition-all text-sm",
                  activeTab === tab.id
                    ? "bg-yellow-500 text-black"
                    : "text-gray-400 hover:text-white"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing tiers */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {pricingTiers[activeTab].map((tier, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-xl transition-all cursor-pointer hover:scale-[1.02]",
                index === 0
                  ? "bg-dark-800 ring-1 ring-yellow-500/50"
                  : "bg-dark-800/60 hover:bg-dark-800"
              )}
            >
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">{tier.duration}</div>
              <div className="text-2xl font-bold text-white">
                {formatPrice(tier.price)}
                <span className="text-xs font-normal text-gray-500 ml-1">
                  {activeTab === 'daily' ? '/сут' : activeTab === 'monthly' ? '/мес' : ''}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Specs row */}
        <div className="flex flex-wrap items-center gap-6 py-4 px-5 bg-dark-800/60 rounded-xl mb-10 text-sm">
          <div className="flex items-center gap-2 text-gray-300">
            <Users className="w-4 h-4 text-gray-500" />
            <span>{car.seats} мест</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Settings className="w-4 h-4 text-gray-500" />
            <span>{car.transmission === 'automatic' ? 'Автомат' : 'Механика'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Fuel className="w-4 h-4 text-gray-500" />
            <span>{fuelLabels[car.fuel]}</span>
          </div>
          {car.specifications?.engine && (
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-gray-500">⛽</span>
              <span>{car.specifications.engine}</span>
            </div>
          )}
          {car.specifications?.power && (
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-gray-500 text-xs font-bold">л.с.</span>
              <span>{car.specifications.power}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {car.description && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-white mb-3">Описание</h2>
            <p className="text-gray-400 leading-relaxed">{car.description}</p>
          </div>
        )}

        {/* Features */}
        {car.features && car.features.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-white mb-4">Особенности</h2>
            <div className="flex flex-wrap gap-2">
              {car.features.map((feature, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-dark-800/80 text-gray-300 rounded-lg text-sm border border-dark-700/50"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Insurance info */}
        <div className="flex items-center gap-4 p-5 bg-dark-800/60 border border-dark-700/50 rounded-xl mb-10">
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <div className="font-medium text-white">Полная страховка включена</div>
            <div className="text-sm text-gray-500">КАСКО и ОСАГО уже включены в стоимость аренды</div>
          </div>
        </div>

        {/* Booking section */}
        <div className="bg-dark-800/60 border border-dark-700/50 rounded-2xl p-6 mb-10">
          <h2 className="text-lg font-semibold text-white mb-6">Забронировать</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            {/* Start date */}
            <CustomDatePicker
              value={startDate}
              onChange={setStartDate}
              label="Дата получения"
              minDate={new Date()}
            />

            {/* End date */}
            <CustomDatePicker
              value={endDate}
              onChange={setEndDate}
              label="Дата возврата"
              minDate={new Date(startDate)}
            />

            {/* Pickup location */}
            <CustomLocationSelector
              value={pickupLocation}
              onChange={setPickupLocation}
              label="Место получения"
              locations={locations}
            />

            {/* Return location */}
            <CustomLocationSelector
              value={returnLocation}
              onChange={setReturnLocation}
              label="Место возврата"
              locations={locations}
            />
          </div>

          {/* Price calculation */}
          <div className="flex items-center justify-between p-5 bg-dark-900/80 rounded-xl mb-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Итого за {days} {days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}</div>
              <div className="text-3xl font-bold text-yellow-500">{formatPrice(totalPrice)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Цена за день</div>
              <div className="text-xl text-white">{formatPrice(car.pricePerDay)}</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={handleBooking}
              disabled={!car.available}
              className="flex-1 py-4 px-8 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30"
            >
              {car.available ? 'Забронировать' : 'Недоступен'}
            </button>
            <button
              onClick={() => window.open('tel:+66123456789')}
              className="flex items-center justify-center gap-2 py-4 px-6 bg-white/5 backdrop-blur-sm border border-yellow-500/30 hover:border-yellow-500/60 hover:bg-yellow-500/10 text-yellow-500 font-medium rounded-xl transition-all duration-300"
            >
              <Phone className="w-5 h-5" />
              Позвонить
            </button>
            <button
              onClick={() => window.open('https://wa.me/66123456789')}
              className="flex items-center justify-center gap-2 py-4 px-6 bg-white/5 backdrop-blur-sm border border-yellow-500/30 hover:border-yellow-500/60 hover:bg-yellow-500/10 text-yellow-500 font-medium rounded-xl transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </button>
          </div>
        </div>

        {/* Similar cars */}
        {similarCars.length > 0 && (
          <SimilarCars cars={similarCars} />
        )}
      </div>

      {/* Fullscreen gallery */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>

            <img
              src={car.images[currentImage]}
              alt={`${car.brand} ${car.model}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {car.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-8 h-8 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <ChevronRight className="w-8 h-8 text-white" />
                </button>
              </>
            )}

            {/* Thumbnail strip in fullscreen */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {car.images.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImage(index);
                  }}
                  className={cn(
                    "w-16 h-12 rounded-lg overflow-hidden border-2 transition-all",
                    index === currentImage
                      ? "border-yellow-400"
                      : "border-transparent opacity-50 hover:opacity-100"
                  )}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
