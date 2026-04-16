import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, DollarSign, AlertTriangle, Info } from 'lucide-react';

const INSURANCE_KEYS = [
  { key: 'fullInsurance', icon: Shield },
  { key: 'deposit', icon: DollarSign },
  { key: 'franchise', icon: AlertTriangle },
] as const;

export const TermsInsurance: React.FC = () => {
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
            {t('terms.insurance.title')}
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t('terms.insurance.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {INSURANCE_KEYS.map((feature, index) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-gray-800 rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="bg-gradient-to-r from-yellow-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-4 font-display">
                {t(`terms.insurance.items.${feature.key}.title`)}
              </h3>

              <p className="text-gray-400 leading-relaxed">
                {t(`terms.insurance.items.${feature.key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-r from-yellow-500/10 to-red-500/10 border border-yellow-500/20 rounded-2xl p-8"
          >
            <div className="flex items-start gap-4">
              <div className="bg-yellow-500/20 p-3 rounded-full flex-shrink-0">
                <Info className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-3">{t('terms.insurance.depositCard.title')}</h4>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {t('terms.insurance.depositCard.text')}
                </p>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-yellow-400 font-semibold">{t('terms.insurance.depositCard.range')}</p>
                  <p className="text-gray-400 text-sm mt-1">{t('terms.insurance.depositCard.rangeNote')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-r from-yellow-500/10 to-red-500/10 border border-yellow-500/20 rounded-2xl p-8"
          >
            <div className="flex items-start gap-4">
              <div className="bg-yellow-500/20 p-3 rounded-full flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-3">{t('terms.insurance.franchiseCard.title')}</h4>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {t('terms.insurance.franchiseCard.text')}
                </p>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-red-400 font-semibold">{t('terms.insurance.franchiseCard.range')}</p>
                  <p className="text-gray-400 text-sm mt-1">{t('terms.insurance.franchiseCard.rangeNote')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
