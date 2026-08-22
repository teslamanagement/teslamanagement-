import React, { useState, useMemo } from 'react';
import { Sparkles, Eye, ArrowUpRight, Gauge, BatteryCharging, Zap, Info, Shield, RefreshCw } from 'lucide-react';
import { Vehicle } from '../types';

interface VehicleCatalogProps {
  vehicles: Vehicle[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onRequestVehicle: (vehicle: Vehicle) => void;
}

export const VehicleCatalog: React.FC<VehicleCatalogProps> = ({
  vehicles,
  isLoading = false,
  onRefresh,
  onSelectVehicle,
  onRequestVehicle,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Models' },
    { id: 'sedan', label: 'Sedans (Model 3, S)' },
    { id: 'suv', label: 'SUVs (Model Y, Y L, X)' },
    { id: 'truck', label: 'Cybertruck' },
    { id: 'specialty', label: 'Specialty (Roadster, Cybercab)' },
    { id: 'commercial', label: 'Commercial (Tesla Semi)' },
  ];

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchCat = selectedCategory === 'all' || v.category === selectedCategory;
      const matchSearch =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [vehicles, selectedCategory, searchQuery]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getAvailabilityBadge = (status: Vehicle['availability']) => {
    switch (status) {
      case 'Available for Order':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Limited Allocation':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Reservation Inquiry':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Production Preview':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  return (
    <section id="vehicles" className="py-20 bg-[#F8F9FA] text-neutral-900 border-t border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center space-x-2 text-red-600 text-xs font-bold uppercase tracking-widest mb-2 font-mono">
              <Shield className="w-4 h-4" />
              <span>Verified Catalog</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 font-sans">
              Tesla Vehicle Lineup
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-2 max-w-2xl leading-relaxed">
              Explore officially published specifications, verified capabilities, and authorized management allocation pricing across all Tesla model lines.
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full md:w-72">
            <input
              type="text"
              id="vehicle-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search model, specs..."
              className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors shadow-xs"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`cat-filter-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 border border-neutral-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Vehicle Grid / Loading State / Empty State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={`skeleton-${idx}`}
                className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-xs animate-pulse flex flex-col"
              >
                <div className="aspect-[16/10] bg-neutral-200" />
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-neutral-200 rounded-md w-3/4" />
                    <div className="h-3 bg-neutral-100 rounded-md w-full" />
                    <div className="h-3 bg-neutral-100 rounded-md w-5/6" />
                  </div>
                  <div className="pt-3 border-t border-neutral-100 space-y-2">
                    <div className="h-6 bg-neutral-200 rounded-md w-1/2" />
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="h-9 bg-neutral-200 rounded-xl" />
                      <div className="h-9 bg-neutral-200 rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                id={`vehicle-card-${vehicle.id}`}
                className="group flex flex-col bg-white hover:bg-white border border-neutral-200/90 hover:border-neutral-300 rounded-2xl overflow-hidden transition-all duration-300 shadow-xs hover:shadow-md"
              >
                {/* Image Container with Availability Badge */}
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                  <img
                    src={vehicle.imageUrl}
                    alt={`${vehicle.name} exterior`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                  {/* Availability & Photo count Badge */}
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide border shadow-xs ${getAvailabilityBadge(
                        vehicle.availability
                      )}`}
                    >
                      {vehicle.availability}
                    </span>
                    {vehicle.galleryImages && vehicle.galleryImages.length > 1 && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-xs">
                        {vehicle.galleryImages.length} Photos
                      </span>
                    )}
                  </div>

                  {/* Model Tag */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-200 block">
                        Tesla
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-xs">
                        {vehicle.name}
                      </h3>
                    </div>
                    <span className="text-xs font-medium text-white bg-black/50 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/20">
                      {vehicle.specs.acceleration}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-neutral-600 line-clamp-2 mb-3 leading-relaxed">
                      {vehicle.description}
                    </p>

                    {/* Color Swatches Mini Bar */}
                    {vehicle.colors && vehicle.colors.length > 0 && (
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
                        <span className="text-[11px] font-mono uppercase text-neutral-500 font-semibold">
                          {vehicle.colors.length} Color{vehicle.colors.length > 1 ? 's' : ''}
                        </span>
                        <div className="flex items-center space-x-1">
                          {vehicle.colors.slice(0, 6).map((c) => (
                            <span
                              key={c.id}
                              title={c.name}
                              className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs transition-transform hover:scale-125"
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                          {vehicle.colors.length > 6 && (
                            <span className="text-[10px] text-neutral-400 font-mono pl-0.5">
                              +{vehicle.colors.length - 6}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Spec Highlights Mini Grid */}
                    <div className="grid grid-cols-2 gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200/70 mb-5">
                      <div className="flex items-center space-x-2">
                        <BatteryCharging className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                        <div className="truncate">
                          <span className="text-[10px] text-neutral-400 uppercase block font-mono">Range</span>
                          <span className="text-xs font-semibold text-neutral-800 truncate block">
                            {vehicle.specs.range.split(' ')[0]} mi
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Gauge className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                        <div className="truncate">
                          <span className="text-[10px] text-neutral-400 uppercase block font-mono">Top Speed</span>
                          <span className="text-xs font-semibold text-neutral-800 truncate block">
                            {vehicle.specs.topSpeed}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Box adhering to Section 5 requirements */}
                  <div className="pt-3 border-t border-neutral-100">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-[11px] text-neutral-500 font-medium">
                        {vehicle.promotionalLabel || 'Management Promotional Price'}
                      </span>
                      {vehicle.originalPrice && (
                        <span className="text-xs text-neutral-400 line-through font-mono">
                          /{formatCurrency(vehicle.originalPrice)}/
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline space-x-2 mb-4">
                      <span className="text-2xl font-extrabold text-neutral-900 font-mono tracking-tight">
                        {formatCurrency(vehicle.promotionalPrice)}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-medium px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                        Authorized
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        id={`btn-view-${vehicle.id}`}
                        onClick={() => onSelectVehicle(vehicle)}
                        className="py-2.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-neutral-600" />
                        <span>View Vehicle</span>
                      </button>

                      <button
                        type="button"
                        id={`btn-request-${vehicle.id}`}
                        onClick={() => onRequestVehicle(vehicle)}
                        className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center space-x-1 shadow-xs active:scale-95"
                      >
                        <span>Request</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="py-16 text-center text-neutral-500 bg-white rounded-2xl border border-neutral-200 shadow-xs max-w-2xl mx-auto p-8">
            <Info className="w-10 h-10 mx-auto text-neutral-400 mb-3" />
            <p className="text-base font-medium text-neutral-800">No vehicles are currently listed in the catalog.</p>
            <p className="text-xs text-neutral-500 mt-1">
              Authorized administrators can configure and publish vehicles from the Management Dashboard.
            </p>
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="mt-4 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl inline-flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Catalog</span>
              </button>
            )}
          </div>
        ) : (
          <div className="py-16 text-center text-neutral-500 bg-white rounded-2xl border border-neutral-200 shadow-xs">
            <Info className="w-10 h-10 mx-auto text-neutral-400 mb-3" />
            <p className="text-base font-medium text-neutral-800">No vehicles match your search or selected filter.</p>
            <p className="text-xs text-neutral-500 mt-1">Try resetting the category filter or searching by model name.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl inline-flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <span>Reset Filters</span>
            </button>
          </div>
        )}

        {/* Pricing disclaimer in catalog */}
        <div className="mt-10 p-4 rounded-xl bg-white border border-neutral-200 text-[11px] text-neutral-600 leading-relaxed shadow-xs">
          <span className="font-semibold text-neutral-900">Important Pricing Note:</span> Final pricing may vary according to configuration, location, applicable taxes, delivery charges, inventory, eligibility and current terms. Final pricing is confirmed during the authorized purchasing process.
        </div>
      </div>
    </section>
  );
};
