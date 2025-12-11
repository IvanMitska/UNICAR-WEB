import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface Category {
  id: string;
  name: string;
  value: string;
  description: string;
}

const categories: Category[] = [
  { id: 'premium', name: 'Премиум', value: 'premium', description: 'Роскошь и комфорт' },
  { id: 'suv', name: 'Внедорожники', value: 'suv', description: 'Мощь и проходимость' },
  { id: 'sport', name: 'Спорткары', value: 'sport', description: 'Скорость и стиль' },
  { id: 'comfort', name: 'Комфорт', value: 'comfort', description: 'Для повседневных поездок' },
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
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-6">
        {showTitle && (
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-medium text-primary-900 mb-4">
              Выберите категорию
            </h2>
            <p className="text-primary-500 max-w-xl mx-auto">
              От компактных городских авто до мощных внедорожников
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.value)}
              className={cn(
                'group text-left p-6 lg:p-8 rounded-lg border transition-all duration-200',
                selectedCategory === category.value
                  ? 'border-primary-900 bg-primary-50'
                  : 'border-primary-200 hover:border-primary-400 bg-white'
              )}
            >
              <h3 className={cn(
                'text-lg lg:text-xl font-medium mb-2 transition-colors',
                selectedCategory === category.value
                  ? 'text-primary-900'
                  : 'text-primary-900 group-hover:text-primary-700'
              )}>
                {category.name}
              </h3>
              <p className="text-sm text-primary-500">
                {category.description}
              </p>
            </button>
          ))}
        </div>

        {selectedCategory && onCategoryClick && (
          <div className="mt-8 text-center">
            <button
              onClick={() => onCategoryClick(null)}
              className="text-sm text-primary-500 hover:text-primary-900 transition-colors"
            >
              Сбросить фильтр
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
