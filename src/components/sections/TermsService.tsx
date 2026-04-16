import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Clock,
  CreditCard,
  FileText,
  Headphones,
  Camera,
  Navigation,
  Smartphone,
  Umbrella,
  Droplets,
  Baby,
  MapPin,
  Gift
} from 'lucide-react';

const PAYMENT_OPTIONS = [
  { currency: 'THB', key: 'thb' },
  { currency: 'RUB', key: 'rub' },
  { currency: 'USD', key: 'usd' },
  { currency: 'USDT', key: 'usdt' },
] as const;

const CAR_FEATURES = [
  { key: 'dashcam', icon: Camera },
  { key: 'navigation', icon: Navigation },
  { key: 'chargers', icon: Smartphone },
  { key: 'carplay', icon: Smartphone },
  { key: 'umbrella', icon: Umbrella },
  { key: 'waterTissues', icon: Droplets },
  { key: 'babySeat', icon: Baby },
] as const;

export const TermsService: React.FC = () => {
  const { t } = useTranslation('pages');

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">
            {t('terms.service.title')}
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t('terms.service.subtitle')}
          </p>
        </motion.div>

        {/* Основные услуги */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gray-800 rounded-2xl p-6 text-center"
          >
            <div className="bg-gradient-to-r from-yellow-500 to-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t('terms.service.rentalFromDay.title')}</h3>
            <p className="text-gray-400 text-sm">{t('terms.service.rentalFromDay.description')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-800 rounded-2xl p-6 text-center"
          >
            <div className="bg-gradient-to-r from-yellow-500 to-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t('terms.service.contract.title')}</h3>
            <p className="text-gray-400 text-sm">{t('terms.service.contract.description')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gray-800 rounded-2xl p-6 text-center"
          >
            <div className="bg-gradient-to-r from-yellow-500 to-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t('terms.service.support.title')}</h3>
            <p className="text-gray-400 text-sm">{t('terms.service.support.description')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-800 rounded-2xl p-6 text-center"
          >
            <div className="bg-gradient-to-r from-yellow-500 to-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t('terms.service.payment.title')}</h3>
            <p className="text-gray-400 text-sm">{t('terms.service.payment.description')}</p>
          </motion.div>
        </div>

        {/* Способы оплаты */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gray-800 rounded-2xl p-8 mb-16"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center font-display">
            {t('terms.service.paymentMethodsTitle')}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PAYMENT_OPTIONS.map((option) => (
              <div
                key={option.currency}
                className="bg-gray-700 rounded-lg p-4 text-center"
              >
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {option.currency}
                </div>
                <div className="text-gray-400 text-sm">
                  {t(`terms.service.paymentOptions.${option.key}`)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Оснащение автомобилей */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gray-800 rounded-2xl p-8 mb-16"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center font-display">
            {t('terms.service.carFeaturesTitle')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAR_FEATURES.map((feature, index) => (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="bg-gradient-to-r from-yellow-500 to-red-500 p-2 rounded-full flex-shrink-0">
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">{t(`terms.service.carFeatures.${feature.key}.title`)}</h4>
                  <p className="text-gray-400 text-xs">{t(`terms.service.carFeatures.${feature.key}.description`)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Бонус */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-gradient-to-r from-yellow-500/10 to-red-500/10 border border-yellow-500/20 rounded-2xl p-8 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="bg-gradient-to-r from-yellow-500 to-red-500 p-3 rounded-full">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-white font-display">{t('terms.service.giftTitle')}</h4>
          </div>

          <p className="text-gray-300 text-lg">
            {t('terms.service.giftText')}
          </p>

          <div className="flex items-center justify-center gap-2 mt-4">
            <MapPin className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">{t('terms.service.giftBadge')}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
