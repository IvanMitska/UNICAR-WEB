import React from 'react';
import { Link } from 'react-router-dom';
import { cars } from '../../data/cars';
import { CarCard } from '../ui/CarCard';
import { ArrowRight } from 'lucide-react';

export const PopularCars: React.FC = () => {
  const popularCars = cars.slice(0, 6);

  return (
    <section className="py-20 lg:py-32 bg-primary-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-medium text-primary-900 mb-4">
              Популярные автомобили
            </h2>
            <p className="text-primary-500 max-w-xl">
              Самые востребованные модели нашего автопарка
            </p>
          </div>
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 text-primary-900 font-medium hover:gap-4 transition-all"
          >
            Все автомобили
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularCars.map((car, index) => (
            <CarCard key={car.id} car={car} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
