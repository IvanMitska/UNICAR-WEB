import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Copy,
  Check,
  Phone,
  MessageCircle,
  ArrowLeft
} from 'lucide-react';

export const BookingConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const referenceCode = searchParams.get('ref');
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    if (referenceCode) {
      await navigator.clipboard.writeText(referenceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-light text-gray-900 mb-3">
              Спасибо за бронирование!
            </h1>
            <p className="text-gray-500 text-lg">
              Ваша заявка успешно отправлена. Наш менеджер свяжется с вами в ближайшее время для подтверждения.
            </p>
          </motion.div>

          {/* Reference Code */}
          {referenceCode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-6"
            >
              <p className="text-sm text-gray-400 mb-2">Номер заявки</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-mono font-bold text-gray-900">
                  {referenceCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
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
          )}

          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Что дальше?</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">1</span>
                <span>Менеджер свяжется с вами для уточнения деталей</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">2</span>
                <span>Подтвердите бронирование и способ оплаты</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">3</span>
                <span>Получите автомобиль в выбранном месте</span>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Есть вопросы? Свяжитесь с нами</h3>
            <div className="grid grid-cols-2 gap-4">
              <a
                href="tel:+66638450372"
                className="flex items-center justify-center gap-2 py-4 border border-gray-200 text-gray-700 rounded-xl hover:border-gray-400 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>Позвонить</span>
              </a>
              <a
                href="https://wa.me/66638450372"
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
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>На главную</span>
            </button>
            <button
              onClick={() => navigate('/cars')}
              className="px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              Смотреть другие авто
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
