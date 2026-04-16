import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MotorcycleFilters {
  category: string;
  priceMin: number;
  priceMax: number;
  transmission: string;
  fuel: string;
  searchQuery: string;
  sortBy: string;
  brand: string;
  engineSize: string;
}

interface MotorcycleFiltersAdvancedProps {
  filters: MotorcycleFilters;
  setFilters: React.Dispatch<React.SetStateAction<MotorcycleFilters>>;
  onClose?: () => void;
}

export const MotorcycleFiltersAdvanced: React.FC<MotorcycleFiltersAdvancedProps> = ({
  filters,
  setFilters,
  onClose,
}) => {
  const { t } = useTranslation();

  const categories = [
    { id: '', name: t('categories.all') },
    { id: 'scooter', name: t('motorcycleCategories.scooters') },
    { id: 'sport', name: t('motorcycleCategories.sportbikes') },
    { id: 'touring', name: t('motorcycleCategories.tourings') },
    { id: 'cruiser', name: t('motorcycleCategories.cruisers') },
    { id: 'adventure', name: t('motorcycleCategories.adventures') },
  ];

  const transmissionOptions = [
    { value: '', label: t('transmission.any') },
    { value: 'automatic', label: t('transmission.automatic') },
    { value: 'manual', label: t('transmission.manual') },
  ];

  const fuelOptions = [
    { value: '', label: t('fuel.any') },
    { value: 'petrol', label: t('fuel.petrol') },
    { value: 'electric', label: t('fuel.electric') },
  ];

  const [expanded, setExpanded] = useState({
    categories: true,
    price: true,
    transmission: true,
    fuel: false,
  });

  const toggle = useCallback((key: keyof typeof expanded) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const updateFilter = useCallback(<K extends keyof MotorcycleFilters>(key: K, value: MotorcycleFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, [setFilters]);

  const handleReset = useCallback(() => {
    setFilters({
      category: '',
      priceMin: 0,
      priceMax: 2000,
      transmission: '',
      fuel: '',
      searchQuery: '',
      sortBy: 'price-asc',
      brand: '',
      engineSize: '',
    });
  }, [setFilters]);

  return (
    <div className="bg-white">
      {/* Search */}
      <div className="p-4 lg:p-0 lg:pb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            placeholder={t('form.searchByBrand')}
            className="w-full pl-10 pr-4 py-3 bg-primary-50 border border-primary-200 text-primary-900 text-sm rounded-md focus:outline-none focus:border-primary-400 placeholder-primary-400 transition-colors"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="border-t border-primary-100">
        <button
          onClick={() => toggle('categories')}
          className="w-full px-4 lg:px-0 py-4 flex items-center justify-between hover:bg-primary-50 lg:hover:bg-transparent transition-colors"
        >
          <span className="text-sm font-medium text-primary-900">{t('filters.category')}</span>
          <ChevronDown className={cn('w-4 h-4 text-primary-400 transition-transform', expanded.categories && 'rotate-180')} />
        </button>
        {expanded.categories && (
          <div className="px-4 lg:px-0 pb-4 space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateFilter('category', cat.id)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                  filters.category === cat.id
                    ? 'bg-primary-900 text-white'
                    : 'text-primary-600 hover:bg-primary-50'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="border-t border-primary-100">
        <button
          onClick={() => toggle('price')}
          className="w-full px-4 lg:px-0 py-4 flex items-center justify-between hover:bg-primary-50 lg:hover:bg-transparent transition-colors"
        >
          <span className="text-sm font-medium text-primary-900">{t('filters.pricePerDay')}</span>
          <ChevronDown className={cn('w-4 h-4 text-primary-400 transition-transform', expanded.price && 'rotate-180')} />
        </button>
        {expanded.price && (
          <div className="px-4 lg:px-0 pb-4 space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={filters.priceMin || ''}
                onChange={(e) => updateFilter('priceMin', Number(e.target.value) || 0)}
                placeholder={t('form.from')}
                className="w-full px-3 py-2 bg-primary-50 border border-primary-200 text-primary-900 text-sm rounded-md focus:outline-none focus:border-primary-400 transition-colors"
              />
              <span className="text-primary-300">—</span>
              <input
                type="number"
                value={filters.priceMax || ''}
                onChange={(e) => updateFilter('priceMax', Number(e.target.value) || 2000)}
                placeholder={t('form.to')}
                className="w-full px-3 py-2 bg-primary-50 border border-primary-200 text-primary-900 text-sm rounded-md focus:outline-none focus:border-primary-400 transition-colors"
              />
            </div>

            <input
              type="range"
              min={0}
              max={2000}
              step={50}
              value={filters.priceMax}
              onChange={(e) => updateFilter('priceMax', Number(e.target.value))}
              className="w-full accent-primary-900 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-primary-500">
              <span>0 ฿</span>
              <span className="font-medium text-primary-900">{filters.priceMax.toLocaleString()} ฿</span>
            </div>
          </div>
        )}
      </div>

      {/* Transmission */}
      <div className="border-t border-primary-100">
        <button
          onClick={() => toggle('transmission')}
          className="w-full px-4 lg:px-0 py-4 flex items-center justify-between hover:bg-primary-50 lg:hover:bg-transparent transition-colors"
        >
          <span className="text-sm font-medium text-primary-900">{t('filters.transmission')}</span>
          <ChevronDown className={cn('w-4 h-4 text-primary-400 transition-transform', expanded.transmission && 'rotate-180')} />
        </button>
        {expanded.transmission && (
          <div className="px-4 lg:px-0 pb-4 flex flex-wrap gap-2">
            {transmissionOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateFilter('transmission', option.value)}
                className={cn(
                  'px-4 py-2 rounded-md text-sm transition-colors border',
                  filters.transmission === option.value
                    ? 'bg-primary-900 text-white border-primary-900'
                    : 'text-primary-600 border-primary-200 hover:border-primary-400'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fuel */}
      <div className="border-t border-primary-100">
        <button
          onClick={() => toggle('fuel')}
          className="w-full px-4 lg:px-0 py-4 flex items-center justify-between hover:bg-primary-50 lg:hover:bg-transparent transition-colors"
        >
          <span className="text-sm font-medium text-primary-900">{t('filters.fuel')}</span>
          <ChevronDown className={cn('w-4 h-4 text-primary-400 transition-transform', expanded.fuel && 'rotate-180')} />
        </button>
        {expanded.fuel && (
          <div className="px-4 lg:px-0 pb-4 flex flex-wrap gap-2">
            {fuelOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateFilter('fuel', option.value)}
                className={cn(
                  'px-4 py-2 rounded-md text-sm transition-colors border',
                  filters.fuel === option.value
                    ? 'bg-primary-900 text-white border-primary-900'
                    : 'text-primary-600 border-primary-200 hover:border-primary-400'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reset */}
      <div className="border-t border-primary-100 px-4 lg:px-0 py-4">
        <button
          onClick={handleReset}
          className="text-sm text-primary-500 hover:text-primary-900 transition-colors"
        >
          {t('buttons.resetFilters')}
        </button>
      </div>

      {/* Apply Button - mobile only */}
      {onClose && (
        <div className="p-4 border-t border-primary-100">
          <button
            onClick={onClose}
            className="w-full bg-primary-900 text-white py-3 rounded-md text-sm font-medium hover:bg-primary-800 transition-colors"
          >
            {t('buttons.showResults')}
          </button>
        </div>
      )}
    </div>
  );
};
