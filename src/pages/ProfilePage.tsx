import React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Car,
  Settings,
  LogOut,
  Edit2,
  ChevronRight,
  Clock,
  CreditCard,
  Bell,
  Shield,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock user data
const mockUser = {
  name: 'Иван Петров',
  email: 'ivan.petrov@email.com',
  phone: '+7 (999) 123-45-67',
  location: 'Пхукет, Таиланд',
  memberSince: 'Январь 2024',
  avatar: null,
  totalBookings: 12,
  favoritesCar: 3,
};

// Mock bookings
const mockBookings = [
  {
    id: 1,
    car: 'Toyota Camry',
    image: '/images/cars/toyota-camry.jpg',
    dates: '15 - 20 декабря 2024',
    status: 'active',
    price: 15000,
  },
  {
    id: 2,
    car: 'Honda CR-V',
    image: '/images/cars/honda-crv.jpg',
    dates: '5 - 10 ноября 2024',
    status: 'completed',
    price: 18000,
  },
  {
    id: 3,
    car: 'Mazda 3',
    image: '/images/cars/mazda-3.jpg',
    dates: '20 - 25 октября 2024',
    status: 'completed',
    price: 12000,
  },
];

const menuItems = [
  { icon: Car, label: 'Мои бронирования', count: 12 },
  { icon: Heart, label: 'Избранное', count: 3 },
  { icon: CreditCard, label: 'Способы оплаты' },
  { icon: Bell, label: 'Уведомления' },
  { icon: Shield, label: 'Безопасность' },
  { icon: Settings, label: 'Настройки' },
];

export const ProfilePage: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
            Активно
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm font-medium">
            Завершено
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
            Отменено
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <div className="relative pt-8 pb-16 lg:pt-12 lg:pb-24 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 mesh-gradient opacity-50" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              <span className="text-white">Личный </span>
              <span className="text-yellow-500">
                кабинет
              </span>
            </h1>
            <p className="text-gray-400">Управляйте своими бронированиями и настройками</p>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="glass-effect rounded-2xl p-6 lg:p-8 border border-dark-800/50">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                    {mockUser.avatar ? (
                      <img
                        src={mockUser.avatar}
                        alt={mockUser.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-dark-800 border border-dark-700 rounded-full flex items-center justify-center hover:bg-dark-700 transition-colors">
                    <Edit2 className="w-4 h-4 text-yellow-500" />
                  </button>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    {mockUser.name}
                  </h2>

                  <div className="flex flex-col gap-2 text-gray-400">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Mail className="w-4 h-4 text-yellow-500" />
                      <span>{mockUser.email}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Phone className="w-4 h-4 text-yellow-500" />
                      <span>{mockUser.phone}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <MapPin className="w-4 h-4 text-yellow-500" />
                      <span>{mockUser.location}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Calendar className="w-4 h-4 text-yellow-500" />
                      <span>С нами с {mockUser.memberSince}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-6 md:gap-8">
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-yellow-500">
                      {mockUser.totalBookings}
                    </div>
                    <div className="text-sm text-gray-400">Поездок</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-yellow-500">
                      {mockUser.favoritesCar}
                    </div>
                    <div className="text-sm text-gray-400">В избранном</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Menu */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="glass-effect rounded-2xl p-4 border border-dark-800/50">
                <nav className="space-y-1">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={index}
                        className="w-full flex items-center justify-between p-3 rounded-xl text-gray-300 hover:bg-dark-800/50 hover:text-white transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-dark-800/50 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                            <Icon className="w-5 h-5 text-yellow-500" />
                          </div>
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.count && (
                            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded-full text-sm">
                              {item.count}
                            </span>
                          )}
                          <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-yellow-500 transition-colors" />
                        </div>
                      </button>
                    );
                  })}

                  {/* Logout Button */}
                  <button className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors mt-4">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Выйти</span>
                  </button>
                </nav>
              </div>
            </motion.div>

            {/* Bookings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="glass-effect rounded-2xl p-6 border border-dark-800/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Мои бронирования</h3>
                  <Link
                    to="/cars"
                    className="text-yellow-500 hover:text-yellow-400 transition-colors text-sm font-medium"
                  >
                    Забронировать ещё
                  </Link>
                </div>

                <div className="space-y-4">
                  {mockBookings.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-dark-900/50 rounded-xl border border-dark-800/30 hover:border-yellow-500/30 transition-colors"
                    >
                      {/* Car Image */}
                      <div className="w-full sm:w-24 h-20 rounded-lg bg-dark-800 overflow-hidden flex-shrink-0">
                        <div className="w-full h-full bg-gradient-to-br from-dark-700 to-dark-800 flex items-center justify-center">
                          <Car className="w-8 h-8 text-gray-600" />
                        </div>
                      </div>

                      {/* Booking Info */}
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-1">
                          {booking.car}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{booking.dates}</span>
                        </div>
                      </div>

                      {/* Status & Price */}
                      <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-2 w-full sm:w-auto">
                        {getStatusBadge(booking.status)}
                        <div className="text-lg font-bold text-white">
                          ฿{booking.price.toLocaleString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Empty State */}
                {mockBookings.length === 0 && (
                  <div className="text-center py-12">
                    <Car className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-white mb-2">
                      Нет бронирований
                    </h4>
                    <p className="text-gray-400 mb-6">
                      У вас пока нет активных бронирований
                    </p>
                    <Link
                      to="/cars"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all"
                    >
                      <Car className="w-5 h-5" />
                      Выбрать автомобиль
                    </Link>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Link
                    to="/cars"
                    className="block glass-effect rounded-xl p-6 border border-dark-800/50 hover:border-yellow-500/30 transition-all group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:from-yellow-500/30 group-hover:to-yellow-600/30 transition-colors">
                      <Car className="w-6 h-6 text-yellow-500" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-1">
                      Арендовать авто
                    </h4>
                    <p className="text-sm text-gray-400">
                      Выберите автомобиль из нашего каталога
                    </p>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Link
                    to="/contacts"
                    className="block glass-effect rounded-xl p-6 border border-dark-800/50 hover:border-yellow-500/30 transition-all group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:from-yellow-500/30 group-hover:to-yellow-600/30 transition-colors">
                      <Phone className="w-6 h-6 text-yellow-500" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-1">
                      Связаться с нами
                    </h4>
                    <p className="text-sm text-gray-400">
                      Остались вопросы? Мы всегда на связи
                    </p>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
