import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  XCircle,
  Car,
  Calendar,
  MapPin,
  Loader2,
  Copy,
  Check,
  Phone,
  MessageCircle
} from 'lucide-react';
import { carsApi, type BookingStatusResponse } from '../api/carsApi';
import { formatPrice } from '../utils/formatters';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
    title: 'Заявка обрабатывается',
    description: 'Наш менеджер свяжется с вами в ближайшее время для подтверждения бронирования.',
  },
  confirmed: {
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
    title: 'Бронирование подтверждено',
    description: 'Ваше бронирование успешно подтверждено. Ждём вас!',
  },
  rejected: {
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-100',
    title: 'Заявка отклонена',
    description: 'К сожалению, бронирование не удалось подтвердить. Свяжитесь с нами для уточнения.',
  },
  completed: {
    icon: CheckCircle,
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    title: 'Аренда завершена',
    description: 'Спасибо за использование наших услуг!',
  },
};

export const BookingConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const referenceCode = searchParams.get('ref');

  const [booking, setBooking] = useState<BookingStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchBookingStatus() {
      if (!referenceCode) {
        setError('Код бронирования не указан');
        setIsLoading(false);
        return;
      }

      try {
        const status = await carsApi.getBookingStatus(referenceCode);
        setBooking(status);
      } catch (err) {
        console.error('Error fetching booking status:', err);
        setError('Не удалось загрузить информацию о бронировании');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookingStatus();
  }, [referenceCode]);

  const handleCopyCode = async () => {
    if (referenceCode) {
      await navigator.clipboard.writeText(referenceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-400 mx-auto mb-4" />
          <p className="text-primary-500">Загрузка информации о бронировании...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
        <div className="text-center max-w-md mx-auto px-6">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-light text-primary-900 mb-4">
            {error || 'Бронирование не найдено'}
          </h1>
          <p className="text-primary-500 mb-6">
            Проверьте код бронирования или свяжитесь с нашей поддержкой.
          </p>
          <button
            onClick={() => navigate('/cars')}
            className="px-8 py-4 bg-primary-900 text-white rounded-full hover:bg-primary-800 transition-colors"
          >
            Перейти к каталогу
          </button>
        </div>
      </div>
    );
  }

  const status = statusConfig[booking.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          {/* Status Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className={`w-24 h-24 ${status.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
              <StatusIcon className={`w-12 h-12 ${status.color}`} />
            </div>
            <h1 className="text-3xl font-light text-primary-900 mb-3">
              {status.title}
            </h1>
            <p className="text-primary-500">
              {status.description}
            </p>
          </motion.div>

          {/* Reference Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          >
            <p className="text-sm text-primary-400 mb-2">Код бронирования</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-mono font-bold text-primary-900">
                {booking.referenceCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Скопировано</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-sm">Копировать</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Booking Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-6 space-y-6"
          >
            {/* Vehicle */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Car className="w-6 h-6 text-primary-700" />
              </div>
              <div>
                <p className="text-sm text-primary-400">Автомобиль</p>
                <p className="text-lg font-medium text-primary-900">
                  {booking.vehicle.brand} {booking.vehicle.model} ({booking.vehicle.year})
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-700" />
              </div>
              <div>
                <p className="text-sm text-primary-400">Период аренды</p>
                <p className="text-lg font-medium text-primary-900">
                  {format(new Date(booking.startDate), 'd MMMM yyyy', { locale: ru })} — {format(new Date(booking.endDate), 'd MMMM yyyy', { locale: ru })}
                </p>
              </div>
            </div>

            {/* Locations */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary-700" />
              </div>
              <div>
                <p className="text-sm text-primary-400">Получение / Возврат</p>
                <p className="text-lg font-medium text-primary-900">
                  {booking.pickupLocation}
                  {booking.pickupLocation !== booking.returnLocation && (
                    <span> → {booking.returnLocation}</span>
                  )}
                </p>
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-primary-100">
              <div className="flex justify-between items-center">
                <span className="text-primary-500">Итого к оплате</span>
                <span className="text-2xl font-bold text-primary-900">
                  {formatPrice(booking.totalPrice)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          >
            <h3 className="text-lg font-medium text-primary-900 mb-4">Связаться с нами</h3>
            <div className="grid grid-cols-2 gap-4">
              <a
                href="tel:+66959657805"
                className="flex items-center justify-center gap-2 py-4 border border-primary-200 text-primary-700 rounded-xl hover:border-primary-400 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>Позвонить</span>
              </a>
              <a
                href="https://wa.me/66959657805"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <button
              onClick={() => navigate('/cars')}
              className="px-8 py-4 bg-primary-900 text-white rounded-full hover:bg-primary-800 transition-colors"
            >
              Вернуться к каталогу
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
