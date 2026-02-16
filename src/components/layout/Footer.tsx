import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { MessageCircle, Send, MapPin, Mail, Phone, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    vehicles: [
      { to: '/cars', label: 'All Vehicles' },
      { to: '/cars?category=premium', label: 'Premium Cars' },
      { to: '/cars?category=suv', label: 'Luxury SUVs' },
      { to: '/cars?category=sport', label: 'Sports Cars' },
    ],
    company: [
      { to: '/about', label: 'About Us' },
      { to: '/how-it-works', label: 'How It Works' },
      { to: '/contacts', label: 'Contact' },
      { to: '/terms', label: 'Terms & Conditions' },
    ],
  };

  const socials = [
    { href: 'https://wa.me/66638450372', icon: MessageCircle, label: 'WhatsApp' },
    { href: 'https://www.instagram.com/unicar_rent_phuket/', icon: Instagram, label: 'Instagram' },
    { href: 'https://t.me/unicar_phuket', icon: Send, label: 'Telegram' },
  ];

  return (
    <footer className="bg-black text-white relative">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Logo size="lg" variant="light" className="mb-6" />
            <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-sm">
              Premium car rental service in Phuket. Experience luxury, comfort, and freedom on the island.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-medium mb-6">Vehicles</h4>
            <nav className="space-y-3">
              {links.vehicles.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-white/50 hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-medium mb-6">Company</h4>
            <nav className="space-y-3">
              {links.company.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-white/50 hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-4">
            <h4 className="text-white font-medium mb-6">Get In Touch</h4>
            <div className="space-y-4">
              <a
                href="tel:+66638450372"
                className="flex items-center gap-3 text-white/50 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 rounded-full border border-white/20 group-hover:bg-white group-hover:text-black flex items-center justify-center transition-all duration-300">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm">+66 63 845 0372</span>
              </a>
              <a
                href="mailto:unicar@gmail.com"
                className="flex items-center gap-3 text-white/50 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 rounded-full border border-white/20 group-hover:bg-white group-hover:text-black flex items-center justify-center transition-all duration-300">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm">unicar@gmail.com</span>
              </a>
              <div className="flex items-center gap-3 text-white/50">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm">Phuket, Thailand</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/30 text-sm">
              © {currentYear} UNICAR. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-white/30 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-white/30 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Credits */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-5">
          <p className="text-center text-white/40 text-sm">
            Designed & Developed by{' '}
            <a
              href="https://sintara.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
            >
              Sintara
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
