import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';
import { usePromo } from '../../hooks/usePromo';

type PromoBadgeTone = 'solid' | 'onDark';
type PromoBadgeSize = 'sm' | 'md' | 'lg';

interface PromoBadgeProps {
  /** solid — чёрная заливка для светлого фона, onDark — для тёмных панелей */
  tone?: PromoBadgeTone;
  size?: PromoBadgeSize;
  className?: string;
}

const tones: Record<PromoBadgeTone, string> = {
  solid: 'bg-gray-900 text-white',
  onDark: 'bg-white text-gray-900',
};

const sizes: Record<PromoBadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-[15px]',
};

/**
 * Чип «−20%» рядом с ценой. Скрывается сам, когда акция не идёт.
 */
export const PromoBadge: React.FC<PromoBadgeProps> = ({
  tone = 'solid',
  size = 'sm',
  className,
}) => {
  const { t } = useTranslation('common');
  const { active, percent } = usePromo();

  if (!active) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md font-semibold leading-none tabular-nums',
        tones[tone],
        sizes[size],
        className
      )}
    >
      {t('promo.badge', { percent })}
    </span>
  );
};
