import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Shield, Headphones, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    number: '01',
    title: '2-Hour Delivery',
    description: 'We deliver your car anywhere on the island within 2 hours. Airport, hotel, or villa.',
    icon: Clock,
  },
  {
    number: '02',
    title: 'Full Insurance',
    description: 'All vehicles are fully insured. First-class protection for your peace of mind.',
    icon: Shield,
  },
  {
    number: '03',
    title: 'Concierge Service',
    description: 'Personal manager available 24/7. We solve any question.',
    icon: Headphones,
  },
  {
    number: '04',
    title: 'Island Guide',
    description: 'Exclusive guide with the best locations as a gift with every rental.',
    icon: MapPin,
  },
];

const stats = [
  { value: '40+', label: 'Vehicles' },
  { value: '3', label: 'Years Experience' },
  { value: '500+', label: 'Happy Clients' },
  { value: '24/7', label: 'Support' },
];

const FeaturesComponent: React.FC = () => {
  return (
    <section className="pt-20 lg:pt-32 pb-0 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 mb-20 lg:mb-28">
          {/* Left - Header & Features */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <p className="text-gray-400 uppercase tracking-[0.2em] text-xs font-medium mb-3">
                Why UNICAR
              </p>
              <h2 className="text-3xl lg:text-5xl font-light text-gray-900 leading-tight mb-6">
                We create experiences,{' '}
                <span className="text-gray-400">not just rent cars</span>
              </h2>
              <p className="text-gray-500 text-lg max-w-md">
                Premium service with attention to every detail. Your comfort is our priority.
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.number}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group p-5 bg-white rounded-2xl hover:bg-gray-900 border border-gray-100 hover:border-gray-900 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-gray-100 group-hover:bg-white/10 flex items-center justify-center flex-shrink-0 transition-all duration-300">
                        <Icon className="w-5 h-5 text-gray-900 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white transition-colors duration-300">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-gray-500 group-hover:text-gray-400 text-sm leading-relaxed pl-15">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8"
            >
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-gray-900 font-medium hover:gap-4 transition-all duration-300"
              >
                Learn more about us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Right - Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="sticky top-32">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5]">
                <img
                  src="/images/features-car.jpg"
                  alt="Luxury car experience"
                  className="w-full h-full object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Floating card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="absolute bottom-6 left-6 right-6 p-5 bg-white/95 backdrop-blur-sm rounded-2xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-medium border-2 border-white">
                        JD
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-medium border-2 border-white">
                        MK
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white text-sm font-medium border-2 border-white">
                        AS
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium text-sm">500+ happy customers</p>
                      <p className="text-gray-500 text-xs">Join them today</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gray-900 rounded-2xl -z-10" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gray-200 rounded-2xl -z-10" />
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-12 border-t border-gray-200"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center group"
              >
                <p className="text-5xl lg:text-6xl font-light text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </p>
                <p className="text-gray-400 text-sm uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export const Features = memo(FeaturesComponent);
