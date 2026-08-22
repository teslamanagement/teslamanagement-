import React from 'react';
import { ArrowRight, ShieldCheck, ChevronDown, CheckCircle2, Globe2 } from 'lucide-react';
import { AuthorizationInfo } from '../types';

interface HeroProps {
  onExploreVehicles: () => void;
  onContactManagement?: () => void;
  onOpenVerification: () => void;
  authInfo?: AuthorizationInfo;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreVehicles,
  onContactManagement,
  onOpenVerification,
  authInfo,
}) => {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#FAFAFA] border-b border-neutral-200/60"
    >
      {/* Background Cinematic Vehicle Image with Soft Light Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=2000&q=85"
          alt="Tesla Flagship Electric Fleet"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-center opacity-10 scale-105 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        {/* Soft light gradients for pristine readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-[#FAFAFA]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Verified Representative Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200/90 shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="text-xs font-semibold text-neutral-800">
            Operating Under Verified Authorization
          </span>
          <button
            type="button"
            onClick={onOpenVerification}
            className="text-[11px] text-red-600 hover:text-red-700 underline font-mono ml-1 font-semibold"
          >
            Ref: {authInfo?.authorizationNumber || 'TM-AUTH-2026-GLOBAL-8941'}
          </button>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-900 font-sans max-w-4xl leading-[1.1] mb-6">
          Experience <span className="text-red-600">Tesla</span>
        </h1>

        {/* Subheadline matching exact requirement */}
        <p className="text-lg sm:text-xl md:text-2xl text-neutral-600 font-normal max-w-3xl mb-8 leading-relaxed">
          Explore Tesla vehicles, available configurations, pricing and authorized Tesla Management customer assistance.
        </p>

        {/* Dual Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-12">
          <button
            type="button"
            id="hero-explore-vehicles-btn"
            onClick={onExploreVehicles}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm sm:text-base tracking-wide transition-all duration-200 shadow-sm cursor-pointer flex items-center justify-center space-x-2 group active:scale-95"
          >
            <span>Explore Vehicles</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            id="hero-contact-management-btn"
            onClick={onContactManagement}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 font-semibold text-sm sm:text-base tracking-wide transition-all duration-200 shadow-xs cursor-pointer flex items-center justify-center space-x-2 active:scale-95"
          >
            <span>Contact Management</span>
          </button>
        </div>

        {/* Key Authorized Pillars / Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl w-full text-left">
          <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-xs">
            <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 mb-1">
              <CheckCircle2 className="w-4 h-4 text-red-600" />
              <span>Direct Vehicle Guidance</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Verified model specifications & available custom configurations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-xs">
            <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Special Promotional Pricing</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Authorized management allocation figures clearly distinguished.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-xs">
            <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 mb-1">
              <Globe2 className="w-4 h-4 text-blue-600" />
              <span>Worldwide Support</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Comprehensive international country & phone coordination.
            </p>
          </div>
        </div>

        {/* Transparency / Compliance Notice */}
        <div className="mt-8 text-[11px] text-neutral-500 max-w-2xl text-center leading-relaxed">
          <p>
            Operating strictly under verified authorization. This website presents authorized Tesla Management information and promotional allocation pricing. Official manufacturer data is distinguished from representative services.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="mt-8 cursor-pointer" onClick={onExploreVehicles}>
          <ChevronDown className="w-5 h-5 text-neutral-400 hover:text-neutral-600 transition-colors animate-bounce" />
        </div>
      </div>
    </section>
  );
};
