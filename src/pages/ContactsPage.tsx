import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';

export const ContactsPage: React.FC = () => {
  return (
    <div className="bg-black min-h-screen py-12 lg:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Свяжитесь </span>
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">с нами</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Мы всегда на связи и готовы помочь вам с арендой
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <a
            href="tel:+66959657805"
            className="group p-6 bg-dark-900/50 border border-dark-700/50 rounded-2xl hover:border-yellow-500/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors">
              <Phone className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Телефон</h3>
            <p className="text-yellow-500 font-medium">+66 95-965-7805</p>
            <p className="text-gray-500 text-sm mt-1">Круглосуточно</p>
          </a>

          <a
            href="https://wa.me/66959657805"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 bg-dark-900/50 border border-dark-700/50 rounded-2xl hover:border-yellow-500/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors">
              <MessageCircle className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">WhatsApp</h3>
            <p className="text-yellow-500 font-medium">Написать</p>
            <p className="text-gray-500 text-sm mt-1">Быстрый ответ</p>
          </a>

          <a
            href="mailto:shibacars@gmail.com"
            className="group p-6 bg-dark-900/50 border border-dark-700/50 rounded-2xl hover:border-yellow-500/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors">
              <Mail className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Email</h3>
            <p className="text-yellow-500 font-medium text-sm">shibacars@gmail.com</p>
            <p className="text-gray-500 text-sm mt-1">Ответим за 2 часа</p>
          </a>

          <div className="p-6 bg-dark-900/50 border border-dark-700/50 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Режим работы</h3>
            <p className="text-yellow-500 font-medium">09:00 — 21:00</p>
            <p className="text-gray-500 text-sm mt-1">Ежедневно</p>
          </div>
        </div>

        {/* Address & Map */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-dark-900/50 border border-dark-700/50 rounded-2xl overflow-hidden">
            {/* Address Header */}
            <div className="p-6 border-b border-dark-700/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Наш адрес</h3>
                  <p className="text-gray-300">24/31 Wichit, Mueang District, Phuket 83000, Thailand</p>
                  <a
                    href="https://maps.google.com/?q=24/31+Wichit,+Mueang+District,+Phuket+83000,+Thailand"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-yellow-500 hover:text-yellow-400 text-sm mt-2 transition-colors"
                  >
                    Открыть в Google Maps
                    <Send className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="aspect-[16/9] lg:aspect-[21/9]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.353713318278!2d98.35847667604747!3d7.858001092163802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30502f7913f0e6e7%3A0x75b4dc07a4f93826!2sShiba%20Cars%20Carwash%20%26%20Detailing!5e0!3m2!1sru!2sth!4v1765134136727!5m2!1sru!2sth"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Shiba Cars Location"
              />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-6">Предпочитаете живое общение?</p>
          <a
            href="tel:+66959657805"
            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-xl transition-colors"
          >
            <Phone className="w-5 h-5" />
            Позвонить нам
          </a>
        </div>
      </div>
    </div>
  );
};
