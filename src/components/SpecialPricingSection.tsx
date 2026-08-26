import React from 'react';
import { Tag, ArrowRight, Info } from 'lucide-react';
import { Vehicle } from '../types';

interface SpecialPricingSectionProps {
  vehicles: Vehicle[];
  isLoading?: boolean;
  onRequestVehicle: (vehicle: Vehicle) => void;
}

export const SpecialPricingSection: React.FC<SpecialPricingSectionProps> = ({
  vehicles,
  isLoading = false,
  onRequestVehicle,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section
      id="special-pricing"
      className="py-16 sm:py-20 bg-white text-neutral-900 border-t border-neutral-200"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-left mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-wider mb-2.5 font-mono">
            <Tag className="w-3.5 h-3.5 text-red-600" />
            <span>Management Pricing Matrix</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Special Promotional Pricing
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 mt-2 max-w-2xl leading-relaxed">
            Management Promotional Pricing available on selected vehicle allocations.
          </p>
        </div>

        {/* Pricing Matrix Cards / Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {[1, 2].map((idx) => (
              <div
                key={`promo-skel-${idx}`}
                className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs animate-pulse space-y-4"
              >
                <div className="flex justify-between">
                  <div className="h-3 bg-neutral-200 rounded w-1/4" />
                  <div className="h-4 bg-neutral-200 rounded w-16" />
                </div>
                <div className="h-6 bg-neutral-200 rounded w-1/2" />
                <div className="h-3 bg-neutral-100 rounded w-3/4" />
                <div className="h-20 bg-neutral-100 rounded-xl" />
                <div className="h-10 bg-neutral-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : vehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {vehicles.map((vehicle) => {
              const hasOriginalPrice = typeof vehicle.originalPrice === 'number' && vehicle.originalPrice > 0;
              return (
                <div
                  key={vehicle.id}
                  id={`pricing-card-${vehicle.id}`}
                  className="relative p-6 rounded-2xl bg-white hover:border-neutral-300 border border-neutral-200 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                        Tesla Model
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-neutral-700 font-mono font-semibold">
                        {vehicle.modelCode}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                      {vehicle.name}
                    </h3>

                    <p className="text-xs text-neutral-600 line-clamp-2 mb-6">
                      {vehicle.tagline}
                    </p>

                    {/* Exact Visual Pricing Structure */}
                    <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200 mb-6">
                      {hasOriginalPrice ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-500 font-medium">Original Price:</span>
                            <span className="text-neutral-400 line-through font-mono font-semibold">
                              /{formatCurrency(vehicle.originalPrice!)}/
                            </span>
                          </div>

                          <div className="pt-1.5 border-t border-neutral-200">
                            <span className="text-[11px] text-neutral-500 uppercase tracking-wider block font-semibold">
                              Management Promotional Price:
                            </span>
                            <div className="text-3xl font-extrabold text-neutral-900 font-mono mt-0.5">
                              {formatCurrency(vehicle.promotionalPrice)}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider block">
                            Management Promotional Price:
                          </span>
                          <div className="text-3xl font-extrabold text-neutral-900 font-mono mt-1">
                            {formatCurrency(vehicle.promotionalPrice)}
                          </div>
                        </div>
                      )}

                      <div className="mt-2 text-[10px] text-emerald-700 flex items-center space-x-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{vehicle.promotionalLabel || 'Management Promotional Price'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      id={`request-promo-${vehicle.id}`}
                      onClick={() => onRequestVehicle(vehicle)}
                      className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center space-x-2 shadow-xs active:scale-95"
                    >
                      <span>Request Allocation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <p className="text-[10px] text-neutral-400 text-center mt-2.5 font-mono">
                      {vehicle.availability} • Direct allocation inquiry
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-neutral-500 bg-white rounded-2xl border border-neutral-200 mb-12 max-w-xl mx-auto p-6">
            <Info className="w-8 h-8 mx-auto text-neutral-400 mb-2" />
            <p className="text-sm font-medium text-neutral-900">No promotional pricing entries are currently active.</p>
            <p className="text-xs text-neutral-500 mt-1">Check back later or contact management for direct inquiries.</p>
          </div>
        )}

        {/* Mandatory Final Pricing Notice */}
        <div className="max-w-4xl mx-auto p-5 rounded-2xl bg-[#F8F9FA] border border-neutral-200 text-neutral-600 text-xs sm:text-sm space-y-2 shadow-2xs">
          <div className="flex items-center space-x-2 font-bold text-neutral-900">
            <Info className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>Pricing Terms & Conditions</span>
          </div>
          <p className="text-neutral-600 leading-relaxed">
            &ldquo;Final pricing may vary according to configuration, location, applicable taxes, delivery charges, inventory, eligibility and current terms. Final pricing is confirmed during the purchasing process.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
};
