import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';

// Pages that have a light background from the start (no dark hero)
const lightBackgroundPages = ['/cars', '/buy', '/about', '/contacts', '/terms', '/privacy', '/sign-in', '/get-started', '/profile', '/forgot-password', '/reset-password'];

// Featured cars for mega menu - Row 1 (4 cars)
const featuredCarsRow1 = [
  {
    id: 'mustang-white-2020',
    name: 'Ford Mustang GT',
    image: '/cars/menu/mustang-white.png',
    category: 'sport',
    offsetY: 0,
  },
  {
    id: 'mustang-blue-2020',
    name: 'Ford Mustang GT',
    image: '/cars/menu/mustang-blue.png',
    category: 'sport',
    offsetY: 0,
  },
  {
    id: 'mustang-yellow-2021',
    name: 'Ford Mustang GT',
    image: '/cars/menu/mustang-yellow.png',
    category: 'sport',
    offsetY: 20,
  },
  {
    id: 'mercedes-c200',
    name: 'Mercedes-Benz S-Class',
    image: '/cars/menu/mersedes-green.png',
    category: 'premium',
    offsetY: 0,
  },
];

// Row 2 (BMWs + All Cars)
const featuredCarsRow2 = [
  {
    id: 'bmw-x5-2020',
    name: 'BMW X5',
    image: '/cars/menu/bmw.png',
    category: 'suv',
    offsetY: 0,
  },
  {
    id: 'bmw-420i-blue',
    name: 'BMW 420i',
    image: '/cars/menu/bmw420i.png',
    category: 'premium',
    offsetY: 0,
  },
  {
    id: 'all-cars',
    name: 'All Cars',
    image: '/cars/menu/mustang-white.png',
    category: 'all',
    isInventory: true,
  },
];

const quickLinks = [
  { label: 'All Cars', to: '/cars' },
  { label: 'Luxury Cars', to: '/cars?category=premium' },
  { label: 'Luxury SUVs', to: '/cars?category=suv' },
  { label: 'Sports Cars', to: '/cars?category=sport' },
  { label: 'Economy', to: '/cars?category=economy' },
  { label: 'Contacts', to: '/contacts' },
];

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const ticking = useRef(false);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Check if current page has light background
  const isLightPage = lightBackgroundPages.some(page => location.pathname.startsWith(page));
  const shouldUseDarkText = isScrolled || activeDropdown || isLightPage;

  const updateScrollState = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
    ticking.current = false;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateScrollState);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateScrollState]);

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

  const handleMouseEnter = (key: string) => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
    }
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 100);
  };

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
    }
  };

  const navLinks = [
    { to: '/cars', label: 'Rent a Car', hasDropdown: true, dropdownKey: 'rent' },
    { to: '/buy', label: 'Buy a Car', hasDropdown: true, dropdownKey: 'buy' },
    { to: '/about', label: 'About Us', hasDropdown: false },
    { to: '/contacts', label: 'Contacts', hasDropdown: false },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-[env(safe-area-inset-top)]',
          shouldUseDarkText
            ? 'bg-white/80 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Logo */}
            <Link
              to="/"
              className="flex-shrink-0 group relative z-50"
              onClick={() => setActiveDropdown(null)}
            >
              <span className={cn(
                "text-lg md:text-xl tracking-[0.25em] font-semibold transition-all duration-300 group-hover:tracking-[0.35em]",
                shouldUseDarkText ? "text-gray-900" : "text-white"
              )}>
                UNICAR
              </span>
            </Link>

            {/* Desktop Navigation - Center */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {navLinks.map((link) => (
                <div
                  key={link.to}
                  className="relative"
                  onMouseEnter={() => link.hasDropdown && handleMouseEnter(link.dropdownKey!)}
                  onMouseLeave={handleMouseLeave}
                >
                  <NavLink
                    to={link.to}
                    onClick={() => setActiveDropdown(null)}
                    className={({ isActive }) =>
                      cn(
                        'relative text-sm font-medium transition-all duration-300 py-2 px-3 rounded-md',
                        activeDropdown === link.dropdownKey
                          ? 'bg-gray-100 text-gray-900'
                          : shouldUseDarkText
                            ? isActive
                              ? 'text-gray-900'
                              : 'text-gray-600 hover:text-gray-900'
                            : isActive
                              ? 'text-white'
                              : 'text-white/80 hover:text-white'
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </div>
              ))}
            </nav>

            {/* Desktop Actions - Right */}
            <div className="hidden lg:flex items-center gap-6 relative z-50">
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  onClick={() => setActiveDropdown(null)}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:opacity-70",
                    shouldUseDarkText
                      ? "text-gray-900"
                      : "text-white"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                    shouldUseDarkText
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-900"
                  )}>
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                  <span className="hidden xl:inline">{user?.firstName}</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/sign-in"
                    onClick={() => setActiveDropdown(null)}
                    className={cn(
                      "text-sm font-medium transition-all duration-300 hover:opacity-70",
                      shouldUseDarkText
                        ? "text-gray-600 hover:text-gray-900"
                        : "text-white/80 hover:text-white"
                    )}
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/get-started"
                    onClick={() => setActiveDropdown(null)}
                    className={cn(
                      "px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 transform hover:scale-105",
                      shouldUseDarkText
                        ? "text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white"
                        : "text-white border-2 border-white/60 hover:bg-white hover:text-gray-900"
                    )}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 -mr-2 transition-transform duration-300 hover:scale-110 relative z-50"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className={cn("w-6 h-6", shouldUseDarkText ? "text-gray-900" : "text-white")} />
              ) : (
                <Menu className={cn("w-6 h-6", shouldUseDarkText ? "text-gray-900" : "text-white")} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mega Menu Dropdown */}
      <AnimatePresence>
        {activeDropdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 pt-[calc(72px+env(safe-area-inset-top))]"
          >
            {/* Backdrop - closes on hover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onMouseEnter={() => setActiveDropdown(null)}
              onClick={() => setActiveDropdown(null)}
            />

            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="relative bg-white shadow-2xl"
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="container mx-auto px-6 lg:px-8 py-10">
                <div className="flex gap-12">
                  {/* Cars Grid - Tesla Style */}
                  <div className="flex-1">
                    {/* Row 1 - 4 cars */}
                    <div className="grid grid-cols-4 gap-8 mb-8">
                      {featuredCarsRow1.map((car, index) => (
                        <motion.div
                          key={car.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.35,
                            delay: index * 0.05,
                            ease: [0.4, 0, 0.2, 1]
                          }}
                        >
                          <Link
                            to={`/cars/${car.id}`}
                            onClick={() => setActiveDropdown(null)}
                            className="group text-center block"
                          >
                            <div className="relative mb-4 h-40 flex items-end justify-center">
                              <div style={{ transform: `translateY(${car.offsetY || 0}px)` }}>
                                <img
                                  src={car.image}
                                  alt={car.name}
                                  className="max-h-40 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                                />
                              </div>
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 mb-1.5">
                              {car.name}
                            </h3>
                            <div className="flex items-center justify-center gap-4 text-xs">
                              <span className="text-gray-500 hover:text-gray-900 underline underline-offset-2 cursor-pointer transition-colors">
                                Details
                              </span>
                              <span className="text-gray-500 hover:text-gray-900 underline underline-offset-2 cursor-pointer transition-colors">
                                Rent
                              </span>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>

                    {/* Row 2 - Inventory */}
                    <div className="grid grid-cols-4 gap-8">
                      {featuredCarsRow2.map((car, index) => (
                        <motion.div
                          key={car.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.35,
                            delay: 0.2 + index * 0.05,
                            ease: [0.4, 0, 0.2, 1]
                          }}
                        >
                          <Link
                            to={car.isInventory ? '/cars' : `/cars/${car.id}`}
                            onClick={() => setActiveDropdown(null)}
                            className="group text-center block"
                          >
                            <div className="relative mb-4 h-40 flex items-end justify-center">
                              <img
                                src={car.image}
                                alt={car.name}
                                className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 mb-1.5">
                              {car.name}
                            </h3>
                            <div className="flex items-center justify-center gap-4 text-xs">
                              {car.isInventory ? (
                                <>
                                  <span className="text-gray-500 hover:text-gray-900 underline underline-offset-2 cursor-pointer transition-colors">
                                    View All
                                  </span>
                                  <span className="text-gray-500 hover:text-gray-900 underline underline-offset-2 cursor-pointer transition-colors">
                                    Browse
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="text-gray-500 hover:text-gray-900 underline underline-offset-2 cursor-pointer transition-colors">
                                    Details
                                  </span>
                                  <span className="text-gray-500 hover:text-gray-900 underline underline-offset-2 cursor-pointer transition-colors">
                                    Rent
                                  </span>
                                </>
                              )}
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Links - Right side */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="w-48 border-l border-gray-200 pl-8"
                  >
                    <nav className="space-y-0.5">
                      {quickLinks.map((link, index) => (
                        <motion.div
                          key={link.to}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.2 + index * 0.02,
                          }}
                        >
                          <Link
                            to={link.to}
                            onClick={() => setActiveDropdown(null)}
                            className="block py-1.5 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                          >
                            {link.label}
                          </Link>
                        </motion.div>
                      ))}
                    </nav>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu - Full Screen Overlay */}
      {isMenuOpen &&
        createPortal(
          <div className="lg:hidden fixed inset-0 z-[9999] bg-white animate-menu-open">
            {/* Menu Content */}
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
                <span className="text-lg tracking-[0.25em] font-semibold text-gray-900">
                  UNICAR
                </span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 -mr-2 transition-transform duration-200 active:scale-90"
                >
                  <X className="w-6 h-6 text-gray-900" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-6 py-8 overflow-y-auto">
                <div className="space-y-2">
                  {navLinks.map((link, index) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'block py-4 text-2xl font-light border-b border-gray-100 transition-all duration-300 hover:pl-4 animate-menu-item',
                          isActive
                            ? 'text-gray-900'
                            : 'text-gray-400 hover:text-gray-900'
                        )
                      }
                      style={{ animationDelay: `${100 + index * 60}ms` }}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>

                {/* Mobile Featured Cars */}
                <div
                  className="mt-8 pt-6 border-t border-gray-100 animate-menu-item"
                  style={{ animationDelay: '350ms' }}
                >
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-4">Featured</p>
                  <div className="grid grid-cols-2 gap-4">
                    {featuredCarsRow1.map((car) => (
                      <Link
                        key={car.id}
                        to={`/cars/${car.id}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="group block"
                      >
                        <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 mb-2">
                          <img
                            src={car.image}
                            alt={car.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <p className="text-sm text-gray-900">{car.name}</p>
                      </Link>
                    ))}
                  </div>
                </div>

                <div
                  className="mt-10 pt-8 border-t border-gray-100 space-y-4 animate-menu-item"
                  style={{ animationDelay: '450ms' }}
                >
                  {isAuthenticated ? (
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 py-3 text-lg text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                      </div>
                      <span>{user?.firstName} {user?.lastName}</span>
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/sign-in"
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-3 text-lg text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/get-started"
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-center py-4 text-gray-900 text-lg font-medium border-2 border-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
