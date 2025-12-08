import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Heart, User, ChevronRight, Plus, Instagram } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { useFavoritesStore } from '../../store/useFavoritesStore';

// Custom Telegram icon
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

// Custom WhatsApp icon
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const socialLinks = [
  { icon: Instagram, href: 'https://www.instagram.com/shibacars_phuket/', label: 'Instagram' },
  { icon: TelegramIcon, href: 'https://t.me/ShibaCars_Phuket', label: 'Telegram', isCustom: true },
  { icon: WhatsAppIcon, href: 'https://api.whatsapp.com/send/?phone=66959657805&text&type=phone_number&app_absent=0', label: 'WhatsApp', isCustom: true },
];

const carCategories = [
  { id: 'suv', name: 'Внедорожники', icon: '/images/categories/suv.png' },
  { id: 'premium', name: 'Премиум', icon: '/images/categories/premium.png' },
  { id: 'business', name: 'Бизнес', icon: '/images/categories/business.png' },
  { id: 'sport', name: 'Спорткары', icon: '/images/categories/sport.png' },
  { id: 'minivan', name: 'Минивэны', icon: '/images/categories/minivan.png' },
  { id: 'comfort', name: 'Комфорт', icon: '/images/categories/comfort.png' },
  { id: 'electric', name: 'Электро', icon: '/images/categories/electric.png' },
];

const carBrands = [
  { id: 'toyota', name: 'Toyota', logo: '/images/brands/toyota.png' },
  { id: 'honda', name: 'Honda', logo: '/images/brands/honda.png' },
  { id: 'bmw', name: 'BMW', logo: '/images/brands/bmw.png' },
  { id: 'mercedes', name: 'Mercedes', logo: '/images/brands/mercedes.png' },
  { id: 'audi', name: 'Audi', logo: '/images/brands/audi.png' },
  { id: 'lexus', name: 'Lexus', logo: '/images/brands/lexus.svg' },
  { id: 'mazda', name: 'Mazda', logo: '/images/brands/mazda.png' },
  { id: 'nissan', name: 'Nissan', logo: '/images/brands/nissan.png' },
  { id: 'porsche', name: 'Porsche', logo: '/images/brands/porsche.png' },
  { id: 'tesla', name: 'Tesla', logo: '/images/brands/tesla.png' },
];

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCarsDropdownOpen, setIsCarsDropdownOpen] = useState(false);
  const favorites = useFavoritesStore(state => state.favorites);
  const navigate = useNavigate();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { to: '/', label: 'Главная' },
    { to: '/cars', label: 'Автомобили' },
    { to: '/motorcycles', label: 'Мотоциклы' },
    { to: '/about', label: 'О компании' },
    { to: '/terms', label: 'Условия' },
    { to: '/contacts', label: 'Контакты' },
  ];

  return (
    <header className="bg-black/20 backdrop-blur-xl sticky top-0 z-50 border-b border-white/15 py-3 shadow-lg shadow-black/10">
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex-shrink-0">
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              link.to === '/cars' ? (
                <div
                  key={link.to}
                  className="relative"
                  onMouseEnter={() => setIsCarsDropdownOpen(true)}
                  onMouseLeave={() => setIsCarsDropdownOpen(false)}
                >
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        'relative px-4 py-2 text-sm font-semibold transition-colors duration-200 flex items-center gap-1',
                        isActive
                          ? 'text-yellow-500'
                          : 'text-gray-100 hover:text-white'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="relative z-10">{link.label}</span>
                        <ChevronRight className={cn(
                          'w-4 h-4 transition-transform',
                          isCarsDropdownOpen ? 'rotate-90' : ''
                        )} />
                        {isActive && (
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-yellow-500" />
                        )}
                      </>
                    )}
                  </NavLink>

                  {/* Mega Menu Dropdown */}
                  {isCarsDropdownOpen && (
                    <div className="absolute top-full left-0 pt-2 z-50">
                      <div className="bg-black border border-white/15 rounded-2xl shadow-2xl p-6 min-w-[600px]">
                        <div className="flex gap-8">
                          {/* Categories */}
                          <div className="flex-shrink-0">
                            <h4 className="text-sm font-semibold text-gray-400 mb-4">Класс</h4>
                            <div className="space-y-1">
                              {carCategories.map((cat) => (
                                <Link
                                  key={cat.id}
                                  to={`/cars?category=${cat.id}`}
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors group"
                                  onClick={() => setIsCarsDropdownOpen(false)}
                                >
                                  <img src={cat.icon} alt={cat.name} className="w-12 h-7 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                                  <span className="text-sm text-gray-200 group-hover:text-white transition-colors">{cat.name}</span>
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* Brands */}
                          <div className="flex-1 border-l border-white/10 pl-8">
                            <h4 className="text-sm font-semibold text-gray-400 mb-4">Марки</h4>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                              {carBrands.map((brand) => (
                                <Link
                                  key={brand.id}
                                  to={`/cars?brand=${brand.id}`}
                                  className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors group"
                                  onClick={() => setIsCarsDropdownOpen(false)}
                                >
                                  <div className="flex items-center gap-3">
                                    <img src={brand.logo} alt={brand.name} className="w-6 h-6 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <span className="text-sm text-gray-200 group-hover:text-white transition-colors">{brand.name}</span>
                                  </div>
                                  <Plus className="w-4 h-4 text-gray-500 group-hover:text-yellow-500 transition-colors" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 pt-4 border-t border-white/10">
                          <Link
                            to="/cars"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition-colors"
                            onClick={() => setIsCarsDropdownOpen(false)}
                          >
                            Весь автопарк
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'relative px-4 py-2 text-sm font-semibold transition-colors duration-200',
                      isActive
                        ? 'text-yellow-500'
                        : 'text-gray-100 hover:text-white'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative z-10">{link.label}</span>
                      {isActive && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-yellow-500" />
                      )}
                    </>
                  )}
                </NavLink>
              )
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/favorites"
              className="relative p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <Heart className="w-5 h-5 text-gray-100" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link
              to="/profile"
              className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <User className="w-5 h-5 text-gray-100" />
            </Link>

            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl">
              <Phone className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold text-white text-sm">+66 95-965-7805</span>
            </div>
            
            <Button 
              onClick={() => navigate('/cars')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2.5 rounded-xl font-bold transition-colors duration-200"
            >
              Каталог авто
            </Button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - rendered via Portal to body */}
      {isMenuOpen && createPortal(
        <div className="lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Bottom Sheet */}
          <div
            className="fixed z-[9999] bg-gradient-to-b from-zinc-900 to-black border-t border-white/10 rounded-t-3xl animate-slide-up"
            style={{ bottom: 0, left: 0, right: 0 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Navigation */}
            <nav className="px-4 pb-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-4 py-3.5 text-base font-medium rounded-xl transition-colors mb-1',
                      isActive
                        ? 'bg-yellow-500/15 text-yellow-400'
                        : 'text-white active:bg-white/5'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{link.label}</span>
                      <ChevronRight className={cn(
                        'w-5 h-5',
                        isActive ? 'text-yellow-400' : 'text-gray-600'
                      )} />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Divider */}
            <div className="mx-4 h-px bg-white/10" />

            {/* Actions */}
            <div className="p-4 space-y-3">
              <div className="flex gap-3">
                <Link
                  to="/favorites"
                  className="flex-1 flex items-center justify-center gap-2 bg-white/5 text-white py-3 rounded-xl font-medium active:bg-white/10 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart className="w-5 h-5" />
                  <span>Избранное</span>
                  {favorites.length > 0 && (
                    <span className="bg-yellow-500 text-black text-xs px-1.5 py-0.5 rounded-full font-bold">
                      {favorites.length}
                    </span>
                  )}
                </Link>

                <a
                  href="tel:+66959657805"
                  className="flex items-center justify-center gap-2 bg-white/5 text-white px-5 py-3 rounded-xl font-medium active:bg-white/10 transition-colors"
                >
                  <Phone className="w-5 h-5 text-yellow-500" />
                </a>
              </div>

              <Button
                className="w-full bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-600 text-black py-4 rounded-xl font-bold text-base transition-colors"
                onClick={() => {
                  navigate('/cars');
                  setIsMenuOpen(false);
                }}
              >
                Смотреть каталог
              </Button>

              {/* Social Links */}
              <div className="flex justify-center gap-4 pt-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    {social.isCustom ? <social.icon className="w-5 h-5" /> : <social.icon className="w-5 h-5" />}
                  </a>
                ))}
              </div>
            </div>

            {/* Safe area for iOS */}
            <div className="h-safe pb-safe" style={{ paddingBottom: 'env(safe-area-inset-bottom, 12px)' }} />
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};