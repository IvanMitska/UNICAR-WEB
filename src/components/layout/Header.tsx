import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { cn } from '../../utils/cn';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { to: '/cars', label: 'Автомобили' },
    { to: '/motorcycles', label: 'Мотоциклы' },
    { to: '/services', label: 'Услуги' },
    { to: '/contacts', label: 'Контакты' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-primary-100'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo size="md" variant={isScrolled ? 'dark' : 'dark'} />
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'text-primary-900'
                      : 'text-primary-500 hover:text-primary-900'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Actions - Right */}
          <div className="hidden lg:flex items-center gap-6">
            <button className="flex items-center gap-2 text-sm text-primary-500 hover:text-primary-900 transition-colors">
              <Globe className="w-4 h-4" />
              <span>RU</span>
            </button>

            <Link
              to="/profile"
              className="text-sm font-medium text-primary-500 hover:text-primary-900 transition-colors"
            >
              Профиль
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 -mr-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-primary-900" />
            ) : (
              <Menu className="w-6 h-6 text-primary-900" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Full Screen Overlay */}
      {isMenuOpen &&
        createPortal(
          <div className="lg:hidden fixed inset-0 z-[9999]">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-white"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Content */}
            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between h-16 px-6 border-b border-primary-100">
                <Logo size="md" />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 -mr-2"
                >
                  <X className="w-6 h-6 text-primary-900" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-6 py-8">
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'block py-4 text-2xl font-medium border-b border-primary-100 transition-colors',
                          isActive
                            ? 'text-primary-900'
                            : 'text-primary-400 hover:text-primary-900'
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-primary-100">
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-4 text-lg font-medium text-primary-500 hover:text-primary-900"
                  >
                    Профиль
                  </Link>
                </div>
              </nav>

              {/* Footer */}
              <div className="px-6 py-6 border-t border-primary-100">
                <a
                  href="tel:+66959657805"
                  className="block text-center py-4 bg-primary-900 text-white rounded-md font-medium"
                >
                  +66 95-965-7805
                </a>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};
