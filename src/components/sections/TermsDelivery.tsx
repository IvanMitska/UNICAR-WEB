import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Truck, Fuel, Route, Sparkles, Gauge, Car } from 'lucide-react';

const DELIVERY_KEYS = [
  { key: 'anyLocation', icon: Truck },
  { key: 'fullTank', icon: Fuel },
  { key: 'mileage', icon: Route },
] as const;

export const TermsDelivery: React.FC = () => {
  const { t } = useTranslation('pages');

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">
            {t('terms.delivery.title')}
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t('terms.delivery.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {DELIVERY_KEYS.map((feature, index) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-gray-900 rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="bg-gradient-to-r from-yellow-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-4 font-display">
                {t(`terms.delivery.items.${feature.key}.title`)}
              </h3>

              <p className="text-gray-400 leading-relaxed">
                {t(`terms.delivery.items.${feature.key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-900 rounded-2xl p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-yellow-500 to-red-500 p-3 rounded-full">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white font-display">{t('terms.delivery.deliveryCard.title')}</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                <span className="text-gray-300">{t('terms.delivery.deliveryCard.islandLabel')}</span>
                <span className="text-yellow-400 font-semibold">{t('terms.delivery.deliveryCard.islandValue')}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                <span className="text-gray-300">{t('terms.delivery.deliveryCard.conditionLabel')}</span>
                <span className="text-white font-semibold">{t('terms.delivery.deliveryCard.conditionValue')}</span>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-red-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-semibold">{t('terms.delivery.deliveryCard.convenienceTitle')}</span>
                </div>
                <p className="text-gray-300 text-sm">
                  {t('terms.delivery.deliveryCard.convenienceText')}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gray-900 rounded-2xl p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-yellow-500 to-red-500 p-3 rounded-full">
                <Gauge className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white font-display">{t('terms.delivery.mileageCard.title')}</h3>
            </div>

            <div className="space-y-4">
              <div className="text-center bg-gray-800 rounded-lg p-6">
                <div className="text-4xl font-bold text-yellow-400 mb-2">{t('terms.delivery.mileageCard.includedValue')}</div>
                <div className="text-gray-300">{t('terms.delivery.mileageCard.includedLabel')}</div>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                <span className="text-gray-300">{t('terms.delivery.mileageCard.extraLabel')}</span>
                <span className="text-yellow-400 font-semibold">{t('terms.delivery.mileageCard.extraValue')}</span>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-red-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Car className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-semibold">{t('terms.delivery.mileageCard.fairTitle')}</span>
                </div>
                <p className="text-gray-300 text-sm">
                  {t('terms.delivery.mileageCard.fairText')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
