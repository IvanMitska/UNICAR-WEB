import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Instagram, Facebook, Twitter, Youtube, Send, Sparkles } from 'lucide-react';
import { Logo } from '../ui/Logo';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'Youtube' }
  ];

  const navLinks = [
    { to: '/cars', label: 'Автомобили' },
    { to: '/about', label: 'О компании' },
    { to: '/terms', label: 'Условия аренды' },
    { to: '/contacts', label: 'Контакты' }
  ];

  const categories = [
    { to: '/cars?category=economy', label: 'Эконом' },
    { to: '/cars?category=comfort', label: 'Комфорт' },
    { to: '/cars?category=business', label: 'Бизнес' },
    { to: '/cars?category=premium', label: 'Премиум', special: true },
    { to: '/cars?category=suv', label: 'Внедорожники' },
    { to: '/cars?category=sport', label: 'Спорткары' }
  ];

  return (
    <footer className="bg-dark-950 text-gray-400 border-t border-dark-800/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Logo className="mb-6" />
            <p className="text-sm mb-6 text-gray-500 max-w-sm">
              Премиальный сервис аренды автомобилей с эксклюзивной коллекцией и персональным подходом к каждому клиенту.
            </p>

            <div className="mb-8">
              <h4 className="text-white font-semibold mb-4">Подписка на новости</h4>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Ваш email"
                  className="flex-1 px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-600"
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 hover:text-primary-400 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Навигация</h3>
            <nav className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block hover:text-primary-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Категории</h3>
            <nav className="space-y-3">
              {categories.map((category) => (
                <Link
                  key={category.to}
                  to={category.to}
                  className="block hover:text-primary-400 transition-colors flex items-center gap-2"
                >
                  {category.special && <Sparkles className="w-3 h-3 text-accent-gold" />}
                  {category.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Контакты</h3>
            <div className="space-y-4">
              <a href="tel:+66959657805" className="flex items-start gap-3 hover:text-primary-400 transition-colors">
                <Phone className="w-4 h-4 mt-1 flex-shrink-0 text-primary-400" />
                <div>
                  <p className="font-medium text-white">+66 95-965-7805</p>
                  <p className="text-xs text-gray-500">Круглосуточно</p>
                </div>
              </a>

              <a href="mailto:shibacars@gmail.com" className="flex items-start gap-3 hover:text-primary-400 transition-colors">
                <Mail className="w-4 h-4 mt-1 flex-shrink-0 text-primary-400" />
                <span>shibacars@gmail.com</span>
              </a>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-primary-400" />
                <p className="text-sm">24/31 Wichit, Mueang District, Phuket 83000, Thailand</p>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-1 flex-shrink-0 text-primary-400" />
                <p>Ежедневно: 09:00 - 21:00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-dark-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} ShibaCars. Все права защищены.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="hover:text-primary-400 transition-colors">
                Политика конфиденциальности
              </Link>
              <Link to="/terms" className="hover:text-primary-400 transition-colors">
                Пользовательское соглашение
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};