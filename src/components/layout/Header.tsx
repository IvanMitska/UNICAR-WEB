import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Heart, User, ChevronRight, Plus } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { useFavoritesStore } from '../../store/useFavoritesStore';

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