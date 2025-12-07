import React from 'react';
import { motion } from 'framer-motion';
import { Shield, DollarSign, AlertTriangle, Info } from 'lucide-react';

export const TermsInsurance: React.FC = () => {
  const insuranceFeatures = [
    {
      icon: Shield,
      title: 'Полная страховка',
      description: 'Все автомобили застрахованы по первому или бизнес классу'
    },
    {
      icon: DollarSign,
      title: 'Страховой депозит',
      description: 'От $200 до $800 в зависимости от выбранного автомобиля'
    },
    {
      icon: AlertTriangle,
      title: 'Франшиза',
      description: 'От 3,000 до 7,000 батов согласно условиям страховки'
    }
  ];

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
            Страховка и страховой депозит
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Надежная защита для вашего спокойствия во время поездки
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {insuranceFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
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
                {feature.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
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
                <h4 className="text-xl font-bold text-white mb-3">Страховой депозит</h4>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Размер депозита определяется арендодателем и указан в карточке каждого автомобиля. 
                  Депозит блокируется на вашей карте в момент получения автомобиля.
                </p>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-yellow-400 font-semibold">Средний размер: от $200 до $800</p>
                  <p className="text-gray-400 text-sm mt-1">В зависимости от класса автомобиля</p>
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
                <h4 className="text-xl font-bold text-white mb-3">Франшиза</h4>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Франшиза - это сумма, которую вы доплачиваете при наступлении страхового случая. 
                  Размер зависит от выбранного типа страховки.
                </p>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-red-400 font-semibold">Размер: от 3,000 до 7,000 ฿</p>
                  <p className="text-gray-400 text-sm mt-1">Примерно $85-$200</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};