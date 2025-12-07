import React from 'react';
import { Warehouse, SprayCan, Map, UtensilsCrossed, HardHat } from 'lucide-react';

const features = [
  {
    icon: Warehouse,
    title: 'Собственный автопарк',
    description: 'Наши автомобили всегда в отличном техническом состоянии, регулярно проходят техосмотр и поддерживаются в идеальном внешнем виде благодаря собственной автомойке',
  },
  {
    icon: SprayCan,
    title: 'Собственный пункт мойки',
    description: 'Мы гарантируем безупречную чистоту автомобиля перед каждой арендой — потому что любим, когда нашим клиентам приятно путешествовать в машине',
  },
  {
    icon: Map,
    title: 'Гайд по лучшим местам',
    description: 'При аренде авто вы получаете персональный гайд с проверенными локациями: от живописных пляжей до скрытых кафе и фотогеничных уголков города',
  },
  {
    icon: UtensilsCrossed,
    title: 'Комфорт в деталях',
    description: 'В каждом автомобиле есть бутилированная вода, салфетки, зарядные кабели и зонт — чтобы вы чувствовали себя комфортно с первых минут пути',
  },
  {
    icon: HardHat,
    title: 'Экипировка мотоцикла',
    description: 'Каждый мотоцикл укомплектован надежным держателем для телефона и качественным шлемом — для вашего удобства и полной свободы во время поездки',
  },
];

export const Features: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-black relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold italic">
            <span className="text-white">ВЫ САДИТЕСЬ В АРЕНДНУЮ МАШИНУ, </span>
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">КАК В СВОЮ!</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-6 lg:p-8 rounded-2xl bg-dark-900/70 border border-dark-700/50 hover:border-yellow-500/50 transition-all duration-300"
              >
                {/* Icon container */}
                <div className="w-16 h-16 rounded-2xl bg-dark-800/80 border border-dark-700/50 flex items-center justify-center mb-6 group-hover:border-yellow-500/30 transition-colors">
                  <Icon className="w-8 h-8 text-yellow-500" strokeWidth={1.5} />
                </div>

                <h3 className="text-xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm lg:text-base">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
