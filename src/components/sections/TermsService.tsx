import React from 'react';
import { motion } from 'framer-motion';
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

export const TermsService: React.FC = () => {
  const paymentOptions = [
    { currency: 'THB', description: 'Тайские баты' },
    { currency: 'RUB', description: 'Российские рубли' },
    { currency: 'USD', description: 'Доллары США' },
    { currency: 'USDT', description: 'USDT криптовалюта' }
  ];

  const carFeatures = [
    { icon: Camera, title: 'Видеорегистратор', description: 'Для вашей безопасности' },
    { icon: Navigation, title: 'Навигация', description: 'GPS система' },
    { icon: Smartphone, title: 'Кабели для зарядки', description: 'iPhone и Android' },
    { icon: Smartphone, title: 'CarPlay', description: 'Подключение смартфона' },
    { icon: Umbrella, title: 'Зонтик', description: 'На случай дождя' },
    { icon: Droplets, title: 'Вода и салфетки', description: 'Для комфорта' },
    { icon: Baby, title: 'Детские кресла', description: 'Бесплатно по запросу' }
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
            Клиентский сервис
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Полный комфорт и профессиональное обслуживание на каждом этапе
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
            <h3 className="text-lg font-bold text-white mb-2">Аренда от суток</h3>
            <p className="text-gray-400 text-sm">Минимальный срок - 24 часа</p>
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
            <h3 className="text-lg font-bold text-white mb-2">Официальный договор</h3>
            <p className="text-gray-400 text-sm">От нашей компании</p>
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
            <h3 className="text-lg font-bold text-white mb-2">Поддержка 24/7</h3>
            <p className="text-gray-400 text-sm">На русском языке</p>
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
            <h3 className="text-lg font-bold text-white mb-2">Удобная оплата</h3>
            <p className="text-gray-400 text-sm">Карты и наличные</p>
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
            Способы оплаты
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {paymentOptions.map((option) => (
              <div
                key={option.currency}
                className="bg-gray-700 rounded-lg p-4 text-center"
              >
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {option.currency}
                </div>
                <div className="text-gray-400 text-sm">
                  {option.description}
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
            В наших автомобилях есть
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="bg-gradient-to-r from-yellow-500 to-red-500 p-2 rounded-full flex-shrink-0">
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">{feature.title}</h4>
                  <p className="text-gray-400 text-xs">{feature.description}</p>
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
            <h4 className="text-2xl font-bold text-white font-display">Подарок каждому клиенту</h4>
          </div>
          
          <p className="text-gray-300 text-lg">
            Гайд-путеводитель по Пхукету с топовыми и инстаграмными локациями
          </p>
          
          <div className="flex items-center justify-center gap-2 mt-4">
            <MapPin className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">Эксклюзивные места для фото</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};