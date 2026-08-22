import React, { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck, Lock, ExternalLink, Phone, Sparkles } from 'lucide-react';
import { AuthorizationInfo } from '../types';
import { TeslaLogo } from './TeslaLogo';
import { TeslaWordmark } from './TeslaWordmark';

interface NavbarProps {
  onOpenPurchaseModal: (preferredModel?: string) => void;
  onOpenDashboard: () => void;
  onOpenVerification: () => void;
  authInfo?: AuthorizationInfo;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPurchaseModal,
  onOpenDashboard,
  onOpenVerification,
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
    { label: 'Special Pricing', href: '#special-pricing', badge: 'Authorized' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About Management', href: '#about' },
    { label: 'Authorization', href: '#authorization' },
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
    <>
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-sm py-3.5'
            : 'bg-white/80 backdrop-blur-sm border-b border-neutral-100 py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className="flex items-center space-x-2.5 group focus:outline-none"
              id="brand-logo"
            >
              {/* Official Tesla Logo */}
              <TeslaLogo className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 transition-transform duration-200 group-hover:scale-105" />
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <TeslaWordmark className="h-3 sm:h-3.5 w-auto text-neutral-900" />
                  <span className="font-light text-xs sm:text-sm tracking-[0.18em] uppercase text-neutral-600">
                    MANAGEMENT
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[10px] text-neutral-500 font-medium tracking-wide">
                    Authorized Representative Desk
                  </span>
                </div>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.label}
                  href={link.href}
                  id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-3 py-2 rounded-md text-xs font-semibold tracking-wider uppercase transition-colors relative flex items-center space-x-1.5 ${
                    isActive
                      ? 'text-neutral-900 bg-neutral-100 font-bold'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 uppercase font-mono font-semibold">
                      {link.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {/* Verification Channel link */}
            <button
              type="button"
              id="nav-verify-button"
              onClick={onOpenVerification}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-neutral-700 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-300 bg-neutral-50/80 hover:bg-neutral-100 transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
              title="Verify Official Authorization"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verify Auth</span>
            </button>

            {/* Private Dashboard trigger */}
            <button
              type="button"
              id="nav-dashboard-button"
              onClick={onOpenDashboard}
              className="p-2 rounded-lg text-xs font-medium text-neutral-600 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-300 bg-neutral-50 hover:bg-neutral-100 transition-all cursor-pointer shadow-xs"
              title="Private Management Dashboard"
            >
              <Lock className="w-3.5 h-3.5 text-neutral-600" />
            </button>

            {/* Primary CTA: Contact Management */}
            <button
              type="button"
              id="nav-contact-management-btn"
              onClick={() => onOpenPurchaseModal()}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition-all duration-200 cursor-pointer flex items-center space-x-1.5 active:scale-95"
            >
              <span>Contact Management</span>
            </button>
          </div>

          {/* Mobile menu hamburger button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              type="button"
              id="nav-mobile-contact-btn"
              onClick={() => onOpenPurchaseModal()}
              className="sm:hidden px-2.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium uppercase tracking-wider"
            >
              Contact
            </button>
            <button
              type="button"
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-neutral-50 text-neutral-700 hover:text-neutral-900 border border-neutral-200 focus:outline-none cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-drawer"
            className="lg:hidden bg-white border-b border-neutral-200 px-4 pt-3 pb-6 space-y-2.5 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200 shadow-xl"
          >
            <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-medium text-neutral-800">Authorized Rep Desk</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-neutral-600 border border-neutral-200 font-semibold">
                {authInfo?.authorizationNumber || 'TM-AUTH-2026-GLOBAL-8941'}
              </span>
            </div>

            <div className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  id={`mobile-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 font-mono font-semibold">
                        {link.badge}
                      </span>
                    )}
                  </div>
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-neutral-200 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPurchaseModal();
                }}
                className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider text-center shadow-sm transition-colors cursor-pointer"
              >
                Contact Management
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenVerification();
                  }}
                  className="py-2.5 px-3 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-700 hover:text-neutral-900 text-xs font-medium flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verify Status</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDashboard();
                  }}
                  className="py-2.5 px-3 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-700 hover:text-neutral-900 text-xs font-medium flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
