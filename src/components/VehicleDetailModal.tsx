import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CheckCircle2,
  Shield,
  BatteryCharging,
  Gauge,
  Zap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Palette,
} from 'lucide-react';
import { Vehicle } from '../types';
import { resolveAssetUrl } from '../utils/resolveAsset';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onRequestVehicle: (vehicle: Vehicle, configurationName?: string, colorName?: string) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose,
  onRequestVehicle,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedConfigId, setSelectedConfigId] = useState<string>('');
  const [selectedColorId, setSelectedColorId] = useState<string>('');

  // Touch Swipe coordinates
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  // Initialize selected config and color when vehicle changes
  useEffect(() => {
    if (vehicle) {
      if (vehicle.configurations && vehicle.configurations.length > 0) {
        setSelectedConfigId(vehicle.configurations[0].id);
      } else {
        setSelectedConfigId('');
      }

      if (vehicle.colors && vehicle.colors.length > 0) {
        setSelectedColorId(vehicle.colors[0].id);
      } else {
        setSelectedColorId('');
      }

      setActiveImageIndex(0);
    }
  }, [vehicle]);

  if (!vehicle) return null;

  const currentConfig =
    (vehicle.configurations || []).find((c) => c?.id === selectedConfigId) ||
    (vehicle.configurations || [])[0];

  const currentColor =
    (vehicle.colors || []).find((c) => c?.id === selectedColorId) ||
    (vehicle.colors || [])[0];

  let currentImages: string[] = [];
  if (Array.isArray(vehicle.galleryImages) && vehicle.galleryImages.length > 0) {
    currentImages = vehicle.galleryImages.filter((img) => typeof img === 'string' && img.trim());
  } else if (vehicle.imageUrl) {
    currentImages = [vehicle.imageUrl];
  } else if (currentColor && currentColor.images && currentColor.images.length > 0) {
    currentImages = currentColor.images.filter((img) => typeof img === 'string' && img.trim());
  }

  const safeImageIndex = Math.min(activeImageIndex, Math.max(0, currentImages.length - 1));

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleNextImage = () => {
    if (currentImages.length <= 1) return;
    setActiveImageIndex((prev) => (prev + 1) % currentImages.length);
  };

  const handlePrevImage = () => {
    if (currentImages.length <= 1) return;
    setActiveImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
    touchEndXRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;

    if (isLeftSwipe) {
      handleNextImage();
    } else if (isRightSwipe) {
      handlePrevImage();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const handleSelectColor = (colorId: string) => {
    setSelectedColorId(colorId);
    setActiveImageIndex(0);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        id="vehicle-detail-dialog"
        className="relative w-full max-w-5xl bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden text-neutral-900 max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-[#F8F9FA] sticky top-0 z-20">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-xs" />
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 font-semibold">
                Vehicle Configurator & Overview
              </span>
              <h3 className="text-xl font-bold text-neutral-900 font-sans">
                Tesla {vehicle.name}
              </h3>
            </div>
          </div>

          <button
            type="button"
            id="close-vehicle-detail-btn"
            onClick={onClose}
            className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 border border-neutral-200 transition-colors cursor-pointer"
            aria-label="Close vehicle details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 flex-1">
          {/* Main Gallery & Overview Top Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Image Gallery Column */}
            <div className="col-span-1 lg:col-span-7 space-y-3">
              <div
                className="relative aspect-[16/10] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 select-none group touch-pan-y shadow-2xs"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  id={`detail-img-${vehicle.id}-${safeImageIndex}`}
                  src={resolveAssetUrl(currentImages[safeImageIndex] || vehicle.imageUrl)}
                  alt={`${vehicle.name} - ${currentColor?.name || 'View'} ${safeImageIndex + 1}`}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-all duration-300 block"
                  referrerPolicy="no-referrer"
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.log(`[Modal Image Loaded] Successfully loaded ${vehicle.name} image:`, target.currentSrc || target.src);
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.error(`[Modal Image Error] Failed to load modal image for ${vehicle.name}:`, target.src);
                    const fallback = resolveAssetUrl(vehicle.imageUrl || vehicle.galleryImages?.[0] || '');
                    if (fallback && target.src !== fallback) {
                      target.src = fallback;
                    }
                  }}
                />

                {/* Top Status & Color Badge */}
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-black/70 backdrop-blur-xs text-white border border-white/20 shadow-xs">
                    {vehicle.availability}
                  </span>
                  {currentColor && (
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-black/70 backdrop-blur-xs text-white border border-white/20 shadow-xs flex items-center space-x-1.5 font-mono">
                      <span
                        className="w-3 h-3 rounded-full border border-white/40 shadow-xs"
                        style={{ backgroundColor: currentColor.hex }}
                      />
                      <span>{currentColor.name}</span>
                    </span>
                  )}
                </div>

                {/* Left / Right Carousel Controls */}
                {currentImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-xs transition-all cursor-pointer shadow-md opacity-0 group-hover:opacity-100 border border-white/10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-xs transition-all cursor-pointer shadow-md opacity-0 group-hover:opacity-100 border border-white/10"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Navigation Dots Indicator */}
                {currentImages.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs border border-white/10">
                    {currentImages.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          safeImageIndex === idx
                            ? 'bg-white w-5'
                            : 'bg-white/40 hover:bg-white/80 w-1.5'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnails Strip */}
              {currentImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
                  {currentImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                        safeImageIndex === idx
                          ? 'border-neutral-900 scale-105 shadow-xs'
                          : 'border-neutral-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={resolveAssetUrl(img)}
                        alt={`thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Exterior Colors Selector */}
              {vehicle.colors && vehicle.colors.length > 0 && (
                <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 uppercase tracking-wider font-mono">
                      <Palette className="w-3.5 h-3.5 text-red-600" />
                      <span>Select Exterior Paint</span>
                    </div>
                    {currentColor && (
                      <span className="text-xs font-semibold text-neutral-600">
                        {currentColor.name}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {vehicle.colors.map((c) => {
                      const isSelected = selectedColorId === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          id={`color-swatch-${c.id}`}
                          onClick={() => handleSelectColor(c.id)}
                          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'bg-white border-neutral-900 shadow-xs text-neutral-900 ring-1 ring-neutral-900'
                              : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-600 hover:text-neutral-900'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-neutral-300 shadow-2xs flex-shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-xs font-medium">
                            {c.name}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 ml-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Specs & Direct Pricing Card */}
            <div className="col-span-1 lg:col-span-5 flex flex-col justify-between bg-[#F8F9FA] p-5 rounded-2xl border border-neutral-200">
              <div>
                <div className="text-xs text-red-600 font-bold uppercase tracking-wider mb-1 font-mono">
                  {vehicle.tagline}
                </div>
                <h4 className="text-2xl font-extrabold text-neutral-900 mb-2">
                  {vehicle.name}
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  {vehicle.description}
                </p>

                {/* Key Spec Grid */}
                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-white border border-neutral-200 mb-4 shadow-2xs">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block font-mono font-semibold">Range</span>
                    <span className="text-sm font-bold text-neutral-900 font-mono">{vehicle.specs.range}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block font-mono font-semibold">Acceleration</span>
                    <span className="text-sm font-bold text-neutral-900 font-mono">{vehicle.specs.acceleration}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block font-mono font-semibold">Top Speed</span>
                    <span className="text-sm font-bold text-neutral-900 font-mono">{vehicle.specs.topSpeed}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block font-mono font-semibold">Drivetrain</span>
                    <span className="text-sm font-bold text-neutral-900 truncate block font-mono">{vehicle.specs.drivetrain}</span>
                  </div>
                </div>
              </div>

              {/* Pricing Box */}
              <div className="pt-4 border-t border-neutral-200">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs text-neutral-500 font-medium">
                    {vehicle.promotionalLabel || 'Management Promotional Price'}
                  </span>
                  {vehicle.originalPrice && (
                    <span className="text-xs text-neutral-400 line-through font-mono">
                      {formatCurrency(vehicle.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline space-x-2 mb-4">
                  <span className="text-3xl font-extrabold text-neutral-900 font-mono">
                    {formatCurrency(vehicle.promotionalPrice)}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                    Authorized Price
                  </span>
                </div>

                <button
                  type="button"
                  id="detail-request-vehicle-btn"
                  onClick={() => {
                    onClose();
                    onRequestVehicle(vehicle, currentConfig?.name, currentColor?.name);
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer shadow-xs flex items-center justify-center space-x-2 active:scale-95"
                >
                  <span>Request Allocation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Available Configurations Section */}
          {vehicle.configurations && vehicle.configurations.length > 0 && (
            <div>
              <h5 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-3 flex items-center space-x-2 font-mono">
                <Zap className="w-4 h-4 text-red-600" />
                <span>Available Verified Configurations</span>
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {vehicle.configurations.map((config) => {
                  const isSelected = currentConfig?.id === config.id;
                  return (
                    <div
                      key={config.id}
                      onClick={() => setSelectedConfigId(config.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#F8F9FA] border-neutral-900 ring-1 ring-neutral-900 shadow-2xs text-neutral-900'
                          : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-neutral-900">{config.name}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-neutral-900" />}
                      </div>
                      <div className="space-y-1 text-xs text-neutral-600">
                        <div className="flex justify-between">
                          <span>Range:</span>
                          <span className="font-semibold text-neutral-900 font-mono">{config.range}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>0-60 mph:</span>
                          <span className="font-semibold text-neutral-900 font-mono">{config.acceleration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Drivetrain:</span>
                          <span className="font-semibold text-neutral-900 font-mono">{config.drivetrain}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4 Feature Columns (Performance, Charging, Interior, Safety) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {/* Performance */}
            <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200">
              <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2.5 font-mono">
                <Gauge className="w-4 h-4 text-red-600" />
                <span>Performance</span>
              </div>
              <ul className="space-y-1.5 text-xs text-neutral-600">
                {vehicle.performanceHighlights.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-red-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Charging & Range */}
            <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200">
              <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2.5 font-mono">
                <BatteryCharging className="w-4 h-4 text-emerald-600" />
                <span>Charging & Range</span>
              </div>
              <ul className="space-y-1.5 text-xs text-neutral-600">
                <li className="flex items-start space-x-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{vehicle.specs.chargingRate || 'Supercharging compatible'}</span>
                </li>
                {vehicle.chargingHighlights.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interior & Tech */}
            <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200">
              <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2.5 font-mono">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Interior & Tech</span>
              </div>
              <ul className="space-y-1.5 text-xs text-neutral-600">
                <li className="flex items-start space-x-1.5">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Seating for {vehicle.specs.seating}</span>
                </li>
                {vehicle.interiorHighlights.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety */}
            <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200">
              <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2.5 font-mono">
                <Shield className="w-4 h-4 text-purple-600" />
                <span>Safety & Structure</span>
              </div>
              <ul className="space-y-1.5 text-xs text-neutral-600">
                {vehicle.safetyHighlights.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pricing Policy and Terms Notice */}
          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200 text-xs text-neutral-600 space-y-1.5">
            <p className="font-bold text-neutral-900">
              Management Pricing Terms:
            </p>
            <p>
              {vehicle.pricingNotes ||
                'Final pricing may vary according to configuration, location, applicable taxes, delivery charges, inventory, eligibility and current terms.'}
            </p>
            <p className="text-[11px] text-neutral-500 font-mono">
              Effective: {vehicle.effectiveDate || '2026-08-01'} | Expiration:{' '}
              {vehicle.expirationDate || '2026-12-31'} | Allocation Code: {vehicle.modelCode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
