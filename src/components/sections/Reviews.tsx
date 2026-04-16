import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Quote } from 'lucide-react';

const REVIEW_KEYS = [
  { id: 'r1', avatar: 'AM', rating: 5 },
  { id: 'r2', avatar: 'EK', rating: 5 },
  { id: 'r3', avatar: 'MP', rating: 5 },
] as const;

export const Reviews: React.FC = () => {
  const { t } = useTranslation('pages');

  return (
    <section className="py-16 lg:py-24 bg-black relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="text-white">{t('reviews.titlePart1')} </span>
            <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">{t('reviews.titlePart2')}</span>
          </h2>
          <p className="text-lg text-gray-400">
            {t('reviews.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEW_KEYS.map((review) => (
            <div
              key={review.id}
              className="glass-effect rounded-2xl p-6 border border-dark-800/50 hover:border-yellow-500/30 transition-colors duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white font-semibold">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{t(`reviews.items.${review.id}.name`)}</h4>
                    <p className="text-sm text-gray-500">{t(`reviews.items.${review.id}.date`)}</p>
                  </div>
                </div>
                <Quote className="w-8 h-8 text-yellow-500/20" />
              </div>

              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-700'
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-300">{t(`reviews.items.${review.id}.comment`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
