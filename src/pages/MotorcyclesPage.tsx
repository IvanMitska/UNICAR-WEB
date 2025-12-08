import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
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

  // Close sort dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div className="bg-black min-h-screen pt-6 lg:pt-8">
      <div className="container mx-auto px-4">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="w-full bg-dark-900/50 backdrop-blur-xl border border-dark-800/50 rounded-xl px-4 py-3 flex items-center justify-between text-white hover:bg-dark-800/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">Фильтры</span>
              {[filters.category, filters.brand, filters.transmission, filters.fuel].filter(v => v && v !== '').length > 0 && (
                <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-semibold">
                  {[filters.category, filters.brand, filters.transmission, filters.fuel].filter(v => v && v !== '').length}
                </span>
              )}
            </div>
            <span className="text-sm text-gray-400">Нажмите для открытия</span>
          </button>
        </div>

        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-6 lg:mb-8">
          {filters.category ? (
            <>
              <span className="text-gray-400">Категория: </span>
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                {filters.category === 'scooter' ? 'Скутеры' :
                 filters.category === 'sport' ? 'Спортбайки' :
                 filters.category === 'touring' ? 'Туринги' :
                 filters.category === 'cruiser' ? 'Круизеры' :
                 filters.category === 'adventure' ? 'Адвенчер' : filters.category}
              </span>
            </>
          ) : 'Все мотоциклы'}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
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
                className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="absolute left-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
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
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-gray-400">
                Найдено: <span className="font-semibold text-white">{filteredMotorcycles.length}</span> мотоциклов
              </p>

              {/* Custom Sort Dropdown */}
              <div ref={sortRef} className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-black/20 backdrop-blur-xl border border-white/10 text-white rounded-xl flex items-center justify-between gap-8 hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm">{sortOptions.find(o => o.value === filters.sortBy)?.label}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-full sm:w-56 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-50 shadow-xl"
                    >
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleSortChange(option.value)}
                          className={`w-full px-4 py-3 text-left text-sm flex items-center justify-between transition-colors ${
                            filters.sortBy === option.value
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'text-gray-300 hover:bg-white/5 hover:text-white'
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