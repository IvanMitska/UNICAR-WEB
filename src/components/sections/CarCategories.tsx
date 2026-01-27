import React, { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  count: number;
}

const categories: Category[] = [
  {
    id: 'premium',
    name: 'Премиум',
    description: 'Mercedes, BMW, Audi',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2940&auto=format&fit=crop',
    count: 12,
  },
  {
    id: 'sport',
    name: 'Спорткары',
    description: 'Porsche, Mustang',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2940&auto=format&fit=crop',
    count: 8,
  },
  {
    id: 'suv',
    name: 'Внедорожники',
    description: 'Range Rover, X5',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=2942&auto=format&fit=crop',
    count: 15,
  },
  {
    id: 'cabrio',
    name: 'Кабриолеты',
    description: 'Открытый верх',
    image: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?q=80&w=2940&auto=format&fit=crop',
    count: 6,
  },
];

interface CarCategoriesProps {
  onCategoryClick?: (category: string | null) => void;
  selectedCategory?: string | null;
  showTitle?: boolean;
}

const CarCategoriesComponent: React.FC<CarCategoriesProps> = ({
  showTitle = true
}) => {
  const navigate = useNavigate();

  const handleCategoryClick = useCallback((categoryId: string) => {
    navigate(`/cars?category=${categoryId}`);
  }, [navigate]);

  const handleViewAllClick = useCallback(() => {
    navigate('/cars');
  }, [navigate]);

  return (
    <section className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-light text-primary-900 mb-4">
              Коллекция
            </h2>
            <p className="text-lg text-primary-400 max-w-xl">
              Эксклюзивные автомобили для незабываемых впечатлений
            </p>
          </motion.div>
        )}

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.15) }}
              onClick={() => handleCategoryClick(category.id)}
              className="group relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer text-left"
            >
              {/* Image */}
              <div className="absolute inset-0">
                <img
                  src={category.image}
                  alt={category.name}
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={index < 2 ? "auto" : "low"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white/60 text-sm uppercase tracking-widest mb-2">
                      {category.count} авто
                    </p>
                    <h3 className="text-3xl lg:text-4xl font-light text-white mb-2">
                      {category.name}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {category.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:border-white transition-all duration-500">
                    <ArrowUpRight className="w-6 h-6 text-white group-hover:text-black transition-colors duration-500" />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <button
            onClick={handleViewAllClick}
            className="inline-flex items-center gap-3 text-primary-900 font-medium group"
          >
            <span className="text-lg">Смотреть все автомобили</span>
            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export const CarCategories = memo(CarCategoriesComponent);
