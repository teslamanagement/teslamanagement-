import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { AuthorizationInfo } from '../types';
import { TeslaLogo } from './TeslaLogo';
import { TeslaWordmark } from './TeslaWordmark';

interface NavbarProps {
  onOpenPurchaseModal: (preferredModel?: string) => void;
  onOpenDashboard: () => void;
  authInfo?: AuthorizationInfo;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPurchaseModal,
  onOpenDashboard,
  authInfo,
  activeSection = 'home',
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Vehicles', href: '#vehicles' },
    { label: 'Special Pricing', href: '#special-pricing' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About Management', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-xs py-3.5'
          : 'bg-white/80 backdrop-blur-xs border-b border-neutral-200/60 py-4'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center space-x-2.5 group focus:outline-none"
            id="brand-logo"
          >
            {/* Official Tesla Logo */}
            <TeslaLogo className="w-7 h-7 flex-shrink-0 transition-transform duration-200 group-hover:scale-105" color="#E82127" />
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <TeslaWordmark className="h-3.5 w-auto text-neutral-900" />
                <span className="font-light text-xs tracking-[0.2em] uppercase text-neutral-500">
                  MANAGEMENT
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-xs"></span>
                <span className="text-[10px] text-neutral-500 font-medium tracking-wide">
                  Client Desk
                </span>
              </div>
            </div>
          </a>
        </div>

        {/* Permanent Desktop Navigation Links */}
        <nav className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-1" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.label}
                href={link.href}
                id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-200 relative flex items-center space-x-1.5 ${
                  isActive
                    ? 'text-neutral-900 bg-neutral-100 shadow-2xs border border-neutral-200'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <span>{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Permanent Desktop Actions */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Private Dashboard trigger */}
          <button
            type="button"
            id="nav-dashboard-button"
            onClick={onOpenDashboard}
            className="p-2 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-800 border border-neutral-300 bg-white hover:bg-neutral-50 transition-all cursor-pointer shadow-2xs"
            title="Private Management Dashboard"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>

          {/* Primary CTA: Contact Management */}
          <button
            type="button"
            id="nav-contact-management-btn"
            onClick={() => onOpenPurchaseModal()}
            className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-all duration-200 cursor-pointer flex items-center space-x-1.5 active:scale-95 whitespace-nowrap"
          >
            <span>Contact</span>
          </button>
        </div>
      </div>
    </header>
  );
};
