import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Camera, FileText, DollarSign, CheckCircle } from 'lucide-react';

const BOOKING_STEPS = [
  { key: 'passportPhoto', icon: Camera },
  { key: 'licensePhoto', icon: FileText },
  { key: 'prepayment', icon: DollarSign },
] as const;

export const TermsBooking: React.FC = () => {
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
            {t('terms.booking.title')}
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t('terms.booking.subtitle')}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {BOOKING_STEPS.map((step, index) => (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {/* Connector line */}
                {index < BOOKING_STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-yellow-500 to-transparent z-0">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                )}

                <div className="bg-gray-900 rounded-2xl p-8 text-center relative z-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <div className="relative">
                    <div className="bg-gradient-to-r from-yellow-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-yellow-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4 font-display">
                    {t(`terms.booking.items.${step.key}.title`)}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {t(`terms.booking.items.${step.key}.description`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-r from-yellow-500/10 to-red-500/10 border border-yellow-500/20 rounded-2xl p-8"
          >
            <div className="flex items-start gap-4">
              <div className="bg-yellow-500/20 p-3 rounded-full flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-3">{t('terms.booking.confirmTitle')}</h4>
                <p className="text-gray-300 leading-relaxed">
                  {t('terms.booking.confirmText')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
