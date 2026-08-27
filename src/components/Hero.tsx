import React from 'react';
import { ArrowRight, ChevronDown, CheckCircle2, Globe2 } from 'lucide-react';
import { AuthorizationInfo } from '../types';

interface HeroProps {
  onExploreVehicles: () => void;
  onContactManagement?: () => void;
  authInfo?: AuthorizationInfo;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreVehicles,
  onContactManagement,
  authInfo,
}) => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-white border-b border-neutral-200"
    >
      {/* Background Vehicle Image with Soft Light Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=2000&q=85"
          alt="Tesla Fleet"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-center opacity-10 scale-105 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Primary Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-900 font-sans leading-tight mb-3 sm:mb-4">
          Experience <span className="text-red-600">Tesla</span>
        </h1>

        {/* Subheadline */}
        <p className="text-sm sm:text-base md:text-lg text-neutral-600 font-normal max-w-2xl mb-6 sm:mb-8 leading-relaxed">
          Explore vehicle models, specifications, available promotional pricing, and dedicated client management assistance.
        </p>

        {/* Dual Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto mb-8 sm:mb-10">
          <button
            type="button"
            id="hero-explore-vehicles-btn"
            onClick={onExploreVehicles}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center space-x-2 active:scale-95"
          >
            <span>Explore Vehicles</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            id="hero-contact-management-btn"
            onClick={onContactManagement}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 hover:border-neutral-400 font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2 active:scale-95 shadow-2xs"
          >
            <span>Contact Management</span>
          </button>
        </div>

        {/* Key Pillars / Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-3xl w-full text-left">
          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200 shadow-2xs hover:border-neutral-300 transition-colors">
            <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 mb-1">
              <CheckCircle2 className="w-4 h-4 text-red-600" />
              <span>Vehicle Selection</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Guidance across models, configurations, and technical specifications.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200 shadow-2xs hover:border-neutral-300 transition-colors">
            <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Promotional Pricing</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Access special management allocation pricing and programs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200 shadow-2xs hover:border-neutral-300 transition-colors">
            <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 mb-1">
              <Globe2 className="w-4 h-4 text-blue-600" />
              <span>Global Support</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Coordination with delivery hubs and official purchase documentation.
            </p>
          </div>
        </div>

        {/* Notice */}
        <div className="mt-8 max-w-2xl">
          <p className="text-[11px] text-neutral-500 leading-normal">
            This platform presents vehicle specifications, features, and management allocation pricing.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="mt-6 cursor-pointer" onClick={onExploreVehicles}>
          <ChevronDown className="w-5 h-5 text-neutral-400 hover:text-neutral-700 transition-colors animate-bounce" />
        </div>
      </div>
    </section>
  );
};
