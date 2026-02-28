import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle, ArrowRight } from 'lucide-react';

const contactMethods = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+66 63 845 0372',
    href: 'tel:+66638450372',
    description: 'Available 9 AM — 9 PM',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Message Us',
    href: 'https://wa.me/66638450372',
    description: 'Quick response guaranteed',
    external: true,
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'unicar@gmail.com',
    href: 'mailto:unicar@gmail.com',
    description: 'We reply within 24 hours',
  },
  {
    icon: Clock,
    label: 'Working Hours',
    value: '09:00 — 21:00',
    description: 'Every day, including holidays',
  },
];

export const ContactsPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/imager-web/parallax-road.png)',
            filter: 'brightness(0.8)',
          }}
        />

      </section>

      {/* Contact Methods */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              const Content = (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative p-8 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-6">
                    <Icon className="w-6 h-6 text-gray-900" strokeWidth={1.5} />
                    {method.href && (
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all duration-300" />
                    )}
                  </div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                    {method.label}
                  </p>
                  <p className="text-xl font-medium text-gray-900 mb-2">
                    {method.value}
                  </p>
                  <p className="text-sm text-gray-500">
                    {method.description}
                  </p>
                </motion.div>
              );

              if (method.href) {
                return (
                  <a
                    key={method.label}
                    href={method.href}
                    target={method.external ? '_blank' : undefined}
                    rel={method.external ? 'noopener noreferrer' : undefined}
                  >
                    {Content}
                  </a>
                );
              }

              return <div key={method.label}>{Content}</div>;
            })}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="pb-20 lg:pb-28">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-4">
                Our Location
              </p>
              <h2
                className="text-4xl lg:text-5xl text-gray-900 mb-6"
                style={{ fontWeight: 200 }}
              >
                Visit Our Office
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-md">
                Located in the heart of Phuket, we offer convenient pickup and delivery services across the island.
              </p>

              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-gray-900" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-gray-900 font-medium mb-1">
                    24/31 Wichit, Mueang District
                  </p>
                  <p className="text-gray-500">
                    Phuket 83000, Thailand
                  </p>
                </div>
              </div>

              <a
                href="https://www.google.com/maps?q=7.90292176589458,98.3453527065566"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
              >
                Open in Google Maps
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d358.4725009950626!2d98.3453527065566!3d7.90292176589458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zN8KwNTQnMTAuNyJOIDk4wrAyMCc0My40IkU!5e1!3m2!1sru!2sth!4v1769856575297!5m2!1sru!2sth"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="UNICAR Location"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-black">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-4xl lg:text-5xl text-white mb-6"
              style={{ fontWeight: 200 }}
            >
              Ready to Drive?
            </h2>
            <p className="text-lg text-white/60 mb-10 max-w-md mx-auto">
              Browse our collection of premium vehicles and find your perfect ride.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/cars"
                className="px-8 py-3.5 bg-white text-gray-900 text-sm font-medium rounded-full hover:bg-gray-100 transition-colors"
              >
                Explore Cars
              </a>
              <a
                href="https://wa.me/66638450372"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 text-white text-sm font-medium rounded-full border border-white/30 hover:bg-white/10 transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
