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
  const [imageAspect, setImageAspect] = useState<'landscape' | 'portrait' | 'square'>('landscape');

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

  // Detect image aspect ratio
  useEffect(() => {
    if (car && car.images[currentImage]) {
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        if (ratio > 1.2) {
          setImageAspect('landscape');
        } else if (ratio < 0.8) {
          setImageAspect('portrait');
        } else {
          setImageAspect('square');
        }
      };
      img.src = car.images[currentImage];
    }
  }, [car, currentImage]);

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
      <div className={cn(
        "relative bg-dark-950 overflow-hidden transition-all duration-300",
        // Mobile: always 60vh with object-cover | Desktop: adaptive based on aspect
        "h-[60vh]",
        "lg:h-auto",
        imageAspect === 'portrait' ? "lg:h-[85vh]" : imageAspect === 'square' ? "lg:h-[70vh]" : "lg:h-[65vh]"
      )}>
        {/* Side images - previous (only for landscape) */}
        {car.images.length > 1 && imageAspect === 'landscape' && (
          <div
            className="hidden lg:block absolute left-0 top-0 bottom-0 w-[12%] z-10 cursor-pointer overflow-hidden"
            onClick={prevImage}
          >
            <img
              src={car.images[(currentImage - 1 + car.images.length) % car.images.length]}
              alt="Previous"
              className="w-full h-full object-cover object-center opacity-50 hover:opacity-70 transition-opacity scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
          </div>
        )}

        {/* Main image - centered */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center",
          imageAspect === 'landscape' && "lg:left-[12%] lg:right-[12%]"
        )}>
          <motion.img
            key={currentImage}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            src={car.images[currentImage]}
            alt={`${car.brand} ${car.model}`}
            className={cn(
              "cursor-pointer transition-all w-full h-full",
              // Mobile: always object-cover to fill space
              "object-cover",
              // Desktop: adaptive based on aspect ratio
              imageAspect === 'portrait' ? "lg:object-contain lg:w-auto lg:h-full" :
              imageAspect === 'square' ? "lg:object-contain lg:w-auto lg:h-full" :
              "lg:object-cover lg:object-center"
            )}
            onClick={() => setIsFullscreen(true)}
          />
        </div>

        {/* Side images - next (only for landscape) */}
        {car.images.length > 1 && imageAspect === 'landscape' && (
          <div
            className="hidden lg:block absolute right-0 top-0 bottom-0 w-[12%] z-10 cursor-pointer overflow-hidden"
            onClick={nextImage}
          >
            <img
              src={car.images[(currentImage + 1) % car.images.length]}
              alt="Next"
              className="w-full h-full object-cover object-center opacity-50 hover:opacity-70 transition-opacity scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/70 to-black/30" />
          </div>
        )}

        {/* Navigation arrows */}
        {car.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition-colors z-20",
                imageAspect === 'landscape' ? "left-4 lg:left-[14%]" : "left-4"
              )}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextImage}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition-colors z-20",
                imageAspect === 'landscape' ? "right-4 lg:right-[14%]" : "right-4"
              )}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        {/* Image counter */}
        <div className={cn(
          "absolute bottom-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm z-20",
          imageAspect === 'landscape' ? "right-4 lg:right-[14%]" : "right-4"
        )}>
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back button - desktop */}
        <button
          onClick={() => navigate(-1)}
          className="hidden lg:flex items-center gap-2 text-gray-400 hover:text-yellow-500 mb-6 transition-colors text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Назад к каталогу
        </button>

        {/* Main Glass Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">

          {/* Header - Compact */}
          <div className="p-4 md:p-8 border-b border-white/5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-2xl md:text-4xl font-bold text-white truncate">
                  {car.brand} {car.model}
                </h1>
                <div className="flex items-center gap-3 text-sm mt-1">
                  <span className="text-gray-500">{car.year}</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs",
                    car.available ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  )}>
                    {car.available ? 'Доступен' : 'Занят'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleFavoriteClick}
                className={cn(
                  "p-2.5 rounded-xl border transition-all flex-shrink-0",
                  favorite
                    ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-500"
                    : "bg-white/5 border-white/10 text-gray-500"
                )}
              >
                <Heart className={cn("w-5 h-5", favorite && "fill-current")} />
              </button>
            </div>
          </div>

          {/* Specs - Simple line on mobile */}
          <div className="px-4 md:px-8 py-3 border-b border-white/5 flex items-center gap-4 text-sm text-gray-400 overflow-x-auto">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Users className="w-4 h-4 text-yellow-500" />
              {car.seats}
            </span>
            <span className="text-white/20">•</span>
            <span className="whitespace-nowrap">{car.transmission === 'automatic' ? 'Автомат' : 'Механика'}</span>
            <span className="text-white/20">•</span>
            <span className="whitespace-nowrap">{fuelLabels[car.fuel]}</span>
            {car.specifications?.power && (
              <>
                <span className="text-white/20">•</span>
                <span className="whitespace-nowrap">{car.specifications.power}</span>
              </>
            )}
          </div>

          {/* Pricing Section */}
          <div className="p-4 md:p-8 border-b border-white/5">
            {/* Pricing tabs - horizontal scroll on mobile */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-1 px-1">
              {pricingTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-all text-sm whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-yellow-500 text-black"
                      : "bg-white/5 text-gray-400"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Pricing tiers - simpler on mobile */}
            <div className="space-y-2">
              {pricingTiers[activeTab].map((tier, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl",
                    index === 0
                      ? "bg-yellow-500/10 border border-yellow-500/20"
                      : "bg-white/5"
                  )}
                >
                  <span className="text-sm text-gray-400">{tier.duration}</span>
                  <span className="text-lg font-bold text-white">
                    {formatPrice(tier.price)}
                    <span className="text-xs font-normal text-gray-500 ml-1">
                      {activeTab === 'daily' ? '/сут' : activeTab === 'monthly' ? '/мес' : ''}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Description & Features - Compact on mobile */}
          {(car.description || (car.features && car.features.length > 0)) && (
            <div className="p-4 md:p-8 border-b border-white/5">
              {car.description && (
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{car.description}</p>
              )}

              {car.features && car.features.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {car.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-white/5 text-gray-400 rounded-md text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Insurance Badge - Compact */}
          <div className="mx-4 md:mx-8 my-4 flex items-center gap-3 p-3 bg-green-500/5 border border-green-500/20 rounded-xl">
            <Shield className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-sm text-gray-300">Страховка КАСКО и ОСАГО включена</span>
          </div>

          {/* Booking Section */}
          <div className="p-4 md:p-8 bg-white/[0.02]">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <CustomDatePicker
                value={startDate}
                onChange={setStartDate}
                label="Получение"
                minDate={new Date()}
              />
              <CustomDatePicker
                value={endDate}
                onChange={setEndDate}
                label="Возврат"
                minDate={new Date(startDate)}
              />
              <CustomLocationSelector
                value={pickupLocation}
                onChange={setPickupLocation}
                label="Откуда"
                locations={locations}
              />
              <CustomLocationSelector
                value={returnLocation}
                onChange={setReturnLocation}
                label="Куда"
                locations={locations}
              />
            </div>

            {/* Price Summary - Compact */}
            <div className="flex items-center justify-between p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20 mb-4">
              <div>
                <div className="text-xs text-gray-400">{days} {days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}</div>
                <div className="text-2xl font-bold text-yellow-500">{formatPrice(totalPrice)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">за день</div>
                <div className="text-lg text-white">{formatPrice(car.pricePerDay)}</div>
              </div>
            </div>

            {/* Action buttons - Stack on mobile */}
            <button
              onClick={handleBooking}
              disabled={!car.available}
              className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-3"
            >
              {car.available ? 'Забронировать' : 'Недоступен'}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => window.open('tel:+66959651805')}
                className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl transition-all"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">Позвонить</span>
              </button>
              <button
                onClick={() => window.open('https://wa.me/66959651805')}
                className="flex items-center justify-center gap-2 py-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Similar cars */}
        {similarCars.length > 0 && (
          <div className="mt-12">
            <SimilarCars cars={similarCars} />
          </div>
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
