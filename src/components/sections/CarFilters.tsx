import React from 'react';
import { Search } from 'lucide-react';

interface Filters {
  category: string;
  priceMin: number;
  priceMax: number;
  transmission: string;
  fuel: string;
  searchQuery: string;
  sortBy: string;
}

interface CarFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export const CarFilters: React.FC<CarFiltersProps> = ({ filters, setFilters }) => {
  const handleReset = () => {
    setFilters({
      category: '',
      priceMin: 0,
      priceMax: 20000,
      transmission: '',
      fuel: '',
      searchQuery: '',
      sortBy: 'price-asc',
    });
  };

  return (
    <div className="glass-effect rounded-xl p-6 border border-dark-800/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Фильтры</h3>
        <button
          onClick={handleReset}
          className="text-sm text-yellow-500 hover:text-yellow-400 transition-colors"
        >
          Сбросить
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Поиск
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              placeholder="Марка или модель"
              className="w-full pl-10 pr-3 py-2 bg-dark-900/50 border border-dark-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
            />
          </div>
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Цена за день
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="20000"
              step="500"
              value={filters.priceMax}
              onChange={(e) => setFilters({ ...filters, priceMax: Number(e.target.value) })}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>0₽</span>
              <span className="font-semibold">{filters.priceMax.toLocaleString('ru-RU')}₽</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Коробка передач
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="transmission"
                value=""
                checked={filters.transmission === ''}
                onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                className="mr-2"
              />
              <span className="text-sm text-gray-200">Любая</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="transmission"
                value="automatic"
                checked={filters.transmission === 'automatic'}
                onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                className="mr-2"
              />
              <span className="text-sm text-gray-200">Автоматическая</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="transmission"
                value="manual"
                checked={filters.transmission === 'manual'}
                onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                className="mr-2"
              />
              <span className="text-sm text-gray-200">Механическая</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Тип топлива
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="fuel"
                value=""
                checked={filters.fuel === ''}
                onChange={(e) => setFilters({ ...filters, fuel: e.target.value })}
                className="mr-2"
              />
              <span className="text-sm text-gray-200">Любое</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="fuel"
                value="petrol"
                checked={filters.fuel === 'petrol'}
                onChange={(e) => setFilters({ ...filters, fuel: e.target.value })}
                className="mr-2"
              />
              <span className="text-sm text-gray-200">Бензин</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="fuel"
                value="diesel"
                checked={filters.fuel === 'diesel'}
                onChange={(e) => setFilters({ ...filters, fuel: e.target.value })}
                className="mr-2"
              />
              <span className="text-sm text-gray-200">Дизель</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="fuel"
                value="hybrid"
                checked={filters.fuel === 'hybrid'}
                onChange={(e) => setFilters({ ...filters, fuel: e.target.value })}
                className="mr-2"
              />
              <span className="text-sm text-gray-200">Гибрид</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="fuel"
                value="electric"
                checked={filters.fuel === 'electric'}
                onChange={(e) => setFilters({ ...filters, fuel: e.target.value })}
                className="mr-2"
              />
              <span className="text-sm text-gray-200">Электро</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};