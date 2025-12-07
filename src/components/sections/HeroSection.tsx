import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Car, Clock, Trophy } from 'lucide-react';
import { Button } from '../ui/Button';
import { CustomDatePicker } from '../ui/CustomDatePicker';
import { CustomLocationSelector } from '../ui/CustomLocationSelector';
import { locations } from '../../data/locations';
import { format, addDays } from 'date-fns';
import { useBookingStore } from '../../store/useBookingStore';

// Custom motorcycle icon since lucide-react doesn't have one
const MotorcycleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5" cy="17" r="3" />
    <circle cx="19" cy="17" r="3" />
    <path d="M9 17h6" />
    <path d="M5 14l4-7h4l3 3h3" />
    <path d="M13 7l2 3" />
  </svg>
);

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { setDates, setLocations } = useBookingStore();
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 3), 'yyyy-MM-dd'));
  const [pickupLocation, setPickupLocation] = useState('Чалонг');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Save dates and location to store before navigating
    setDates(new Date(startDate), new Date(endDate));
    setLocations(pickupLocation, pickupLocation);
    navigate('/cars');
  };

  const stats = [
    { value: '40+', label: 'Машин', description: 'Широкий выбор авто — от компактных до мощных внедорожников', icon: Car },
    { value: '35+', label: 'Байков', description: 'Стильные и надежные байки для комфортных поездок по острову', icon: MotorcycleIcon },
    { value: '2 ч', label: 'Подача авто', description: 'Быстрая доставка автомобиля прямо к вам — мы ценим ваше время', icon: Clock },
    { value: '3 года', label: 'На рынке', description: 'Опыт и сервис делают нас лидерами аренды транспорта на Пхукете', icon: Trophy }
  ];

  return (
    <section className="relative min-h-[100vh] -mt-20 pt-20 flex items-center bg-dark-950">
      {/* Static gradient background - no video for performance */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
        <img
          src="https://img.youtube.com/vi/h_pezlTDe0U/maxresdefault.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          loading="eager"
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90"></div>

      {/* Simple gradient accents - no blur for performance */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-600/10 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/5 rounded-full"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 lg:py-20">
        <div className="text-center mb-16">
          <div className="inline-block mb-8">
            <span className="px-6 py-2.5 bg-yellow-500/10 rounded-full text-sm font-semibold text-yellow-400 border border-yellow-500/30 tracking-wider">
              ПРЕМИУМ АВТОМОБИЛИ НА ПХУКЕТЕ
            </span>
          </div>

          <h1 className="mb-8">
            <span className="block text-6xl lg:text-8xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">SHIBA</span>
              <span className="text-white ml-4">CARS</span>
            </span>
            <span className="block text-2xl lg:text-3xl text-gray-300 mt-4 font-light tracking-wide">
              Аренда премиальных автомобилей
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Эксклюзивная коллекция автомобилей для особых моментов
          </p>
        </div>

        <div className="max-w-5xl mx-auto mt-12">
          <form onSubmit={handleSearch} className="bg-black/20 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/15 shadow-2xl shadow-black/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <CustomDatePicker
                value={startDate}
                onChange={setStartDate}
                label="Дата начала"
                minDate={new Date()}
              />

              <CustomDatePicker
                value={endDate}
                onChange={setEndDate}
                label="Дата возврата"
                minDate={startDate ? new Date(startDate) : new Date()}
              />

              <CustomLocationSelector
                value={pickupLocation}
                onChange={setPickupLocation}
                label="Место получения"
                locations={locations}
              />

              <div className="flex items-end">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black py-3.5 rounded-xl font-semibold shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/30 transform hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Найти авто
                </Button>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center group"
            >
              <div className="bg-white/5 rounded-2xl p-4 lg:p-6 border border-white/5 hover:border-yellow-500/30 transition-colors duration-300 h-full">
                <stat.icon className="w-7 h-7 lg:w-8 lg:h-8 mx-auto mb-3 text-yellow-400" />
                <div className="text-2xl lg:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-yellow-400 text-sm font-medium mb-2">{stat.label}</div>
                <div className="text-gray-400 text-xs lg:text-sm leading-relaxed hidden sm:block">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>

        </div>

      {/* Scroll indicator - positioned between sections */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
        <div className="w-6 h-10 border-2 border-yellow-500/30 rounded-full flex justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-1 h-3 bg-yellow-500 rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
};