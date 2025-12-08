import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  value: string;
  image: string;
}

const categories: Category[] = [
  { id: 'suv', name: 'Внедорожники', value: 'suv', image: '/images/categories/suv.png' },
  { id: 'premium', name: 'Премиум', value: 'premium', image: '/images/categories/premium.png' },
  { id: 'business', name: 'Бизнес', value: 'business', image: '/images/categories/business.png' },
  { id: 'sport', name: 'Спорткары', value: 'sport', image: '/images/categories/sport.png' },
  { id: 'minivan', name: 'Минивэны', value: 'minivan', image: '/images/categories/minivan.png' },
  { id: 'comfort', name: 'Комфорт', value: 'comfort', image: '/images/categories/comfort.png' },
  { id: 'coupe', name: 'Кабриолеты', value: 'coupe', image: '/images/categories/coupe.png' },
  { id: 'electric', name: 'Электромобили', value: 'electric', image: '/images/categories/electric.png' },
];


interface CarCategoriesProps {
  onCategoryClick?: (category: string | null) => void;
  selectedCategory?: string | null;
  showTitle?: boolean;
}

export const CarCategories: React.FC<CarCategoriesProps> = ({
  onCategoryClick,
  selectedCategory,
  showTitle = true
}) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    if (onCategoryClick) {
      onCategoryClick(category);
    } else {
      navigate(`/cars?category=${category}`);
    }
  };

  return (
    <section className="py-12 lg:py-16 bg-black relative overflow-hidden">
      <div className="container mx-auto px-4">
        {showTitle && (
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">
              <span className="text-white">Категории </span>
              <span className="text-yellow-400">автомобилей</span>
            </h2>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 lg:gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.value)}
              className={`
                group relative flex flex-col items-center py-5 px-3 rounded-2xl transition-colors duration-200 cursor-pointer
                ${selectedCategory === category.value
                  ? 'bg-gradient-to-b from-yellow-500/25 to-yellow-500/5 border-yellow-500/60'
                  : 'bg-dark-900/30 hover:bg-white/10 border-dark-700/40 hover:border-dark-600/60'
                }
                border overflow-hidden
              `}
            >
              {/* Glow effect when selected */}
              {selectedCategory === category.value && (
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent pointer-events-none" />
              )}

              <div
                className={`
                  mb-3 h-10 transition-transform duration-200 flex items-center justify-center relative
                  ${selectedCategory === category.value
                    ? 'scale-110'
                    : 'group-hover:scale-105'
                  }
                `}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-auto object-contain"
                  style={{
                    filter: selectedCategory === category.value
                      ? 'brightness(1.3) contrast(1.2) drop-shadow(0 0 12px rgba(254, 197, 45, 0.8))'
                      : 'brightness(1.2) contrast(1.1) opacity(0.85)',
                    maxWidth: '110px'
                  }}
                />
              </div>

              <span
                className={`
                  text-xs font-medium transition-colors duration-200 text-center leading-tight
                  ${selectedCategory === category.value
                    ? 'text-yellow-500 font-semibold'
                    : 'text-gray-300 group-hover:text-white'
                  }
                `}
              >
                {category.name}
              </span>
            </button>
          ))}
        </div>

        {selectedCategory && (
          <div className="mt-6 text-center">
            <button
              onClick={() => onCategoryClick && onCategoryClick(null)}
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Все категории
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
