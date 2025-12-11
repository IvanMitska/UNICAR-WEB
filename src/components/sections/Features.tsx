import React from 'react';
import { Shield, Clock, MapPin, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Полная страховка',
    description: 'Все автомобили застрахованы. Вы защищены в любой ситуации.',
  },
  {
    icon: Clock,
    title: 'Подача за 2 часа',
    description: 'Быстрая доставка автомобиля в любую точку острова.',
  },
  {
    icon: MapPin,
    title: 'Гайд по Пхукету',
    description: 'Персональный гайд с лучшими локациями при каждой аренде.',
  },
  {
    icon: Sparkles,
    title: 'Идеальное состояние',
    description: 'Собственная автомойка. Автомобиль всегда чист и готов к поездке.',
  },
];

export const Features: React.FC = () => {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-medium text-primary-900 mb-4">
            Почему UNICAR
          </h2>
          <p className="text-primary-500 max-w-xl mx-auto">
            Мы создаём впечатления, а не просто сдаём автомобили в аренду
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center rounded-full bg-primary-100">
                  <Icon className="w-6 h-6 text-primary-900" strokeWidth={1.5} />
                </div>

                <h3 className="text-lg font-medium text-primary-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-primary-500 leading-relaxed">
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
