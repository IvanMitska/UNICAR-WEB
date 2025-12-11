import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative h-screen flex flex-col">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2940&auto=format&fit=crop"
          alt="Premium car"
          className="w-full h-full object-cover"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      </div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col justify-center items-center text-center px-6 pt-16">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium text-white tracking-tight mb-6">
            UNICAR
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-light tracking-wide">
            Премиум аренда на Пхукете
          </p>
        </div>
      </div>

      {/* Bottom Actions - Tesla Style */}
      <div className="relative z-10 pb-12 px-6">
        <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/cars')}
            className="flex-1 py-3 px-8 bg-white/90 backdrop-blur-sm text-primary-900 rounded-md font-medium text-sm hover:bg-white transition-colors"
          >
            Автомобили
          </button>
          <button
            onClick={() => navigate('/motorcycles')}
            className="flex-1 py-3 px-8 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-md font-medium text-sm hover:bg-white/20 transition-colors"
          >
            Мотоциклы
          </button>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToContent}
          className="mx-auto mt-8 flex flex-col items-center text-white/60 hover:text-white transition-colors"
        >
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </button>
      </div>
    </section>
  );
};
