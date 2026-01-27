import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const CTA: React.FC = () => {
  return (
    <section className="relative h-[500px] lg:h-[600px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-[center_bottom] bg-no-repeat"
        style={{ backgroundImage: 'url(/images/cta-bg.png)' }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-gray-500 uppercase tracking-[0.2em] text-xs font-medium mb-4"
            >
              Start Your Journey
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl lg:text-6xl font-light text-gray-900 tracking-tight mb-6"
            >
              Your adventure awaits
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-500 mb-10"
            >
              Premium vehicles delivered to your location. Explore Phuket your way.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/cars"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300"
              >
                <span>Browse Vehicles</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="tel:+66959657805"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-gray-900 rounded-full font-medium border border-gray-300 hover:bg-gray-100 transition-all duration-300"
              >
                <span>+66 95-965-7805</span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
