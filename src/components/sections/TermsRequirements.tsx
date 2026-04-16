import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { User, Calendar, FileText, CreditCard } from 'lucide-react';

const REQUIREMENT_KEYS = [
  { key: 'age', icon: Calendar },
  { key: 'experience', icon: User },
  { key: 'passport', icon: FileText },
  { key: 'license', icon: CreditCard },
] as const;

export const TermsRequirements: React.FC = () => {
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
            {t('terms.requirements.title')}
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t('terms.requirements.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {REQUIREMENT_KEYS.map((requirement, index) => (
            <motion.div
              key={requirement.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-gray-800 rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="bg-gradient-to-r from-yellow-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <requirement.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-3 font-display">
                {t(`terms.requirements.items.${requirement.key}.title`)}
              </h3>

              <div className="text-2xl font-bold text-yellow-400 mb-4">
                {t(`terms.requirements.items.${requirement.key}.description`)}
              </div>

              <p className="text-gray-400 text-sm leading-relaxed">
                {t(`terms.requirements.items.${requirement.key}.details`)}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 bg-gradient-to-r from-red-500/10 to-yellow-500/10 border border-red-500/20 rounded-2xl p-8"
        >
          <div className="flex items-start gap-4">
            <div className="bg-red-500/20 p-3 rounded-full flex-shrink-0">
              <FileText className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-3">{t('terms.requirements.warningTitle')}</h4>
              <p className="text-gray-300 leading-relaxed">
                {t('terms.requirements.warningText')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
