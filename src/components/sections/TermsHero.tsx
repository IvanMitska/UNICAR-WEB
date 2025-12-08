import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Clock, CheckCircle } from 'lucide-react';

export const TermsHero: React.FC = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-yellow-500 to-red-500 p-4 rounded-full">
              <FileText className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-display">
            Условия
            <span className="text-yellow-400 block">
              аренды автомобилей
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Прозрачные правила и выгодные условия для комфортной аренды. 
            Никаких скрытых платежей и неприятных сюрпризов
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 text-gray-300">
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CheckCircle className="w-5 h-5 text-yellow-400" />
              <span>Честные цены</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Shield className="w-5 h-5 text-yellow-400" />
              <span>Полная страховка</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Clock className="w-5 h-5 text-yellow-400" />
              <span>24/7 поддержка</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};