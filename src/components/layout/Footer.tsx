import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    vehicles: [
      { to: '/cars', label: 'Автомобили' },
      { to: '/motorcycles', label: 'Мотоциклы' },
      { to: '/cars?category=premium', label: 'Премиум' },
      { to: '/cars?category=suv', label: 'Внедорожники' },
    ],
    company: [
      { to: '/services', label: 'Услуги' },
      { to: '/terms', label: 'Условия аренды' },
      { to: '/contacts', label: 'Контакты' },
    ],
  };

  return (
    <footer className="bg-primary-950 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo size="lg" variant="light" className="mb-6" />
            <p className="text-primary-400 text-sm leading-relaxed">
              Премиум аренда автомобилей и мотоциклов на Пхукете.
              Эксклюзивность, статус, простота.
            </p>
          </div>

          {/* Vehicles */}
          <div>
            <h4 className="text-sm font-medium text-primary-300 uppercase tracking-wider mb-6">
              Транспорт
            </h4>
            <nav className="space-y-4">
              {links.vehicles.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-primary-400 hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-medium text-primary-300 uppercase tracking-wider mb-6">
              Компания
            </h4>
            <nav className="space-y-4">
              {links.company.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-primary-400 hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium text-primary-300 uppercase tracking-wider mb-6">
              Связаться
            </h4>
            <div className="space-y-4 text-sm">
              <a
                href="tel:+66959657805"
                className="block text-white hover:text-primary-300 transition-colors font-medium"
              >
                +66 95-965-7805
              </a>
              <a
                href="mailto:unicar@gmail.com"
                className="block text-primary-400 hover:text-white transition-colors"
              >
                unicar@gmail.com
              </a>
              <p className="text-primary-500">
                Пхукет, Таиланд
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-primary-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-500 text-sm">
              © {currentYear} UNICAR. Все права защищены.
            </p>
            <div className="flex gap-8 text-sm">
              <Link
                to="/privacy"
                className="text-primary-500 hover:text-white transition-colors"
              >
                Конфиденциальность
              </Link>
              <Link
                to="/terms"
                className="text-primary-500 hover:text-white transition-colors"
              >
                Условия
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
