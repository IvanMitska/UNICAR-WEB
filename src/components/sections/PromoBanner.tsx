import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';
import { usePromo } from '../../hooks/usePromo';
import { PromoBadge } from '../ui/PromoBadge';
import { Picture } from '../ui/Picture';

interface PromoBannerProps {
  /** full — секция на главной, strip — тихая строка над каталогом */
  variant?: 'full' | 'strip';
  className?: string;
}

/** Фон баннера — реальное фото из автопарка */
const BANNER_PHOTO = '/images/cars/mustang-white-2017/g0.jpg';

export const PromoBanner: React.FC<PromoBannerProps> = ({ variant = 'full', className }) => {
  const { t } = useTranslation('common');
  const { active, percent, endsOn } = usePromo();

  if (!active) return null;

  if (variant === 'strip') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          'flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-2xl bg-white px-6 py-4 text-center ring-1 ring-gray-200/70',
          className
        )}
      >
        <PromoBadge size="md" />
        <p className="text-[15px] leading-relaxed text-gray-500">
          <span className="font-semibold text-gray-900">{t('promo.headline')}.</span>{' '}
          {t('promo.stripNote', { date: endsOn })}
        </p>
      </motion.div>
    );
  }

  return (
    <section className={cn('py-8 lg:py-12', className)}>
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="relative isolate overflow-hidden rounded-[28px] bg-gray-950"
        >
          {/* Фото на всю плашку */}
          <Picture
            src={BANNER_PHOTO}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          {/* Мягкая вуаль под текстом — плотнее слева, плавно сходит на нет */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.72) 28%, rgba(0,0,0,0.38) 55%, rgba(0,0,0,0.05) 85%, rgba(0,0,0,0) 100%)',
            }}
          />
          <div aria-hidden className="absolute inset-0 bg-black/10" />

          <div className="relative flex min-h-[300px] items-center px-8 py-12 sm:px-12 lg:min-h-[380px] lg:px-16">
            <div className="max-w-lg">
              <p className="text-sm font-medium text-white/70">{t('promo.label')}</p>

              {/* Сам процент — главный акцент блока */}
              <h2 className="mt-2 text-[76px] font-semibold leading-[0.95] tracking-[-0.045em] text-white sm:text-[92px]">
                −{percent}%
              </h2>
              <p className="mt-1 text-2xl font-medium text-white sm:text-3xl">
                {t('promo.headline')}
              </p>

              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
                {t('promo.subtitle')} {t('promo.untilSentence', { date: endsOn })}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  to="/cars"
                  className="rounded-full bg-white px-7 py-3 text-[15px] font-medium text-gray-900 transition-colors duration-300 hover:bg-white/90"
                >
                  {t('promo.cta')}
                </Link>
                <Link
                  to="/terms"
                  className="text-[15px] text-white/80 transition-colors duration-300 hover:text-white"
                >
                  {t('promo.terms')} <span aria-hidden>›</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
