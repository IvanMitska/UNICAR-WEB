import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Instagram, Send, Sparkles } from 'lucide-react';
import { Logo } from '../ui/Logo';

// Custom Telegram icon
const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

// Custom WhatsApp icon
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/shibacars_phuket/', label: 'Instagram' },
    { icon: TelegramIcon, href: 'https://t.me/ShibaCars_Phuket', label: 'Telegram', isCustom: true },
    { icon: WhatsAppIcon, href: 'https://api.whatsapp.com/send/?phone=66959657805&text&type=phone_number&app_absent=0', label: 'WhatsApp', isCustom: true },
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
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 hover:text-primary-400 transition-colors"
                  aria-label={social.label}
                >
                  {social.isCustom ? <social.icon /> : <social.icon className="w-4 h-4" />}
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