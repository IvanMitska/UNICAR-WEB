import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Droplets,
  Shield,
  Car,
  Clock,
  Check,
  Phone,
  MessageCircle,
  ChevronDown,
  Coffee,
  Zap,
  Wind
} from 'lucide-react';
import { cn } from '../utils/cn';

type CarSize = 'small' | 'medium' | 'large' | 'xl' | 'van';

const carSizes: { id: CarSize; name: string }[] = [
  { id: 'small', name: 'Small' },
  { id: 'medium', name: 'Medium' },
  { id: 'large', name: 'Large' },
  { id: 'xl', name: 'XL' },
  { id: 'van', name: 'Van' },
];

const packages = [
  {
    id: 'standard',
    name: 'Standard',
    subtitle: '10x Car Wash',
    color: 'from-gray-500 to-gray-600',
    borderColor: 'border-gray-500/30',
    washes: 10,
    time: '40 мин',
    prices: { small: 3900, medium: 4400, large: 4900, xl: 5900, van: 7400 },
    features: [
      'Бесконтактная мойка',
      'Сушка кузова',
      'Уборка салона',
      'Протирка панели',
    ],
  },
  {
    id: 'silver',
    name: 'Silver',
    subtitle: '10x Car Wash',
    color: 'from-slate-400 to-slate-500',
    borderColor: 'border-slate-400/30',
    washes: 10,
    time: '40-50 мин',
    prices: { small: 3900, medium: 4500, large: 4900, xl: 5900, van: 6900 },
    features: [
      'Мойка двигателя',
      'Покрытие стёкол (антидождь)',
      'Удаление водных пятен',
      'Удаление битума',
      'Озонирование салона ×1',
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    subtitle: '14x Car Wash',
    color: 'from-yellow-500 to-yellow-600',
    borderColor: 'border-yellow-500/30',
    popular: true,
    washes: 14,
    time: '40-50 мин',
    prices: { small: 5400, medium: 6400, large: 7400, xl: 8900, van: 9900 },
    features: [
      'Мойка двигателя',
      'Покрытие стёкол (антидождь)',
      'Удаление водных пятен',
      'Удаление битума',
      'Озонирование салона ×2',
      'Полировка (3 части)',
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    subtitle: '15x Car Wash',
    color: 'from-purple-400 to-purple-600',
    borderColor: 'border-purple-400/30',
    washes: 15,
    time: '50-60 мин',
    prices: { small: 7900, medium: 8900, large: 9900, xl: 10900, van: 11900 },
    features: [
      'Мойка двигателя',
      'Покрытие стёкол (антидождь)',
      'Удаление водных пятен',
      'Удаление битума',
      'Озонирование салона ×3',
      'Полировка (5 частей)',
      'Освежение салона ×2',
      'Очистка глиной (Clay)',
    ],
  },
];

const services = [
  {
    id: 'engine',
    name: 'Мойка двигателя',
    nameEn: 'Engine Cleaning',
    description: 'Очистка двигателя от пыли, масла и загрязнений с использованием безопасной химии. Продлевает срок службы и улучшает внешний вид.',
    icon: Zap,
  },
  {
    id: 'window',
    name: 'Покрытие стёкол',
    nameEn: 'Window Coating',
    description: 'Нанесение защитного состава на стёкла, который отталкивает воду и грязь. Эффект «антидождь».',
    icon: Droplets,
  },
  {
    id: 'waterspot',
    name: 'Удаление водных пятен',
    nameEn: 'Waterspot Removal',
    description: 'Удаление известковых разводов и минеральных пятен со стёкол, образующихся после высыхания воды.',
    icon: Sparkles,
  },
  {
    id: 'asphalt',
    name: 'Удаление битума',
    nameEn: 'Asphalt Removal',
    description: 'Удаление битумных и асфальтовых капель с кузова после езды по горячему или грязному покрытию.',
    icon: Car,
  },
  {
    id: 'ozone',
    name: 'Озонирование салона',
    nameEn: 'Ozone Treatment',
    description: 'Обработка озоном для нейтрализации запахов, бактерий, плесени, вирусов и аллергенов.',
    icon: Wind,
  },
  {
    id: 'polishing',
    name: 'Полировка кузова',
    nameEn: 'Polishing',
    description: 'Многоступенчатая полировка с абразивными и защитными составами. Восстанавливает блеск, убирает царапины.',
    icon: Sparkles,
  },
  {
    id: 'interior',
    name: 'Освежение салона',
    nameEn: 'Interior Refresh',
    description: 'Лёгкая химчистка и ароматизация салона. Освежает воздух, удаляет лёгкие загрязнения и запахи.',
    icon: Wind,
  },
  {
    id: 'clay',
    name: 'Очистка глиной',
    nameEn: 'Dust & Clay Removal',
    description: 'Обработка кузова clay-массой, которая убирает мельчайшие загрязнения и дорожную плёнку. Этап перед полировкой.',
    icon: Shield,
  },
];

const formatPrice = (price: number) => `฿${price.toLocaleString()}`;

export const ServicesPage: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<CarSize>('medium');
  const [expandedService, setExpandedService] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-full text-yellow-500 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Собственная мойка
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Car Wash & Detailing
            </h1>

            <p className="text-lg text-gray-400">
              Профессиональный уход за вашим автомобилем на Пхукете
            </p>
          </motion.div>
        </div>
      </section>

      {/* Size Selector */}
      <section className="py-6 border-y border-white/5 bg-dark-950">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-gray-500 text-sm mr-2">Размер авто:</span>
            {carSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size.id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  selectedSize === size.id
                    ? "bg-yellow-500 text-black"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                )}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Coffee bonus banner */}
          <div className="flex items-center justify-center gap-2 mb-8 px-4 py-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20 max-w-md mx-auto">
            <Coffee className="w-5 h-5 text-yellow-500" />
            <span className="text-yellow-500 font-medium text-sm">3 бесплатных кофе к каждому пакету</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative bg-white/[0.03] backdrop-blur-xl rounded-2xl border overflow-hidden flex flex-col",
                  pkg.popular ? "border-yellow-500/50 ring-1 ring-yellow-500/20" : pkg.borderColor
                )}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-yellow-500 text-black text-xs font-bold text-center py-1">
                    ПОПУЛЯРНЫЙ
                  </div>
                )}

                <div className={cn("p-5 flex flex-col flex-1", pkg.popular && "pt-8")}>
                  {/* Header */}
                  <div className={cn(
                    "inline-block px-3 py-1 rounded-lg text-sm font-bold mb-3 bg-gradient-to-r text-white self-start",
                    pkg.color
                  )}>
                    {pkg.name}
                  </div>

                  <div className="text-gray-400 text-xs mb-4">{pkg.subtitle}</div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-white">
                      {formatPrice(pkg.prices[selectedSize])}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {pkg.time}
                      </span>
                      <span>{pkg.washes} моек</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 flex-1">
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => window.open('https://wa.me/66959651805')}
                    className={cn(
                      "w-full py-3 rounded-xl font-medium transition-all text-sm mt-5",
                      pkg.popular
                        ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                        : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    )}
                  >
                    Заказать
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-12 md:py-16 border-t border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
            Что входит в пакеты
          </h2>
          <p className="text-gray-400 text-center mb-10 max-w-xl mx-auto">
            Подробное описание всех услуг, которые включены в наши пакеты
          </p>

          <div className="max-w-3xl mx-auto space-y-3">
            {services.map((service) => (
              <motion.div
                key={service.id}
                initial={false}
                className="bg-white/[0.03] rounded-xl border border-white/5 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedService(
                    expandedService === service.id ? null : service.id
                  )}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                      <service.icon className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{service.name}</div>
                      <div className="text-xs text-gray-500">{service.nameEn}</div>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-gray-500 transition-transform",
                      expandedService === service.id && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {expandedService === service.id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0">
                        <p className="text-gray-400 text-sm pl-14">
                          {service.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-12 md:py-16 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text */}
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                Смотрите как мы работаем
              </h2>
              <p className="text-gray-400 mb-6 text-lg">
                Каждый автомобиль получает максимум внимания и заботы.
                Мы используем только профессиональное оборудование и премиальную химию.
              </p>
              <ul className="space-y-4">
                {[
                  'Безопасная бесконтактная мойка',
                  'Профессиональная химия Koch Chemie',
                  'Детейлинг от сертифицированных мастеров',
                  'Индивидуальный подход к каждому авто',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300 text-lg">
                    <Check className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Video in phone frame - desktop / Full width - mobile */}
            <div className="order-1 lg:order-2 flex justify-center">
              {/* iPhone frame for desktop */}
              <div className="hidden md:block relative">
                {/* iPhone 15 Pro style frame */}
                <div className="relative w-[300px] h-[612px]">
                  {/* Titanium frame */}
                  <div className="absolute inset-0 bg-[#1d1d1f] rounded-[55px] shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_25px_50px_-12px_rgba(0,0,0,0.8)]" />

                  {/* Screen bezel */}
                  <div className="absolute inset-[3px] bg-black rounded-[52px]" />

                  {/* Screen */}
                  <div className="absolute inset-[4px] rounded-[51px] overflow-hidden">
                    <video
                      src="/videos/car-wash.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />

                    {/* Dynamic Island */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-full" />
                  </div>

                  {/* Side button (right) */}
                  <div className="absolute right-[-2px] top-[140px] w-[3px] h-[80px] bg-[#2a2a2c] rounded-l-sm" />

                  {/* Volume buttons (left) */}
                  <div className="absolute left-[-2px] top-[120px] w-[3px] h-[30px] bg-[#2a2a2c] rounded-r-sm" />
                  <div className="absolute left-[-2px] top-[160px] w-[3px] h-[55px] bg-[#2a2a2c] rounded-r-sm" />
                  <div className="absolute left-[-2px] top-[225px] w-[3px] h-[55px] bg-[#2a2a2c] rounded-r-sm" />
                </div>

                {/* Glow effect */}
                <div className="absolute -inset-8 bg-yellow-500/10 rounded-full blur-3xl -z-10" />
              </div>

              {/* Full width video for mobile */}
              <div className="md:hidden w-full">
                <div className="aspect-[9/16] max-h-[70vh] rounded-2xl overflow-hidden max-w-xs mx-auto">
                  <video
                    src="/videos/car-wash.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 rounded-3xl border border-yellow-500/20 p-8 md:p-12">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Готовы записаться?
              </h2>
              <p className="text-gray-400 mb-8">
                Свяжитесь с нами для записи на мойку или консультации
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.open('tel:+66959651805')}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  +66 95-965-1805
                </button>
                <button
                  onClick={() => window.open('https://wa.me/66959651805')}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-400 rounded-xl text-white font-medium transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
