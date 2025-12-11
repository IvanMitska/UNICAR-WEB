import React from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { CarCategories } from '../components/sections/CarCategories';
import { PopularCars } from '../components/sections/PopularCars';
import { Features } from '../components/sections/Features';
import { CTA } from '../components/sections/CTA';

export const HomePage: React.FC = () => {
  return (
    <div className="bg-white">
      <HeroSection />
      <CarCategories />
      <PopularCars />
      <Features />
      <CTA />
    </div>
  );
};
