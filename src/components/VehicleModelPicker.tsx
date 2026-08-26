import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, Check, Car, Sparkles, Search, Layers, Zap } from 'lucide-react';
import { Vehicle, VehicleConfiguration } from '../types';
import { storageService } from '../services/storage';
import { INITIAL_VEHICLES } from '../data/vehicles';

// ==========================================
// 1. PREFERRED TESLA MODEL DROPDOWN COMPONENT
// ==========================================
export interface VehicleModelDropdownProps {
  id?: string;
  selectedModelName: string;
  onSelectModel: (vehicle: Vehicle) => void;
  vehicles?: Vehicle[];
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const VehicleModelDropdown: React.FC<VehicleModelDropdownProps> = ({
  id = 'preferred-tesla-model-select',
  selectedModelName,
  onSelectModel,
  vehicles: propVehicles,
  label = 'Preferred Tesla Model',
  required = true,
  disabled = false,
  error,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Authoritative fallback to storage service or initial dataset if prop is empty
  const availableVehicles = useMemo(() => {
    if (Array.isArray(propVehicles) && propVehicles.length > 0) {
      return propVehicles;
    }
    const storeVehicles = storageService.getVehicles();
    if (Array.isArray(storeVehicles) && storeVehicles.length > 0) {
      return storeVehicles;
    }
    return INITIAL_VEHICLES;
  }, [propVehicles]);

  // Currently selected vehicle object
  const currentVehicle = useMemo(() => {
    if (!selectedModelName) return availableVehicles[0] || null;
    return availableVehicles.find(
      (v) => v.name.toLowerCase() === selectedModelName.toLowerCase() || v.id === selectedModelName
    ) || availableVehicles[0] || null;
  }, [availableVehicles, selectedModelName]);

  // Filtered vehicles for search
  const filteredVehicles = useMemo(() => {
    if (!searchQuery.trim()) return availableVehicles;
    const query = searchQuery.toLowerCase().trim();
    return availableVehicles.filter(
      (v) =>
        v.name.toLowerCase().includes(query) ||
        v.tagline?.toLowerCase().includes(query) ||
        v.category?.toLowerCase().includes(query) ||
        v.availability?.toLowerCase().includes(query)
    );
  }, [availableVehicles, searchQuery]);

  // Close on outside click or touch
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
      // Auto-focus search field when opened if more than 4 vehicles
      if (availableVehicles.length > 4) {
        setTimeout(() => searchInputRef.current?.focus(), 60);
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, availableVehicles.length]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      if (!isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
    } else if (e.key === 'Escape') {
      if (isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    }
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    onSelectModel(vehicle);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5 flex items-center justify-between font-mono"
        >
          <span>
            {label} {required && <span className="text-red-600">*</span>}
          </span>
          <span className="text-[10px] text-neutral-500 font-mono font-normal">
            {availableVehicles.length} available
          </span>
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={`w-full min-h-[44px] px-3.5 py-2.5 bg-white border rounded-xl text-left flex items-center justify-between transition-all duration-150 cursor-pointer shadow-2xs select-none touch-manipulation ${
          disabled
            ? 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed opacity-75'
            : isOpen
            ? 'border-red-600 ring-1 ring-red-600 bg-white shadow-md'
            : error
            ? 'border-red-500 hover:border-red-500'
            : 'border-neutral-300 hover:border-neutral-400'
        }`}
      >
        <div className="flex items-center space-x-3 min-w-0 pr-2">
          {/* Vehicle Thumbnail / Icon */}
          <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
            {currentVehicle?.imageUrl ? (
              <img
                src={currentVehicle.imageUrl}
                alt={currentVehicle.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback to car icon if image fails
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <Car className="w-4 h-4 text-red-600" />
            )}
          </div>

          {/* Vehicle Label & Tag */}
          <div className="truncate">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-neutral-900 truncate font-sans">
                {currentVehicle ? currentVehicle.name : 'Select a Tesla Model'}
              </span>
              {currentVehicle?.availability && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200 shrink-0 hidden sm:inline-block font-mono">
                  {currentVehicle.availability}
                </span>
              )}
            </div>
            {currentVehicle?.tagline && (
              <p className="text-[11px] text-neutral-500 truncate leading-tight mt-0.5">
                {currentVehicle.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Animated Chevron */}
        <div className="pl-2 border-l border-neutral-200 flex-shrink-0">
          <ChevronDown
            className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-neutral-900' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div
          role="listbox"
          aria-labelledby={id}
          className="absolute z-[70] left-0 right-0 mt-1.5 bg-white border border-neutral-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-98 duration-150"
        >
          {/* Optional Search Filter for many vehicles */}
          {availableVehicles.length > 4 && (
            <div className="p-2 border-b border-neutral-200 bg-[#F8F9FA]">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter models (e.g. Model 3, Cybertruck)..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-red-600"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* List of Models */}
          <div className="max-h-64 overflow-y-auto py-1 divide-y divide-neutral-100">
            {filteredVehicles.length === 0 ? (
              <div className="p-4 text-center text-xs text-neutral-500">
                No matching Tesla models found
              </div>
            ) : (
              filteredVehicles.map((veh) => {
                const isSelected =
                  currentVehicle?.name?.toLowerCase() === veh.name.toLowerCase() ||
                  currentVehicle?.id === veh.id;

                return (
                  <div
                    key={veh.id || veh.name}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectVehicle(veh)}
                    className={`px-3 py-2.5 flex items-center justify-between cursor-pointer transition-colors duration-100 touch-manipulation select-none ${
                      isSelected
                        ? 'bg-neutral-100 text-neutral-900 font-semibold'
                        : 'hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-2">
                      {/* Vehicle Thumbnail */}
                      <div className="w-10 h-8 rounded-md bg-neutral-100 border border-neutral-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {veh.imageUrl ? (
                          <img
                            src={veh.imageUrl}
                            alt={veh.name}
                            className="w-full h-full object-cover object-center"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <Car className="w-3.5 h-3.5 text-neutral-400" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-neutral-900 truncate font-sans">
                            {veh.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600 border border-neutral-200 font-mono truncate">
                            {veh.availability || 'Available'}
                          </span>
                        </div>
                        <div className="text-[10.5px] text-neutral-500 truncate flex items-center space-x-2 mt-0.5 font-mono">
                          {veh.specs?.range && <span>{veh.specs.range}</span>}
                          {veh.promotionalPrice && (
                            <>
                              <span>•</span>
                              <span className="text-neutral-900 font-medium">
                                From ${veh.promotionalPrice.toLocaleString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                        <Check className="w-3 h-3" />
                      </div>
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

// ===============================================
// 2. DEPENDENT PREFERRED CONFIGURATION DROPDOWN
// ===============================================
export interface VehicleConfigDropdownProps {
  id?: string;
  selectedConfigName: string;
  onSelectConfig: (configName: string, configObj?: VehicleConfiguration) => void;
  configurations?: VehicleConfiguration[];
  vehicleName?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const VehicleConfigDropdown: React.FC<VehicleConfigDropdownProps> = ({
  id = 'preferred-tesla-config-select',
  selectedConfigName,
  onSelectConfig,
  configurations = [],
  vehicleName = 'Selected Model',
  label = 'Preferred Configuration',
  required = false,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasConfigs = Array.isArray(configurations) && configurations.length > 0;
  const isComponentDisabled = disabled || !hasConfigs;

  // Selected config object
  const currentConfig = useMemo(() => {
    if (!hasConfigs) return null;
    return configurations.find((c) => c.name === selectedConfigName) || configurations[0] || null;
  }, [configurations, selectedConfigName, hasConfigs]);

  // Close on outside click or touch
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectConfig = (config: VehicleConfiguration) => {
    onSelectConfig(config.name, config);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5 flex items-center justify-between font-mono"
        >
          <span>
            {label} {required && <span className="text-red-600">*</span>}
          </span>
          {hasConfigs && (
            <span className="text-[10px] text-neutral-500 font-mono font-normal">
              {configurations.length} trim{configurations.length > 1 ? 's' : ''}
            </span>
          )}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={isComponentDisabled}
        onClick={() => !isComponentDisabled && setIsOpen((prev) => !prev)}
        className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left flex items-center justify-between transition-all duration-150 shadow-2xs select-none touch-manipulation ${
          isComponentDisabled
            ? 'bg-neutral-100 border border-neutral-200 text-neutral-400 cursor-not-allowed'
            : isOpen
            ? 'bg-white border-red-600 ring-1 ring-red-600 shadow-md cursor-pointer'
            : 'bg-white border border-neutral-300 hover:border-neutral-400 cursor-pointer text-neutral-900'
        }`}
      >
        <div className="flex items-center space-x-2.5 min-w-0 pr-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isComponentDisabled
                ? 'bg-neutral-100 text-neutral-400'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
          </div>

          <div className="truncate">
            {!hasConfigs ? (
              <span className="text-xs text-neutral-400 font-medium">
                No configurations available for {vehicleName}
              </span>
            ) : (
              <div>
                <div className="text-xs font-bold text-neutral-900 truncate font-sans">
                  {currentConfig ? currentConfig.name : 'Select a configuration'}
                </div>
                {currentConfig && (
                  <div className="text-[11px] text-neutral-500 font-mono truncate">
                    {currentConfig.range && <span>{currentConfig.range}</span>}
                    {currentConfig.drivetrain && (
                      <span className="text-neutral-400"> • {currentConfig.drivetrain}</span>
                    )}
                    {currentConfig.acceleration && (
                      <span className="text-neutral-400"> • {currentConfig.acceleration}</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Animated Chevron */}
        <div className="pl-2 border-l border-neutral-200 flex-shrink-0">
          <ChevronDown
            className={`w-4 h-4 ${
              isComponentDisabled
                ? 'text-neutral-400'
                : isOpen
                ? 'rotate-180 text-neutral-900'
                : 'text-neutral-400'
            } transition-transform duration-200`}
          />
        </div>
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && hasConfigs && (
        <div
          role="listbox"
          aria-labelledby={id}
          className="absolute z-[70] left-0 right-0 mt-1.5 bg-white border border-neutral-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-98 duration-150"
        >
          <div className="p-2 border-b border-neutral-200 bg-[#F8F9FA] flex items-center justify-between">
            <span className="text-[10.5px] uppercase font-mono font-bold text-neutral-700">
              {vehicleName} Configurations
            </span>
            <span className="text-[10.5px] text-neutral-500 font-mono">
              Select desired powertrain
            </span>
          </div>

          <div className="max-h-60 overflow-y-auto py-1 divide-y divide-neutral-100">
            {configurations.map((cfg) => {
              const isSelected = currentConfig?.name === cfg.name || currentConfig?.id === cfg.id;

              return (
                <div
                  key={cfg.id || cfg.name}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectConfig(cfg)}
                  className={`px-3.5 py-2.5 flex items-center justify-between cursor-pointer transition-colors duration-100 touch-manipulation select-none ${
                    isSelected
                      ? 'bg-neutral-100 text-neutral-900 font-semibold'
                      : 'hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-neutral-900 truncate font-sans">
                        {cfg.name}
                      </span>
                      {cfg.basePrice && (
                        <span className="text-[10px] font-mono text-emerald-700 font-bold px-1.5 py-0.2 rounded bg-emerald-50 border border-emerald-200">
                          ${cfg.basePrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-neutral-500 font-mono mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5">
                      {cfg.range && (
                        <span className="flex items-center text-neutral-900 font-medium">
                          <Zap className="w-2.5 h-2.5 text-amber-500 mr-0.5" />
                          {cfg.range}
                        </span>
                      )}
                      {cfg.drivetrain && <span>{cfg.drivetrain}</span>}
                      {cfg.acceleration && <span>({cfg.acceleration})</span>}
                      {cfg.topSpeed && <span>• {cfg.topSpeed}</span>}
                    </div>
                  </div>

                  {/* Checkmark */}
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                      <Check className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="w-4 h-4" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
