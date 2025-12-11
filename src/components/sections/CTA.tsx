import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const CTA: React.FC = () => {
  return (
    <section className="py-20 lg:py-32 bg-primary-900">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-medium text-white mb-6">
            Готовы начать?
          </h2>
          <p className="text-lg text-primary-300 mb-10 max-w-xl mx-auto">
            Выберите автомобиль и отправляйтесь в путь уже сегодня
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/cars"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-900 rounded-md font-medium hover:bg-primary-100 transition-colors"
            >
              Смотреть автомобили
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="tel:+66959657805"
              className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-white rounded-md font-medium hover:bg-white/10 transition-colors"
            >
              +66 95-965-7805
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
