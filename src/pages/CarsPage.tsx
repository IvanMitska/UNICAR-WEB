import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
// Using static car data directly - API integration can be added later
import { useSearchParams } from 'react-router-dom';
import { CarGrid } from '../components/sections/CarGrid';
import { cars as staticCars } from '../data/cars';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

const sortOptions = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

const categoryTabs = [
  { value: '', label: 'All' },
  { value: 'premium', label: 'Luxury Cars' },
  { value: 'suv', label: 'Luxury SUVs' },
  { value: 'sport', label: 'Sports Cars' },
  { value: 'economy', label: 'Economy' },
];

export const CarsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || '';
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState({
    category: categoryFromUrl,
    sortBy: 'price-desc',
  });

  useEffect(() => {
    setFilters(prev => ({ ...prev, category: categoryFromUrl }));
  }, [categoryFromUrl]);

  const handleCategoryChange = useCallback((category: string) => {
    setFilters(prev => ({ ...prev, category }));
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  }, [setSearchParams]);

  const handleSortChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, sortBy: value }));
    setIsSortOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCars = useMemo(() => {
    let result = [...staticCars];

    // Filter by category
    if (filters.category) {
      result = result.filter(car => car.category === filters.category);
    }

    // Sort
    const sortFns: Record<string, (a: typeof staticCars[0], b: typeof staticCars[0]) => number> = {
      'price-asc': (a, b) => a.pricePerDay - b.pricePerDay,
      'price-desc': (a, b) => b.pricePerDay - a.pricePerDay,
      'rating': (a, b) => b.rating - a.rating,
      'popular': (a, b) => b.reviews - a.reviews,
    };

    const sortFn = sortFns[filters.sortBy];
    if (sortFn) result.sort(sortFn);

    return result;
  }, [filters]);

  return (
    <div className="bg-gray-50 min-h-screen pt-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="py-10 lg:py-14 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-light text-gray-900 mb-3"
          >
            Find Your Perfect Ride
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            Browse our collection of premium vehicles
          </motion.p>
        </div>

        {/* Tabs and Sort */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 border-b border-gray-200">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {categoryTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleCategoryChange(tab.value)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                  filters.category === tab.value
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div ref={sortRef} className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full hover:border-gray-300 transition-colors"
            >
              <span className="text-sm text-gray-700">
                {sortOptions.find(o => o.value === filters.sortBy)?.label}
              </span>
              <ChevronDown className={cn(
                "w-4 h-4 text-gray-400 transition-transform",
                isSortOpen && "rotate-180"
              )} />
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl overflow-hidden z-50 shadow-lg"
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={cn(
                        "w-full px-4 py-3 text-left text-sm flex items-center justify-between transition-colors",
                        filters.sortBy === option.value
                          ? "bg-gray-50 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {option.label}
                      {filters.sortBy === option.value && (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Results count */}
        <div className="py-6">
          <p className="text-gray-400 text-sm">
            {filteredCars.length} {filteredCars.length === 1 ? 'vehicle' : 'vehicles'} available
          </p>
        </div>

        {/* Car Grid - Full Width */}
        <div className="pb-16">
          <CarGrid cars={filteredCars} showRentalPrice={false} />
        </div>
      </div>
    </div>
  );
};
