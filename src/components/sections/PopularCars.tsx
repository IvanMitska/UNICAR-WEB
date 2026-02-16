import React, { useRef, useState, useEffect, useCallback, memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cars } from '../../data/cars';
import { formatPrice } from '../../utils/formatters';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

// Helper to get WebP path from original image path
const getWebPPath = (src: string): string => {
  const lastDot = src.lastIndexOf('.');
  if (lastDot === -1) return src;
  return `${src.substring(0, lastDot)}.webp`;
};

// Explicitly define which cars to show in Popular Models
const POPULAR_CAR_IDS = [
  'mustang-yellow-2021',
  'mustang-yellow-2016',
  'mustang-blue-2020',
  'mustang-white-2020',
  'bmw-x5-2020',
];

const PopularCarsComponent: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const popularCars = useMemo(() =>
    POPULAR_CAR_IDS.map(id => cars.find(car => car.id === id)).filter(Boolean) as typeof cars,
  []);
  const totalSlides = popularCars.length;

  const updateScrollState = useCallback(() => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;

    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < maxScroll - 10);

    const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 0;
    const gap = 24;
    const newIndex = Math.round(scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(newIndex, totalSlides - 1));
  }, [totalSlides]);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    scrollEl.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();

    return () => scrollEl.removeEventListener('scroll', updateScrollState);
  }, [updateScrollState]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (!scrollRef.current) return;

    const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 400;
    const gap = 24;
    const scrollAmount = direction === 'left' ? -(cardWidth + gap) : (cardWidth + gap);

    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }, []);

  return (
    <section className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 lg:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gray-400 uppercase tracking-[0.2em] text-xs font-medium mb-3">
              Featured Vehicles
            </p>
            <h2 className="text-3xl lg:text-5xl font-light text-gray-900 tracking-tight">
              Popular Models
            </h2>
          </motion.div>

          {/* Navigation Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-4"
          >
            {/* Slide Counter */}
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-900 font-medium tabular-nums">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <div className="w-8 h-px bg-gray-300" />
              <span className="text-gray-400 tabular-nums">
                {String(totalSlides).padStart(2, '0')}
              </span>
            </div>

            {/* Arrow Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  canScrollLeft
                    ? 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                    : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  canScrollRight
                    ? 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                    : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto overflow-y-hidden pb-4 -mx-6 px-6 scrollbar-none scroll-smooth"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollPaddingLeft: '24px',
            }}
          >
            {popularCars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[380px]"
                style={{ scrollSnapAlign: 'start' }}
              >
                <Link to={`/cars/${car.id}`} className="group block">
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-gray-100">
                    <picture>
                      <source srcSet={getWebPPath(car.image)} type="image/webp" />
                      <img
                        src={car.image}
                        alt={`${car.brand} ${car.model}`}
                        loading={index < 2 ? "eager" : "lazy"}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </picture>
                  </div>

                  {/* Info */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {car.year} • {car.transmission === 'automatic' ? 'Automatic' : 'Manual'} • {car.seats} seats
                    </p>
                    <p className="text-gray-900 font-medium">
                      {formatPrice(car.pricePerDay)}
                      <span className="text-gray-400 font-normal">/day</span>
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* View All Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[380px]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <Link
                to="/cars"
                className="group flex flex-col items-center justify-center aspect-[4/3] rounded-2xl bg-gray-900 text-white relative overflow-hidden transition-all duration-500 hover:bg-gray-800"
              >
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center mb-5 mx-auto group-hover:border-white/60 group-hover:bg-white/10 transition-all duration-300">
                    <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                  <p className="text-2xl font-light mb-2">View All</p>
                  <p className="text-white/50 text-sm">{cars.length} vehicles available</p>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 lg:mt-10">
          <div className="h-px bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gray-900 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((activeIndex + 1) / totalSlides) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const PopularCars = memo(PopularCarsComponent);
