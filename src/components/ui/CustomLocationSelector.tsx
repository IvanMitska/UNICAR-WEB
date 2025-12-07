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
      <label className="block text-sm font-medium text-gray-400 mb-3">
        <MapPin className="inline w-4 h-4 mr-2 text-yellow-400" />
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white text-left flex items-center justify-between ${
          isOpen ? 'ring-2 ring-yellow-500 border-transparent' : 'border-white/10'
        }`}
      >
        <span className="truncate">
          {selectedLocation ? selectedLocation.name : 'Выберите место'}
        </span>
        <ChevronDown className={`w-4 h-4 text-yellow-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute z-[9999] mt-2 bg-dark-900 border border-yellow-500/30 rounded-xl shadow-2xl overflow-hidden max-h-80"
          style={{ top: '100%', left: '0', width: '100%' }}
        >
          <div className="p-4 border-b border-yellow-500/20">
            <input
              type="text"
              placeholder="Поиск локации..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white text-sm placeholder-gray-500"
              autoFocus
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {popularLocations.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-yellow-400 uppercase tracking-wider">
                  Популярные места
                </div>
                {popularLocations.map((location) => (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() => handleLocationSelect(location.name)}
                    className="w-full px-4 py-3 text-left hover:bg-yellow-500/10 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="text-white font-medium">{location.name}</div>
                      {location.description && (
                        <div className="text-xs text-gray-400 mt-1">{location.description}</div>
                      )}
                    </div>
                    {value === location.name && (
                      <Check className="w-4 h-4 text-yellow-500" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {otherLocations.length > 0 && (
              <div>
                {popularLocations.length > 0 && (
                  <div className="border-t border-yellow-500/20 px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Другие места
                  </div>
                )}
                {otherLocations.map((location) => (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() => handleLocationSelect(location.name)}
                    className="w-full px-4 py-3 text-left hover:bg-yellow-500/10 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="text-white font-medium">{location.name}</div>
                      {location.description && (
                        <div className="text-xs text-gray-400 mt-1">{location.description}</div>
                      )}
                    </div>
                    {value === location.name && (
                      <Check className="w-4 h-4 text-yellow-500" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {filteredLocations.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500">
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