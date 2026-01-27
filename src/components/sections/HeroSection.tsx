import React, { useState, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const HeroSectionComponent: React.FC = () => {
  const navigate = useNavigate();
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    navigate('/cars');
  }, [navigate]);

  const handleCategoryClick = useCallback((category: string) => {
    navigate(`/cars?category=${category}`);
  }, [navigate]);

  return (
    <section className="h-screen relative overflow-hidden">
      {/* Background Images */}
      {/* Desktop Background */}
      <div
        className="absolute inset-0 hidden md:block bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/imager-web/hero-desctop.png)' }}
      />
      {/* Mobile Background */}
      <div
        className="absolute inset-0 md:hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/imager-web/hero-mobile.png)' }}
      />

      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Content Container - flex column to push elements */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Section - Title */}
        <div className="pt-24 md:pt-28 lg:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-6"
          >
            <h1
              className="text-[48px] sm:text-[64px] md:text-[80px] lg:text-[100px] xl:text-[120px] text-white mb-2 md:mb-4 tracking-[-0.02em] leading-[1]"
              style={{ fontWeight: 200 }}
            >
              Drive the Future
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-white/70 max-w-md mx-auto font-light tracking-wide">
              Premium Car & Electric Vehicle Rentals
            </p>
          </motion.div>
        </div>

        {/* Spacer - pushes bottom content down */}
        <div className="flex-1" />

        {/* Bottom Section - Buttons and Search */}
        <div className="pb-8 md:pb-12 lg:pb-16 px-4 md:px-6">
          {/* Category Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 md:gap-3 mb-5 md:mb-6"
          >
            <button
              onClick={() => handleCategoryClick('')}
              className="px-6 md:px-8 py-2.5 md:py-3 bg-white text-gray-900 text-xs md:text-sm font-medium rounded-full hover:bg-gray-100 transition-colors"
            >
              Explore Cars
            </button>
            <button
              onClick={() => handleCategoryClick('suv')}
              className="px-6 md:px-8 py-2.5 md:py-3 bg-white/20 backdrop-blur-md text-white text-xs md:text-sm font-medium rounded-full border border-white/30 hover:bg-white/30 transition-colors"
            >
              Luxury SUVs
            </button>
            <button
              onClick={() => handleCategoryClick('sport')}
              className="px-6 md:px-8 py-2.5 md:py-3 bg-white/20 backdrop-blur-md text-white text-xs md:text-sm font-medium rounded-full border border-white/30 hover:bg-white/30 transition-colors"
            >
              Sports Cars
            </button>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-2xl lg:max-w-3xl mx-auto"
          >
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-xl md:rounded-2xl shadow-2xl flex flex-col md:flex-row items-stretch"
            >
              {/* Pick-Up Location */}
              <div className="flex-1 relative flex items-center px-4 py-3.5 md:py-4 md:border-r border-gray-200">
                <input
                  type="text"
                  placeholder="Pick-Up Location"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
                />
              </div>

              {/* Pick-Up Date */}
              <div className="flex-1 relative flex items-center px-4 py-3.5 md:py-4 md:border-r border-gray-200 border-t md:border-t-0">
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
                />
              </div>

              {/* Drop-Off Date */}
              <div className="flex-1 relative flex items-center px-4 py-3.5 md:py-4 md:border-r border-gray-200 border-t md:border-t-0">
                <input
                  type="date"
                  value={dropoffDate}
                  onChange={(e) => setDropoffDate(e.target.value)}
                  className="w-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
                />
              </div>

              {/* Search Button */}
              <div className="p-2 border-t md:border-t-0">
                <button
                  type="submit"
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-6 md:px-8 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export const HeroSection = memo(HeroSectionComponent);
