import React from 'react';
import { motion } from 'framer-motion';
import { Bike, Zap, Car, Truck } from 'lucide-react';

const categories = [
  {
    id: 'scooter',
    name: 'Скутеры',
    icon: Bike,
    description: 'Для городских поездок',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'sport',
    name: 'Спортбайки',
    icon: Zap,
    description: 'Для любителей скорости',
    gradient: 'from-red-500 to-yellow-500',
  },
  {
    id: 'adventure',
    name: 'Адвенчер',
    icon: Truck,
    description: 'Для дальних поездок',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 'cruiser',
    name: 'Круизеры',
    icon: Car,
    description: 'Комфорт и стиль',
    gradient: 'from-purple-500 to-pink-500',
  },
];

interface MotorcycleCategoriesProps {
  selectedCategory: string | null;
  onCategoryClick: (category: string | null) => void;
  showTitle?: boolean;
}

export const MotorcycleCategories: React.FC<MotorcycleCategoriesProps> = ({
  selectedCategory,
  onCategoryClick,
  showTitle = true,
}) => {
  return (
    <section className="bg-black py-12 lg:py-16">
      <div className="container mx-auto px-4">
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Категории мотоциклов
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Выберите идеальный мотоцикл для ваших поездок по Пхукету
            </p>
          </motion.div>
        )}

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryClick(null)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              !selectedCategory
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg'
                : 'bg-dark-800/50 text-gray-300 hover:bg-dark-700/50 border border-dark-700'
            }`}
          >
            Все мотоциклы
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              onClick={() => onCategoryClick(category.id)}
              className={`group cursor-pointer relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'ring-2 ring-yellow-500 shadow-2xl'
                  : 'hover:shadow-xl'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-dark-800/80 to-dark-900/80 backdrop-blur-sm"></div>
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
              
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${category.gradient} mb-4`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-yellow-500 group-hover:bg-clip-text transition-all">
                  {category.name}
                </h3>
                
                <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors">
                  {category.description}
                </p>
              </div>
              
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};