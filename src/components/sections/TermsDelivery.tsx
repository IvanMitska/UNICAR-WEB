import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Fuel, Route, Sparkles, Gauge, Car } from 'lucide-react';

export const TermsDelivery: React.FC = () => {
  const deliveryFeatures = [
    {
      icon: Truck,
      title: 'Доставка в любую точку',
      description: 'Доставляем автомобиль или байк в удобную для вас локацию'
    },
    {
      icon: Fuel,
      title: 'Полный бак',
      description: 'Транспорт подается всегда чистый и с полным баком'
    },
    {
      icon: Route,
      title: 'Лимит 150 км/день',
      description: 'Дополнительный километр - 2 THB'
    }
  ];

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
            Доставка и километраж
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Удобная доставка и справедливые условия по пробегу
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {deliveryFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
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
                {feature.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
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
              <h3 className="text-2xl font-bold text-white font-display">Доставка</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                <span className="text-gray-300">По острову (платная)</span>
                <span className="text-yellow-400 font-semibold">Зависит от района</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                <span className="text-gray-300">Состояние транспорта</span>
                <span className="text-white font-semibold">Чистый + полный бак</span>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-red-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-semibold">Удобный сервис</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Если нет времени заправлять и мыть автомобиль при возврате - 
                  мы сделаем это за вас (чеки предоставим)
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
              <h3 className="text-2xl font-bold text-white font-display">Километраж</h3>
            </div>
            
            <div className="space-y-4">
              <div className="text-center bg-gray-800 rounded-lg p-6">
                <div className="text-4xl font-bold text-yellow-400 mb-2">150 км</div>
                <div className="text-gray-300">в сутки включено</div>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                <span className="text-gray-300">Дополнительный км</span>
                <span className="text-yellow-400 font-semibold">2 THB</span>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-red-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Car className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-semibold">Справедливо</span>
                </div>
                <p className="text-gray-300 text-sm">
                  150 км в день достаточно для комфортного передвижения по острову. 
                  Превышение оплачивается по честным тарифам.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};