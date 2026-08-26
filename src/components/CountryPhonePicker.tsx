import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, Search, Check, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CountryData } from '../types';
import { searchCountries, WORLDWIDE_COUNTRIES } from '../data/countries';
import { validateAndNormalizePhone } from '../utils/phoneValidator';

const DEFAULT_COUNTRY: CountryData = {
  name: 'United States',
  isoCode: 'US',
  dialCode: '+1',
  flag: '🇺🇸',
  minLength: 10,
  maxLength: 10,
};

export interface CountryPhoneValue {
  countryName: string;
  countryIsoCode: string;
  countryDialingCode: string;
  phoneNumber: string;
  normalizedPhoneNumber: string;
  isValid: boolean;
}

interface CountryPhonePickerProps {
  idPrefix?: string;
  value: CountryPhoneValue;
  onChange: (val: CountryPhoneValue) => void;
  countriesList: CountryData[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const CountryPhonePicker: React.FC<CountryPhonePickerProps> = ({
  idPrefix = 'cp',
  value,
  onChange,
  countriesList,
  required = true,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Safe list of countries
  const effectiveCountries = useMemo(() => {
    return Array.isArray(countriesList) && countriesList.length > 0
      ? countriesList
      : WORLDWIDE_COUNTRIES;
  }, [countriesList]);

  // Selected country object
  const selectedCountry = useMemo<CountryData>(() => {
    const iso = value?.countryIsoCode?.toUpperCase();
    return (
      (iso ? effectiveCountries.find(c => c?.isoCode?.toUpperCase() === iso) : undefined) ||
      effectiveCountries.find(c => c?.isoCode === 'US') ||
      effectiveCountries[0] ||
      DEFAULT_COUNTRY
    );
  }, [value?.countryIsoCode, effectiveCountries]);

  // Filtered countries
  const filteredCountries = useMemo(() => {
    return searchCountries(searchQuery, effectiveCountries);
  }, [searchQuery, effectiveCountries]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Auto-focus search input when opened
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // When country is chosen
  const handleSelectCountry = (country: CountryData) => {
    setIsOpen(false);
    setSearchQuery('');

    const safeCountry = country || selectedCountry || DEFAULT_COUNTRY;
    // Re-validate phone with new country
    const validation = validateAndNormalizePhone(value?.phoneNumber || '', safeCountry);

    onChange({
      countryName: safeCountry.name,
      countryIsoCode: safeCountry.isoCode,
      countryDialingCode: safeCountry.dialCode,
      phoneNumber: value?.phoneNumber || '',
      normalizedPhoneNumber: validation.normalizedE164,
      isValid: validation.isValid,
    });
  };

  // When phone input changes
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;
    setIsTouched(true);

    const validation = validateAndNormalizePhone(rawInput, selectedCountry);

    onChange({
      countryName: selectedCountry?.name || 'United States',
      countryIsoCode: selectedCountry?.isoCode || 'US',
      countryDialingCode: selectedCountry?.dialCode || '+1',
      phoneNumber: rawInput,
      normalizedPhoneNumber: validation.normalizedE164,
      isValid: validation.isValid,
    });
  };

  const validationResult = useMemo(() => {
    return validateAndNormalizePhone(value?.phoneNumber || '', selectedCountry);
  }, [value?.phoneNumber, selectedCountry]);

  return (
    <div className={`space-y-3 ${className}`} id={`${idPrefix}-container`}>
      {/* Country Selection Field */}
      <div>
        <label
          htmlFor={`${idPrefix}-country-trigger`}
          className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5 font-mono"
        >
          Country / Territory <span className="text-red-600">*</span>
        </label>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            id={`${idPrefix}-country-trigger`}
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-neutral-300 hover:border-neutral-400 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-xl text-left transition-all duration-200 text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            <div className="flex items-center space-x-2.5 truncate">
              <span className="text-xl leading-none flex-shrink-0" role="img" aria-label={selectedCountry.name}>
                {selectedCountry.flag}
              </span>
              <span className="font-medium text-sm text-neutral-900 truncate">
                {selectedCountry.name}
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 font-mono border border-neutral-200">
                {selectedCountry.isoCode}
              </span>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0 pl-2">
              <span className="text-xs font-semibold text-neutral-500 font-mono">
                {selectedCountry.dialCode}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-neutral-900' : ''
                }`}
              />
            </div>
          </button>

          {/* Searchable Dropdown Modal/Menu */}
          {isOpen && (
            <div
              id={`${idPrefix}-country-dropdown`}
              className="absolute z-50 mt-1.5 w-full bg-white border border-neutral-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
              style={{ maxHeight: '340px' }}
            >
              {/* Search Bar */}
              <div className="p-2.5 bg-[#F8F9FA] border-b border-neutral-200 sticky top-0 z-10">
                <div className="relative">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    id={`${idPrefix}-country-search`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search country (e.g. Nigeria, United, 234, NG)..."
                    className="w-full pl-9 pr-8 py-2 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-neutral-900 px-1 py-0.5 rounded cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between mt-1.5 px-1 text-[11px] text-neutral-500 font-mono">
                  <span>Showing {filteredCountries.length} countries</span>
                  <span>Alphabetical A–Z Standard</span>
                </div>
              </div>

              {/* Country List */}
              <div
                className="overflow-y-auto divide-y divide-neutral-100"
                style={{ maxHeight: '250px' }}
                role="listbox"
              >
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => {
                    const isSelected = country.isoCode === selectedCountry.isoCode;
                    return (
                      <button
                        key={country.isoCode}
                        type="button"
                        id={`${idPrefix}-country-opt-${country.isoCode}`}
                        onClick={() => handleSelectCountry(country)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-sm transition-colors cursor-pointer hover:bg-neutral-50 ${
                          isSelected ? 'bg-neutral-100 text-neutral-900 font-semibold' : 'text-neutral-700'
                        }`}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <div className="flex items-center space-x-3 truncate">
                          <span className="text-xl flex-shrink-0" role="img">
                            {country.flag}
                          </span>
                          <span className="truncate text-neutral-900">{country.name}</span>
                          <span className="text-[11px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 font-mono border border-neutral-200">
                            {country.isoCode}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                          <span className="text-xs font-mono text-neutral-400">
                            {country.dialCode}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-red-600" />}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="py-8 px-4 text-center text-neutral-500 text-sm">
                    <Globe className="w-8 h-8 mx-auto text-neutral-400 mb-2" />
                    <p>No countries match &quot;{searchQuery}&quot;</p>
                    <p className="text-xs text-neutral-400 mt-1">Try searching by dialing code (e.g. +234) or ISO code.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Phone Number Field with Auto Dial Code */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor={`${idPrefix}-phone-input`}
            className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 font-mono"
          >
            Phone Number <span className="text-red-600">*</span>
          </label>
          <span className="text-[11px] text-neutral-400 font-mono">
            E.164 International Format
          </span>
        </div>

        <div className="relative flex rounded-xl shadow-2xs">
          {/* Static Dial Code Prefix Box */}
          <div className="flex items-center justify-center px-3.5 bg-neutral-100 border border-r-0 border-neutral-300 rounded-l-xl text-neutral-900 text-sm font-semibold font-mono select-none flex-shrink-0">
            <span className="mr-1.5">{selectedCountry.flag}</span>
            <span>{selectedCountry.dialCode}</span>
          </div>

          {/* Local Phone Number Input */}
          <input
            type="tel"
            id={`${idPrefix}-phone-input`}
            value={value.phoneNumber}
            onChange={handlePhoneChange}
            onBlur={() => setIsTouched(true)}
            placeholder="Local phone number..."
            disabled={disabled}
            required={required}
            className={`w-full px-3.5 py-2.5 bg-white border rounded-r-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none transition-colors font-mono ${
              isTouched && value.phoneNumber && !validationResult.isValid
                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : isTouched && value.phoneNumber && validationResult.isValid
                ? 'border-emerald-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                : 'border-neutral-300 hover:border-neutral-400 focus:border-red-600 focus:ring-1 focus:ring-red-600'
            }`}
          />
        </div>

        {/* Real-Time Validation Feedback */}
        <div className="mt-1.5 min-h-[18px]">
          {isTouched && value.phoneNumber && !validationResult.isValid ? (
            <p className="flex items-center text-xs text-red-600 space-x-1.5" id={`${idPrefix}-phone-error`}>
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{validationResult.errorMessage}</span>
            </p>
          ) : isTouched && value.phoneNumber && validationResult.isValid ? (
            <p className="flex items-center text-xs text-emerald-600 space-x-1.5" id={`${idPrefix}-phone-success`}>
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Valid global number: {validationResult.normalizedE164}</span>
            </p>
          ) : (
            <p className="text-[11px] text-neutral-500">
              Selected: {selectedCountry.name} ({selectedCountry.dialCode}). Type your local subscriber number.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
