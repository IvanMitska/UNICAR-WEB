import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Phone, ArrowRight, Sparkles } from 'lucide-react';

export const CTA: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/5 via-transparent to-yellow-600/5 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6">
            <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            <span className="block sm:inline text-white">Готовы арендовать </span>
            <span className="block sm:inline bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">автомобиль?</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Выберите идеальный автомобиль для ваших потребностей прямо сейчас
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/cars">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-lg shadow-yellow-500/30 transition-colors duration-300"
              >
                Выбрать автомобиль
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <a href="tel:+74951234567">
              <Button
                size="lg"
                className="bg-white/5 border border-white/20 text-white hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-colors duration-300"
              >
                <Phone className="w-5 h-5 mr-2" />
                Позвонить нам
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { value: 'От 2500₽', label: 'в день' },
              { value: '15 минут', label: 'на оформление' },
              { value: '0₽', label: 'скрытых платежей' }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-dark-800/50 hover:border-yellow-500/30 transition-colors duration-300"
              >
                <div className="text-2xl sm:text-3xl font-bold mb-2 text-yellow-500">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};