import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Check, ChevronDown } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  description?: string;
  popular?: boolean;
}

interface CustomLocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  locations: Location[];
}

export const CustomLocationSelector: React.FC<CustomLocationSelectorProps> = ({
  value,
  onChange,
  label,
  locations
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (location.description && location.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const popularLocations = filteredLocations.filter(location => location.popular);
  const otherLocations = filteredLocations.filter(location => !location.popular);

  const handleLocationSelect = (locationName: string) => {
    onChange(locationName);
    setIsOpen(false);
    setSearchQuery('');
  };

  const selectedLocation = locations.find(loc => loc.name === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-500 mb-2">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-left flex items-center justify-between ${
          isOpen ? 'ring-2 ring-gray-900 border-transparent' : 'border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="truncate">
            {selectedLocation ? selectedLocation.name : 'Выберите место'}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute z-[9999] mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-80"
          style={{ top: '100%', left: '0', width: '100%' }}
        >
          <div className="p-3 border-b border-gray-100">
            <input
              type="text"
              placeholder="Поиск локации..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 text-sm placeholder-gray-400"
              autoFocus
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {popularLocations.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Популярные места
                </div>
                {popularLocations.map((location) => (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() => handleLocationSelect(location.name)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="text-gray-900 font-medium">{location.name}</div>
                      {location.description && (
                        <div className="text-xs text-gray-400 mt-0.5">{location.description}</div>
                      )}
                    </div>
                    {value === location.name && (
                      <Check className="w-4 h-4 text-gray-900" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {otherLocations.length > 0 && (
              <div>
                {popularLocations.length > 0 && (
                  <div className="border-t border-gray-100 px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Другие места
                  </div>
                )}
                {otherLocations.map((location) => (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() => handleLocationSelect(location.name)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="text-gray-900 font-medium">{location.name}</div>
                      {location.description && (
                        <div className="text-xs text-gray-400 mt-0.5">{location.description}</div>
                      )}
                    </div>
                    {value === location.name && (
                      <Check className="w-4 h-4 text-gray-900" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {filteredLocations.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-400">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <div className="text-sm">Локация не найдена</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};