import React, { useState, useEffect } from 'react';
import { Lock, Menu, X } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setMobileMenuOpen(false);
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
        isScrolled || mobileMenuOpen
          ? 'bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-xs py-2.5 sm:py-3'
          : 'bg-white/90 backdrop-blur-xs border-b border-neutral-200/60 py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center min-w-0 flex-shrink">
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center space-x-1.5 sm:space-x-2.5 group focus:outline-none min-w-0"
            id="brand-logo"
          >
            {/* Official Tesla Logo */}
            <TeslaLogo className="w-5 h-5 sm:w-7 sm:h-7 flex-shrink-0 transition-transform duration-200 group-hover:scale-105" color="#E82127" />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center space-x-1 sm:space-x-1.5">
                <TeslaWordmark className="h-2.5 sm:h-3.5 w-auto text-neutral-900 flex-shrink-0" />
                <span className="font-light text-[9px] sm:text-xs tracking-[0.14em] sm:tracking-[0.2em] uppercase text-neutral-500 truncate">
                  MANAGEMENT
                </span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-xs flex-shrink-0"></span>
                <span className="text-[8.5px] sm:text-[10px] text-neutral-500 font-medium tracking-wide whitespace-nowrap">
                  Client Desk
                </span>
              </div>
            </div>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 py-1" aria-label="Main navigation">
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

        {/* Actions & Mobile Menu Button */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
          {/* Private Dashboard trigger */}
          <button
            type="button"
            id="nav-dashboard-button"
            onClick={onOpenDashboard}
            className="p-1.5 sm:p-2 rounded-lg text-xs font-medium text-neutral-600 hover:text-neutral-900 border border-neutral-300 bg-white hover:bg-neutral-50 transition-all cursor-pointer shadow-2xs flex-shrink-0"
            title="Private Management Dashboard"
            aria-label="Private Management Dashboard"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>

          {/* Primary CTA: Contact Management */}
          <button
            type="button"
            id="nav-contact-management-btn"
            onClick={() => onOpenPurchaseModal()}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-xs transition-all duration-200 cursor-pointer flex items-center space-x-1 active:scale-95 whitespace-nowrap flex-shrink-0"
          >
            <span>Contact</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-200 transition-colors cursor-pointer flex-shrink-0"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white/98 backdrop-blur-md px-4 pt-3 pb-5 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1.5" aria-label="Mobile navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.label}
                  href={link.href}
                  id={`mobile-nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'text-neutral-900 bg-neutral-100 font-bold border border-neutral-200'
                      : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2">
              <button
                type="button"
                id="mobile-nav-inquiry-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPurchaseModal();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider text-center cursor-pointer shadow-xs"
              >
                Submit Vehicle Request
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
