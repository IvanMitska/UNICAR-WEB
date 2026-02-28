import React, { memo } from 'react';
import { motion } from 'framer-motion';

const ParallaxSectionComponent: React.FC = () => {
  return (
    <section
      className="relative h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url(/imager-web/parallax-road.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Light overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6 max-w-3xl"
      >
        <h2
          className="text-4xl md:text-6xl lg:text-7xl text-white mb-4 md:mb-6 tracking-tight"
          style={{
            fontWeight: 300,
            textShadow: '0 2px 30px rgba(0,0,0,0.3)',
          }}
        >
          Experience the Road
        </h2>
        <p
          className="text-lg md:text-xl text-white/90 font-light max-w-xl mx-auto"
          style={{ textShadow: '0 1px 15px rgba(0,0,0,0.3)' }}
        >
          Every journey tells a story. Make yours unforgettable with our premium fleet.
        </p>
      </motion.div>
    </section>
  );
};

export const ParallaxSection = memo(ParallaxSectionComponent);
