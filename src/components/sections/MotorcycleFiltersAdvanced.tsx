import React, { useState, useCallback } from 'react';
import { Search, ChevronDown, SlidersHorizontal } from 'lucide-react';

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

const brands = [
  { id: 'honda', name: 'Honda', logo: '/images/brands/honda.png' },
  { id: 'yamaha', name: 'Yamaha', logo: '/images/brands/yamaha.png' },
  { id: 'kawasaki', name: 'Kawasaki', logo: '/images/brands/kawasaki.png' },
  { id: 'vespa', name: 'Vespa', logo: '/images/brands/vespa.png' },
  { id: 'bmw', name: 'BMW', logo: '/images/brands/bmw.png' },
  { id: 'niu', name: 'NIU', logo: '/images/brands/niu.png' },
];

const categories = [
  { id: '', name: 'Все' },
  { id: 'scooter', name: 'Скутеры' },
  { id: 'sport', name: 'Спортбайки' },
  { id: 'touring', name: 'Туринги' },
  { id: 'cruiser', name: 'Круизеры' },
  { id: 'adventure', name: 'Адвенчер' },
];

const engineSizes = ['125cc', '150cc', '155cc', '300cc', '500cc+'];

const transmissionOptions = [
  { value: '', label: 'Любая' },
  { value: 'automatic', label: 'Автомат' },
  { value: 'manual', label: 'Механика' },
];

const fuelOptions = [
  { value: '', label: 'Любое' },
  { value: 'petrol', label: 'Бензин' },
  { value: 'electric', label: 'Электро' },
];

export const MotorcycleFiltersAdvanced: React.FC<MotorcycleFiltersAdvancedProps> = ({
  filters,
  setFilters,
  onClose,
}) => {
  const [expanded, setExpanded] = useState({
    categories: true,
    brands: true,
    price: true,
    engine: false,
    transmission: false,
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
    <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-yellow-500" />
            Фильтры
          </h3>
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            Сбросить
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            placeholder="Поиск..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 text-white text-sm rounded-xl focus:outline-none focus:border-yellow-500/50 placeholder-gray-500 transition-colors"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="border-b border-white/5">
        <button
          onClick={() => toggle('categories')}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <span className="text-sm font-medium text-white">Категория</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expanded.categories ? 'rotate-180' : ''}`} />
        </button>
        {expanded.categories && (
          <div className="px-5 pb-5 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateFilter('category', cat.id)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  filters.category === cat.id
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                    : 'bg-white/5 text-gray-300 border border-white/5 hover:bg-white/10'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Brands */}
      <div className="border-b border-white/5">
        <button
          onClick={() => toggle('brands')}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <span className="text-sm font-medium text-white">Марка</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expanded.brands ? 'rotate-180' : ''}`} />
        </button>
        {expanded.brands && (
          <div className="px-5 pb-5 grid grid-cols-3 gap-2">
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => updateFilter('brand', filters.brand === brand.name ? '' : brand.name)}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all ${
                  filters.brand === brand.name
                    ? 'bg-yellow-500/20 border border-yellow-500/40'
                    : 'bg-white/5 border border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="h-7 w-7 flex items-center justify-center">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain"
                    style={{ filter: filters.brand === brand.name ? 'brightness(1.2)' : 'brightness(0.7)' }}
                  />
                </div>
                <span className={`text-[10px] font-medium ${filters.brand === brand.name ? 'text-yellow-400' : 'text-gray-400'}`}>
                  {brand.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="border-b border-white/5">
        <button
          onClick={() => toggle('price')}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <span className="text-sm font-medium text-white">Цена за день</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expanded.price ? 'rotate-180' : ''}`} />
        </button>
        {expanded.price && (
          <div className="px-5 pb-5 space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={filters.priceMin || ''}
                onChange={(e) => updateFilter('priceMin', Number(e.target.value) || 0)}
                placeholder="От"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white text-sm rounded-lg focus:outline-none focus:border-yellow-500/50 transition-colors"
              />
              <span className="text-gray-500">—</span>
              <input
                type="number"
                value={filters.priceMax || ''}
                onChange={(e) => updateFilter('priceMax', Number(e.target.value) || 2000)}
                placeholder="До"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white text-sm rounded-lg focus:outline-none focus:border-yellow-500/50 transition-colors"
              />
            </div>

            <input
              type="range"
              min={0}
              max={2000}
              step={50}
              value={filters.priceMax}
              onChange={(e) => updateFilter('priceMax', Number(e.target.value))}
              className="w-full accent-yellow-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>฿0</span>
              <span className="text-yellow-500 font-medium">฿{filters.priceMax.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Engine Size */}
      <div className="border-b border-white/5">
        <button
          onClick={() => toggle('engine')}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <span className="text-sm font-medium text-white">Объем двигателя</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expanded.engine ? 'rotate-180' : ''}`} />
        </button>
        {expanded.engine && (
          <div className="px-5 pb-5 flex flex-wrap gap-2">
            <button
              onClick={() => updateFilter('engineSize', '')}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                filters.engineSize === ''
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                  : 'bg-white/5 text-gray-300 border border-white/5 hover:bg-white/10'
              }`}
            >
              Любой
            </button>
            {engineSizes.map((size) => (
              <button
                key={size}
                onClick={() => updateFilter('engineSize', filters.engineSize === size ? '' : size)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  filters.engineSize === size
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                    : 'bg-white/5 text-gray-300 border border-white/5 hover:bg-white/10'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Transmission */}
      <div className="border-b border-white/5">
        <button
          onClick={() => toggle('transmission')}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <span className="text-sm font-medium text-white">Коробка передач</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expanded.transmission ? 'rotate-180' : ''}`} />
        </button>
        {expanded.transmission && (
          <div className="px-5 pb-5 flex flex-wrap gap-2">
            {transmissionOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateFilter('transmission', option.value)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  filters.transmission === option.value
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                    : 'bg-white/5 text-gray-300 border border-white/5 hover:bg-white/10'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fuel */}
      <div className="border-b border-white/5">
        <button
          onClick={() => toggle('fuel')}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <span className="text-sm font-medium text-white">Топливо</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expanded.fuel ? 'rotate-180' : ''}`} />
        </button>
        {expanded.fuel && (
          <div className="px-5 pb-5 flex flex-wrap gap-2">
            {fuelOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateFilter('fuel', option.value)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  filters.fuel === option.value
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                    : 'bg-white/5 text-gray-300 border border-white/5 hover:bg-white/10'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Apply Button - mobile only */}
      {onClose && (
        <div className="p-5">
          <button
            onClick={onClose}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-xl text-sm font-semibold transition-colors"
          >
            Показать результаты
          </button>
        </div>
      )}
    </div>
  );
};
