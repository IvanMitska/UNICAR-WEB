import React from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { CarCategories } from '../components/sections/CarCategories';
import { PopularCars } from '../components/sections/PopularCars';
import { Features } from '../components/sections/Features';
import { Reviews } from '../components/sections/Reviews';
import { CTA } from '../components/sections/CTA';

// 3D section disabled for performance (24MB model + Three.js rendering)
// To re-enable, uncomment the lazy import and Suspense block below

export const HomePage: React.FC = () => {
  return (
    <div className="bg-black">
      <HeroSection />
      <CarCategories />
      <PopularCars />
      <Features />
      <Reviews />
      <CTA />
    </div>
  );
};