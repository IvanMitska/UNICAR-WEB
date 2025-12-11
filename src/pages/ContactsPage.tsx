import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

export const ContactsPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen pt-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="py-12 lg:py-20 border-b border-primary-100">
          <h1 className="text-4xl lg:text-5xl font-medium text-primary-900 mb-4">
            Контакты
          </h1>
          <p className="text-lg text-primary-500 max-w-xl">
            Свяжитесь с нами любым удобным способом
          </p>
        </div>

        <div className="py-12 lg:py-20">
          {/* Contact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <a
              href="tel:+66959657805"
              className="group p-6 border border-primary-200 rounded-lg hover:border-primary-400 transition-colors"
            >
              <Phone className="w-6 h-6 text-primary-900 mb-4" />
              <h3 className="text-sm font-medium text-primary-500 mb-1">Телефон</h3>
              <p className="text-primary-900 font-medium">+66 95-965-7805</p>
            </a>

            <a
              href="https://wa.me/66959657805"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 border border-primary-200 rounded-lg hover:border-primary-400 transition-colors"
            >
              <MessageCircle className="w-6 h-6 text-primary-900 mb-4" />
              <h3 className="text-sm font-medium text-primary-500 mb-1">WhatsApp</h3>
              <p className="text-primary-900 font-medium">Написать</p>
            </a>

            <a
              href="mailto:unicar@gmail.com"
              className="group p-6 border border-primary-200 rounded-lg hover:border-primary-400 transition-colors"
            >
              <Mail className="w-6 h-6 text-primary-900 mb-4" />
              <h3 className="text-sm font-medium text-primary-500 mb-1">Email</h3>
              <p className="text-primary-900 font-medium">unicar@gmail.com</p>
            </a>

            <div className="p-6 border border-primary-200 rounded-lg">
              <Clock className="w-6 h-6 text-primary-900 mb-4" />
              <h3 className="text-sm font-medium text-primary-500 mb-1">Режим работы</h3>
              <p className="text-primary-900 font-medium">09:00 — 21:00</p>
            </div>
          </div>

          {/* Address & Map */}
          <div className="max-w-4xl">
            <div className="mb-8">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary-900 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-medium text-primary-900 mb-2">Наш адрес</h3>
                  <p className="text-primary-600 mb-3">
                    24/31 Wichit, Mueang District, Phuket 83000, Thailand
                  </p>
                  <a
                    href="https://maps.google.com/?q=24/31+Wichit,+Mueang+District,+Phuket+83000,+Thailand"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-900 hover:text-primary-600 underline transition-colors"
                  >
                    Открыть в Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="aspect-[16/9] rounded-lg overflow-hidden bg-primary-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.353713318278!2d98.35847667604747!3d7.858001092163802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30502f7913f0e6e7%3A0x75b4dc07a4f93826!2sShiba%20Cars%20Carwash%20%26%20Detailing!5e0!3m2!1sru!2sth!4v1765134136727!5m2!1sru!2sth"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="UNICAR Location"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
