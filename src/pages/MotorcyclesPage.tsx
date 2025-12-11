import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, Check, X } from 'lucide-react';
import { motorcycles } from '../data/motorcycles';
import { MotorcycleFiltersAdvanced } from '../components/sections/MotorcycleFiltersAdvanced';
import { MotorcycleGrid } from '../components/sections/MotorcycleGrid';

const sortOptions = [
  { value: 'price-asc', label: 'Сначала дешевле' },
  { value: 'price-desc', label: 'Сначала дороже' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'popular', label: 'По популярности' },
];

export const MotorcyclesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState({
    category: categoryFromUrl || '',
    priceMin: 0,
    priceMax: 2000,
    transmission: '',
    fuel: '',
    searchQuery: '',
    sortBy: 'price-asc',
    brand: '',
    engineSize: '',
  });

  useEffect(() => {
    if (categoryFromUrl) {
      setFilters(prev => ({ ...prev, category: categoryFromUrl }));
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileFilterOpen]);

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

  const getCategoryName = (cat: string) => {
    const names: Record<string, string> = {
      scooter: 'Скутеры',
      sport: 'Спортбайки',
      touring: 'Туринги',
      cruiser: 'Круизеры',
      adventure: 'Адвенчер',
    };
    return names[cat] || cat;
  };

  const filteredMotorcycles = useMemo(() => {
    let result = [...motorcycles];

    if (filters.category) {
      result = result.filter(motorcycle => motorcycle.category === filters.category);
    }

    if (filters.transmission) {
      result = result.filter(motorcycle => motorcycle.transmission === filters.transmission);
    }

    if (filters.fuel) {
      result = result.filter(motorcycle => motorcycle.fuel === filters.fuel);
    }

    if (filters.brand) {
      result = result.filter(motorcycle => motorcycle.brand.toLowerCase() === filters.brand.toLowerCase());
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(motorcycle =>
        motorcycle.brand.toLowerCase().includes(query) ||
        motorcycle.model.toLowerCase().includes(query)
      );
    }

    result = result.filter(motorcycle =>
      motorcycle.pricePerDay >= filters.priceMin && motorcycle.pricePerDay <= filters.priceMax
    );

    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case 'price-desc':
        result.sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        result.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return result;
  }, [filters]);

  return (
    <div className="bg-white min-h-screen pt-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="py-8 lg:py-12 border-b border-primary-100 mb-8">
          <h1 className="text-3xl lg:text-4xl font-medium text-primary-900 mb-2">
            {filters.category ? getCategoryName(filters.category) : 'Мотоциклы'}
          </h1>
          <p className="text-primary-500">
            {filteredMotorcycles.length} {filteredMotorcycles.length === 1 ? 'мотоцикл' :
              filteredMotorcycles.length < 5 ? 'мотоцикла' : 'мотоциклов'} в наличии
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="w-full border border-primary-200 rounded-md px-4 py-3 flex items-center justify-between text-primary-900 hover:border-primary-400 transition-colors"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              <span className="font-medium">Фильтры</span>
              {[filters.category, filters.brand, filters.transmission, filters.fuel].filter(v => v && v !== '').length > 0 && (
                <span className="bg-primary-900 text-white text-xs px-2 py-0.5 rounded-full">
                  {[filters.category, filters.brand, filters.transmission, filters.fuel].filter(v => v && v !== '').length}
                </span>
              )}
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block lg:col-span-1">
            <MotorcycleFiltersAdvanced filters={filters} setFilters={setFilters} />
          </div>

          {/* Mobile Filters Modal */}
          <AnimatePresence>
            {isMobileFilterOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 z-50 bg-black/50"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-white overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="sticky top-0 bg-white border-b border-primary-100 px-4 py-4 flex items-center justify-between">
                    <span className="font-medium text-primary-900">Фильтры</span>
                    <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 -mr-2">
                      <X className="w-5 h-5 text-primary-500" />
                    </button>
                  </div>
                  <MotorcycleFiltersAdvanced
                    filters={filters}
                    setFilters={setFilters}
                    onClose={() => setIsMobileFilterOpen(false)}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="lg:col-span-3">
            {/* Sort */}
            <div className="mb-6 flex justify-end">
              <div ref={sortRef} className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="px-4 py-2.5 border border-primary-200 text-primary-900 rounded-md flex items-center gap-3 hover:border-primary-400 transition-colors"
                >
                  <span className="text-sm">{sortOptions.find(o => o.value === filters.sortBy)?.label}</span>
                  <ChevronDown className={`w-4 h-4 text-primary-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white border border-primary-200 rounded-md overflow-hidden z-50 shadow-soft-lg"
                    >
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleSortChange(option.value)}
                          className={`w-full px-4 py-3 text-left text-sm flex items-center justify-between transition-colors ${
                            filters.sortBy === option.value
                              ? 'bg-primary-50 text-primary-900'
                              : 'text-primary-600 hover:bg-primary-50'
                          }`}
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

            <MotorcycleGrid motorcycles={filteredMotorcycles} showRentalPrice={true} />
          </div>
        </div>
      </div>
    </div>
  );
};
