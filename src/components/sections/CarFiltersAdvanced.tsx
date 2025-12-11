import React, { useState, useCallback } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Filters {
  category: string;
  priceMin: number;
  priceMax: number;
  transmission: string;
  fuel: string;
  searchQuery: string;
  sortBy: string;
  brand: string;
  year: { min: number; max: number };
  seats: number;
}

interface CarFiltersAdvancedProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onClose?: () => void;
}

const categories = [
  { id: '', name: 'Все' },
  { id: 'suv', name: 'Внедорожники' },
  { id: 'premium', name: 'Премиум' },
  { id: 'business', name: 'Бизнес' },
  { id: 'sport', name: 'Спорткары' },
  { id: 'comfort', name: 'Комфорт' },
  { id: 'electric', name: 'Электро' },
];

const transmissionOptions = [
  { value: '', label: 'Любая' },
  { value: 'automatic', label: 'Автомат' },
  { value: 'manual', label: 'Механика' },
];

const fuelOptions = [
  { value: '', label: 'Любое' },
  { value: 'petrol', label: 'Бензин' },
  { value: 'diesel', label: 'Дизель' },
  { value: 'hybrid', label: 'Гибрид' },
  { value: 'electric', label: 'Электро' },
];

export const CarFiltersAdvanced: React.FC<CarFiltersAdvancedProps> = ({ filters, setFilters, onClose }) => {
  const [expanded, setExpanded] = useState({
    categories: true,
    price: true,
    transmission: true,
    fuel: false,
  });

  const toggle = useCallback((key: keyof typeof expanded) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const updateFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, [setFilters]);

  const handleReset = useCallback(() => {
    setFilters({
      category: '',
      priceMin: 0,
      priceMax: 20000,
      transmission: '',
      fuel: '',
      searchQuery: '',
      sortBy: 'price-asc',
      brand: '',
      year: { min: 2015, max: 2024 },
      seats: 0,
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
            placeholder="Поиск по марке..."
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
          <span className="text-sm font-medium text-primary-900">Категория</span>
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
          <span className="text-sm font-medium text-primary-900">Цена за день</span>
          <ChevronDown className={cn('w-4 h-4 text-primary-400 transition-transform', expanded.price && 'rotate-180')} />
        </button>
        {expanded.price && (
          <div className="px-4 lg:px-0 pb-4 space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={filters.priceMin || ''}
                onChange={(e) => updateFilter('priceMin', Number(e.target.value) || 0)}
                placeholder="От"
                className="w-full px-3 py-2 bg-primary-50 border border-primary-200 text-primary-900 text-sm rounded-md focus:outline-none focus:border-primary-400 transition-colors"
              />
              <span className="text-primary-300">—</span>
              <input
                type="number"
                value={filters.priceMax || ''}
                onChange={(e) => updateFilter('priceMax', Number(e.target.value) || 20000)}
                placeholder="До"
                className="w-full px-3 py-2 bg-primary-50 border border-primary-200 text-primary-900 text-sm rounded-md focus:outline-none focus:border-primary-400 transition-colors"
              />
            </div>

            <input
              type="range"
              min={0}
              max={20000}
              step={500}
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
          <span className="text-sm font-medium text-primary-900">Коробка передач</span>
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
          <span className="text-sm font-medium text-primary-900">Топливо</span>
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
          Сбросить фильтры
        </button>
      </div>

      {/* Apply Button - mobile only */}
      {onClose && (
        <div className="p-4 border-t border-primary-100">
          <button
            onClick={onClose}
            className="w-full bg-primary-900 text-white py-3 rounded-md text-sm font-medium hover:bg-primary-800 transition-colors"
          >
            Показать результаты
          </button>
        </div>
      )}
    </div>
  );
};
