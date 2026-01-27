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

  const handleMobileFilterOpen = useCallback(() => {
    setIsMobileFilterOpen(true);
  }, []);

  const handleMobileFilterClose = useCallback(() => {
    setIsMobileFilterOpen(false);
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
    const query = filters.searchQuery?.toLowerCase() || '';
    const brandFilter = filters.brand?.toLowerCase() || '';

    // Один проход фильтрации вместо 6 последовательных filter()
    const result = motorcycles.filter(motorcycle => {
      if (filters.category && motorcycle.category !== filters.category) return false;
      if (filters.transmission && motorcycle.transmission !== filters.transmission) return false;
      if (filters.fuel && motorcycle.fuel !== filters.fuel) return false;
      if (brandFilter && motorcycle.brand.toLowerCase() !== brandFilter) return false;
      if (motorcycle.pricePerDay < filters.priceMin || motorcycle.pricePerDay > filters.priceMax) return false;
      if (query && !motorcycle.brand.toLowerCase().includes(query) && !motorcycle.model.toLowerCase().includes(query)) return false;
      return true;
    });

    // Сортировка
    const sortFns: Record<string, (a: typeof motorcycles[0], b: typeof motorcycles[0]) => number> = {
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
    <div className="bg-white min-h-screen pt-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="py-12 lg:py-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-light text-primary-900 mb-3"
          >
            {filters.category ? getCategoryName(filters.category) : 'Мотоциклы'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-primary-400 text-lg"
          >
            {filteredMotorcycles.length} {filteredMotorcycles.length === 1 ? 'мотоцикл' :
              filteredMotorcycles.length < 5 ? 'мотоцикла' : 'мотоциклов'} в наличии
          </motion.p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 pb-8 border-b border-primary-100">
          {/* Mobile Filter Button */}
          <button
            onClick={handleMobileFilterOpen}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-primary-50 rounded-lg text-primary-900 hover:bg-primary-100 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="font-medium text-sm">Фильтры</span>
          </button>

          {/* Spacer for desktop */}
          <div className="hidden lg:block" />

          {/* Sort Dropdown */}
          <div ref={sortRef} className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <span className="text-sm text-primary-700">{sortOptions.find(o => o.value === filters.sortBy)?.label}</span>
              <ChevronDown className={`w-4 h-4 text-primary-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-primary-100 rounded-xl overflow-hidden z-50 shadow-lg"
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 py-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <MotorcycleFiltersAdvanced filters={filters} setFilters={setFilters} />
            </div>
          </div>

          {/* Mobile Filters Modal */}
          <AnimatePresence>
            {isMobileFilterOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 z-50 bg-black/50"
                onClick={handleMobileFilterClose}
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
                    <button onClick={handleMobileFilterClose} className="p-2 -mr-2">
                      <X className="w-5 h-5 text-primary-500" />
                    </button>
                  </div>
                  <MotorcycleFiltersAdvanced
                    filters={filters}
                    setFilters={setFilters}
                    onClose={handleMobileFilterClose}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="lg:col-span-3">
            <MotorcycleGrid motorcycles={filteredMotorcycles} showRentalPrice={true} />
          </div>
        </div>
      </div>
    </div>
  );
};
