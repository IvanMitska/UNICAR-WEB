import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Info } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Car } from '../../types/index';
import { formatPrice, calculateDays } from '../../utils/formatters';
import { format, addDays } from 'date-fns';
import { useBookingStore } from '../../store/useBookingStore';

interface BookingCardProps {
  car: Car;
}

export const BookingCard: React.FC<BookingCardProps> = ({ car }) => {
  const navigate = useNavigate();
  const { setSelectedCar, setDates, setLocations } = useBookingStore();
  
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 3), 'yyyy-MM-dd'));
  const [pickupLocation, setPickupLocation] = useState('Шереметьево');
  const [returnLocation, setReturnLocation] = useState('Шереметьево');

  const days = calculateDays(new Date(startDate), new Date(endDate));
  const totalPrice = car.pricePerDay * days;

  const handleBooking = () => {
    setSelectedCar(car);
    setDates(new Date(startDate), new Date(endDate));
    setLocations(pickupLocation, returnLocation);
    navigate('/booking');
  };

  return (
    <div className="glass-effect rounded-xl shadow-xl border border-dark-800/50 hover:border-yellow-500/30 p-6 transition-all duration-300">
      <div className="mb-6">
        <div className="text-3xl font-bold gradient-text">
          {formatPrice(car.pricePerDay)}
          <span className="text-base font-normal text-gray-400 ml-1">/день</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            <Calendar className="inline w-4 h-4 mr-1 text-yellow-400" />
            Дата получения
          </label>
          <input
            type="date"
            value={startDate}
            min={format(new Date(), 'yyyy-MM-dd')}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 bg-dark-900/50 border border-dark-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            <Calendar className="inline w-4 h-4 mr-1 text-yellow-400" />
            Дата возврата
          </label>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 bg-dark-900/50 border border-dark-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            <MapPin className="inline w-4 h-4 mr-1 text-yellow-400" />
            Место получения
          </label>
          <select
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            className="w-full px-4 py-2 bg-dark-900/50 border border-dark-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 [&>option]:bg-dark-900 [&>option]:text-white"
          >
            <option value="Шереметьево">Шереметьево</option>
            <option value="Домодедово">Домодедово</option>
            <option value="Внуково">Внуково</option>
            <option value="Центр города">Центр города</option>
            <option value="Ленинградский вокзал">Ленинградский вокзал</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            <MapPin className="inline w-4 h-4 mr-1 text-yellow-400" />
            Место возврата
          </label>
          <select
            value={returnLocation}
            onChange={(e) => setReturnLocation(e.target.value)}
            className="w-full px-4 py-2 bg-dark-900/50 border border-dark-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 [&>option]:bg-dark-900 [&>option]:text-white"
          >
            <option value="Шереметьево">Шереметьево</option>
            <option value="Домодедово">Домодедово</option>
            <option value="Внуково">Внуково</option>
            <option value="Центр города">Центр города</option>
            <option value="Ленинградский вокзал">Ленинградский вокзал</option>
          </select>
        </div>
      </div>

      <div className="border-t border-dark-700 pt-4 mb-6">
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Стоимость за {days} дней</span>
          <span>{formatPrice(car.pricePerDay * days)}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg">
          <span className="text-white">Итого</span>
          <span className="gradient-text text-xl font-bold">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={handleBooking}
        disabled={!car.available}
      >
        {car.available ? 'Забронировать' : 'Недоступен'}
      </Button>

      <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg glass-effect-light">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-yellow-400 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold mb-1 text-white">Бесплатная отмена</p>
            <p className="text-xs text-yellow-300">Отмена бронирования бесплатно за 24 часа до начала аренды</p>
          </div>
        </div>
      </div>
    </div>
  );
};