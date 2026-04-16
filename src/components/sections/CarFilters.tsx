import React from 'react';
import { useTranslation } from 'react-i18next';
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

const TRANSMISSION_OPTIONS = [
  { value: '', labelKey: 'transmission.any' },
  { value: 'automatic', labelKey: 'transmission.automatic' },
  { value: 'manual', labelKey: 'transmission.manual' },
] as const;

const FUEL_OPTIONS = [
  { value: '', labelKey: 'fuel.any' },
  { value: 'petrol', labelKey: 'fuel.petrol' },
  { value: 'diesel', labelKey: 'fuel.diesel' },
  { value: 'hybrid', labelKey: 'fuel.hybrid' },
  { value: 'electric', labelKey: 'fuel.electric' },
] as const;

export const CarFilters: React.FC<CarFiltersProps> = ({ filters, setFilters }) => {
  const { t, i18n } = useTranslation('common');

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

  const localeTag = (i18n.language || 'ru').startsWith('en') ? 'en-US' : 'ru-RU';

  return (
    <div className="glass-effect rounded-xl p-6 border border-dark-800/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">{t('filters.filters')}</h3>
        <button
          onClick={handleReset}
          className="text-sm text-yellow-500 hover:text-yellow-400 transition-colors"
        >
          {t('buttons.resetFilters')}
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('buttons.search')}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              placeholder={t('form.searchByBrand')}
              className="w-full pl-10 pr-3 py-2 bg-dark-900/50 border border-dark-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
            />
          </div>
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('filters.pricePerDay')}
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
              <span className="font-semibold">{filters.priceMax.toLocaleString(localeTag)}₽</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('filters.transmission')}
          </label>
          <div className="space-y-2">
            {TRANSMISSION_OPTIONS.map((opt) => (
              <label key={opt.value || 'any'} className="flex items-center">
                <input
                  type="radio"
                  name="transmission"
                  value={opt.value}
                  checked={filters.transmission === opt.value}
                  onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-200">{t(opt.labelKey)}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('filters.fuel')}
          </label>
          <div className="space-y-2">
            {FUEL_OPTIONS.map((opt) => (
              <label key={opt.value || 'any'} className="flex items-center">
                <input
                  type="radio"
                  name="fuel"
                  value={opt.value}
                  checked={filters.fuel === opt.value}
                  onChange={(e) => setFilters({ ...filters, fuel: e.target.value })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-200">{t(opt.labelKey)}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
