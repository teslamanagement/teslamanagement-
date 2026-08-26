import React, { useState, useEffect, useMemo } from 'react';
import { X, CheckCircle2, ShieldCheck, AlertCircle, Send, Car, Loader2, RotateCcw, FileText, Check } from 'lucide-react';
import { CountryData, CustomerInquiry, Vehicle } from '../types';
import { CountryPhonePicker, CountryPhoneValue } from './CountryPhonePicker';
import { VehicleModelDropdown, VehicleConfigDropdown } from './VehicleModelPicker';
import { storageService } from '../services/storage';
import { INITIAL_VEHICLES } from '../data/vehicles';

interface PurchaseRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferredVehicle?: Vehicle | null;
  preferredConfigName?: string;
  preferredColorName?: string;
  vehicles: Vehicle[];
  countriesList: CountryData[];
  onInquirySubmitted?: (inquiry: CustomerInquiry) => void;
}

interface SubmittedDetails {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  countryName: string;
  model: string;
  configuration?: string;
  color?: string;
  purchaseMethod: string;
  submittedAt: string;
}

export const PurchaseRequestModal: React.FC<PurchaseRequestModalProps> = ({
  isOpen,
  onClose,
  preferredVehicle,
  preferredConfigName,
  preferredColorName,
  vehicles: propVehicles,
  countriesList,
  onInquirySubmitted,
}) => {
  // Authoritative vehicle list fallback
  const vehicles = useMemo(() => {
    if (Array.isArray(propVehicles) && propVehicles.length > 0) {
      return propVehicles;
    }
    const stored = storageService.getVehicles();
    if (Array.isArray(stored) && stored.length > 0) {
      return stored;
    }
    return INITIAL_VEHICLES;
  }, [propVehicles]);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [stateOrRegion, setStateOrRegion] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedConfig, setSelectedConfig] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [purchaseMethod, setPurchaseMethod] = useState<'Cash' | 'Financing' | 'Other'>('Cash');
  const [message, setMessage] = useState('');
  const [agreeConsent, setAgreeConsent] = useState(false);

  // Country and phone state
  const [phoneState, setPhoneState] = useState<CountryPhoneValue>({
    countryName: 'United States',
    countryIsoCode: 'US',
    countryDialingCode: '+1',
    phoneNumber: '',
    normalizedPhoneNumber: '',
    isValid: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedDetails, setSubmittedDetails] = useState<SubmittedDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Pre-fill model, config, and color only when modal opens or explicitly changed by caller
  useEffect(() => {
    if (!isOpen) return;

    if (preferredVehicle) {
      setSelectedModel(preferredVehicle.name || '');
      if (preferredConfigName) {
        setSelectedConfig(preferredConfigName);
      } else if (preferredVehicle.configurations && preferredVehicle.configurations.length > 0) {
        setSelectedConfig(preferredVehicle.configurations[0]?.name || '');
      } else {
        setSelectedConfig('');
      }

      if (preferredColorName) {
        setSelectedColor(preferredColorName);
      } else if (preferredVehicle.colors && preferredVehicle.colors.length > 0) {
        setSelectedColor(preferredVehicle.colors[0].name);
      } else {
        setSelectedColor('');
      }
    } else if (vehicles.length > 0 && !selectedModel) {
      const firstVeh = vehicles[0];
      setSelectedModel(firstVeh.name);
      if (firstVeh.configurations && firstVeh.configurations.length > 0) {
        setSelectedConfig(firstVeh.configurations[0]?.name || '');
      } else {
        setSelectedConfig('');
      }
      if (firstVeh.colors && firstVeh.colors.length > 0) {
        setSelectedColor(firstVeh.colors[0].name);
      } else {
        setSelectedColor('');
      }
    }
  }, [isOpen, preferredVehicle, preferredConfigName, preferredColorName, vehicles]);

  // Find currently active vehicle object
  const currentVehicleObj = useMemo(() => {
    if (!selectedModel) return vehicles[0] || null;
    return vehicles.find(
      (v) => v.name.toLowerCase() === selectedModel.toLowerCase() || v.id === selectedModel
    ) || vehicles[0] || null;
  }, [vehicles, selectedModel]);

  // Handler for model selection change: cascades to configuration and color
  const handleModelSelect = (veh: Vehicle) => {
    setSelectedModel(veh.name);
    // Reset and select first available configuration
    if (veh.configurations && veh.configurations.length > 0) {
      setSelectedConfig(veh.configurations[0].name);
    } else {
      setSelectedConfig('');
    }
    // Reset and select first available color
    if (veh.colors && veh.colors.length > 0) {
      setSelectedColor(veh.colors[0].name);
    } else {
      setSelectedColor('');
    }
  };

  const handleConfigSelect = (configName: string) => {
    setSelectedConfig(configName);
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setStateOrRegion('');
    setMessage('');
    setSelectedColor('');
    setPhoneState((prev) => ({ ...prev, phoneNumber: '', normalizedPhoneNumber: '', isValid: false }));
    setAgreeConsent(false);
    setIsSubmitted(false);
    setSubmittedDetails(null);
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // 1. Validate Full Name
    const trimmedName = fullName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }

    // 2. Validate Email Address
    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    // 3. Validate Contact Phone Number & Country
    if (!phoneState.phoneNumber.trim()) {
      setErrorMessage('Please provide your contact telephone number.');
      return;
    }
    if (!phoneState.isValid) {
      setErrorMessage(`Please enter a valid phone number for ${phoneState.countryName}.`);
      return;
    }

    // 4. Validate Selected Tesla Model
    if (!selectedModel || !selectedModel.trim()) {
      setErrorMessage('Please select your preferred Tesla model.');
      return;
    }

    // 5. Validate Configuration belongs to selected Model
    let finalConfig = selectedConfig.trim();
    if (currentVehicleObj && currentVehicleObj.configurations && currentVehicleObj.configurations.length > 0) {
      const validConfigExists = currentVehicleObj.configurations.some(
        (c) => c.name.toLowerCase() === finalConfig.toLowerCase()
      );
      if (!validConfigExists) {
        // Automatically default to the model's first valid configuration
        finalConfig = currentVehicleObj.configurations[0].name;
        setSelectedConfig(finalConfig);
      }
    }

    // 6. Validate Legal Consent Agreement
    if (!agreeConsent) {
      setErrorMessage('Please confirm agreement to be contacted regarding your vehicle request.');
      return;
    }

    // Prevent duplicate submissions
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const result = await storageService.addInquiry({
        fullName: trimmedName,
        email: trimmedEmail,
        countryName: phoneState.countryName,
        countryIsoCode: phoneState.countryIsoCode,
        countryDialingCode: phoneState.countryDialingCode,
        phoneNumber: phoneState.phoneNumber.trim(),
        normalizedPhoneNumber: phoneState.normalizedPhoneNumber,
        stateOrRegion: stateOrRegion.trim(),
        preferredModel: selectedModel.trim(),
        preferredConfiguration: finalConfig || undefined,
        preferredColor: selectedColor || undefined,
        purchaseMethod,
        message: message.trim(),
      });

      setIsSubmitting(false);

      if (result && result.success) {
        const assignedInquiryId = result.inquiryId || `INQ-${Date.now()}`;
        const createdTimestamp = new Date().toISOString();

        setSubmittedDetails({
          id: assignedInquiryId,
          fullName: trimmedName,
          email: trimmedEmail,
          phoneNumber: phoneState.normalizedPhoneNumber || `${phoneState.countryDialingCode} ${phoneState.phoneNumber}`,
          countryName: phoneState.countryName,
          model: selectedModel.trim(),
          configuration: finalConfig || undefined,
          color: selectedColor || undefined,
          purchaseMethod,
          submittedAt: createdTimestamp,
        });

        setIsSubmitted(true);

        if (onInquirySubmitted) {
          onInquirySubmitted({
            id: assignedInquiryId,
            fullName: trimmedName,
            email: trimmedEmail,
            countryName: phoneState.countryName,
            countryIsoCode: phoneState.countryIsoCode,
            countryDialingCode: phoneState.countryDialingCode,
            phoneNumber: phoneState.phoneNumber.trim(),
            normalizedPhoneNumber: phoneState.normalizedPhoneNumber,
            stateOrRegion: stateOrRegion.trim(),
            preferredModel: selectedModel.trim(),
            preferredConfiguration: finalConfig || undefined,
            preferredColor: selectedColor || undefined,
            purchaseMethod,
            message: message.trim(),
            status: 'New',
            createdAt: createdTimestamp,
          });
        }
      } else {
        // Backend returned failure; display real error and never show fake success
        setIsSubmitted(false);
        setErrorMessage(
          result?.error || "We couldn't submit your request right now. Please check your connection and try again."
        );
      }
    } catch (err: any) {
      console.error('[PurchaseRequest] Submission network failure:', err);
      setIsSubmitting(false);
      setIsSubmitted(false);
      setErrorMessage("We couldn't submit your request right now. Please check your connection and try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        id="purchase-request-modal"
        className="relative w-full max-w-2xl bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-visible text-neutral-900 max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-[#F8F9FA] sticky top-0 z-20 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <Car className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 font-semibold">
                Official Vehicle Assistance Desk
              </span>
              <h3 className="text-lg font-bold text-neutral-900 font-sans">
                Customer Purchase & Allocation Request
              </h3>
            </div>
          </div>

          <button
            type="button"
            id="close-purchase-modal-btn"
            onClick={() => {
              onClose();
              if (isSubmitted) resetForm();
            }}
            className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 border border-neutral-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 flex-1">
          {isSubmitted && submittedDetails ? (
            <div className="py-4 text-center space-y-6 animate-in zoom-in-95 duration-200" id="inquiry-success-state">
              {/* Success Badge */}
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="max-w-xl mx-auto space-y-3">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Reference ID: {submittedDetails.id}</span>
                </div>

                <h4 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  Request Submitted Successfully
                </h4>

                {/* Primary Confirmation Notice */}
                <div className="text-left bg-[#F8F9FA] p-5 sm:p-6 rounded-2xl border border-neutral-200 space-y-3 text-sm text-neutral-600 leading-relaxed shadow-xs">
                  <p className="font-medium text-neutral-900">
                    Thank you. Your vehicle request has been successfully submitted and received by our management team.
                  </p>
                  <p>
                    Your request will now be reviewed based on the vehicle, configuration, availability, and information you provided.
                  </p>
                  <p>
                    A member of our management/customer service team may contact you using the email address or phone number you provided. Please monitor your email, including your spam/junk folder, and keep your phone available.
                  </p>
                  <p>
                    If you receive a message or call regarding your request, please respond promptly so we can assist you with the next steps.
                  </p>
                  <div className="pt-2 border-t border-neutral-200 text-xs text-neutral-500 italic">
                    Please note: submitting a vehicle request does not constitute a completed purchase, confirmed order, or guaranteed vehicle allocation.
                  </div>
                </div>
              </div>

              {/* Submitted Request Record Overview */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200 text-left text-xs text-neutral-600 max-w-xl mx-auto space-y-2 font-mono shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200 text-neutral-900 font-sans font-bold text-xs uppercase tracking-wider">
                  <span className="flex items-center space-x-1.5 text-neutral-900">
                    <FileText className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Submission Summary</span>
                  </span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Status: Received
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="flex justify-between sm:flex-col sm:space-y-0.5">
                    <span className="text-neutral-500">Applicant:</span>
                    <span className="text-neutral-900 font-medium">{submittedDetails.fullName}</span>
                  </div>

                  <div className="flex justify-between sm:flex-col sm:space-y-0.5">
                    <span className="text-neutral-500">Vehicle Model:</span>
                    <span className="text-neutral-900 font-bold">{submittedDetails.model}</span>
                  </div>

                  {submittedDetails.configuration && (
                    <div className="flex justify-between sm:flex-col sm:space-y-0.5">
                      <span className="text-neutral-500">Configuration:</span>
                      <span className="text-neutral-900 font-medium">{submittedDetails.configuration}</span>
                    </div>
                  )}

                  {submittedDetails.color && (
                    <div className="flex justify-between sm:flex-col sm:space-y-0.5">
                      <span className="text-neutral-500">Exterior Paint:</span>
                      <span className="text-neutral-900 font-medium">{submittedDetails.color}</span>
                    </div>
                  )}

                  <div className="flex justify-between sm:flex-col sm:space-y-0.5">
                    <span className="text-neutral-500">Contact Telephone:</span>
                    <span className="text-neutral-900 font-medium">{submittedDetails.phoneNumber}</span>
                  </div>

                  <div className="flex justify-between sm:flex-col sm:space-y-0.5">
                    <span className="text-neutral-500">Email Address:</span>
                    <span className="text-neutral-900 font-medium">{submittedDetails.email}</span>
                  </div>

                  <div className="flex justify-between sm:flex-col sm:space-y-0.5">
                    <span className="text-neutral-500">Purchase Method:</span>
                    <span className="text-neutral-900 font-medium">{submittedDetails.purchaseMethod}</span>
                  </div>

                  <div className="flex justify-between sm:flex-col sm:space-y-0.5">
                    <span className="text-neutral-500">Country / Region:</span>
                    <span className="text-neutral-900 font-medium">{submittedDetails.countryName}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Done & Submit Another Request */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <button
                  type="button"
                  id="done-purchase-request-btn"
                  onClick={() => {
                    onClose();
                    resetForm();
                  }}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs active:scale-98"
                >
                  Done
                </button>

                <button
                  type="button"
                  id="submit-another-request-btn"
                  onClick={resetForm}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#F8F9FA] hover:bg-neutral-100 text-neutral-900 text-xs font-bold uppercase tracking-wider border border-neutral-200 transition-colors cursor-pointer flex items-center justify-center space-x-2 active:scale-98"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Submit Another Request</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" id="purchase-request-form">
              {errorMessage && (
                <div
                  id="purchase-form-error"
                  className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2.5 animate-in fade-in"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                  <span className="leading-relaxed font-medium">{errorMessage}</span>
                </div>
              )}

              {/* Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inq-fullname" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5 font-mono">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="inq-fullname"
                    required
                    disabled={isSubmitting}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors shadow-2xs disabled:bg-neutral-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="inq-email" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5 font-mono">
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    id="inq-email"
                    required
                    disabled={isSubmitting}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. eleanor@example.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors shadow-2xs disabled:bg-neutral-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Worldwide Country & International Phone System */}
              <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-neutral-200">
                <CountryPhonePicker
                  idPrefix="inq-country"
                  value={phoneState}
                  onChange={setPhoneState}
                  countriesList={countriesList}
                />

                <div className="mt-3">
                  <label htmlFor="inq-region" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5 font-mono">
                    State / Province / Region
                  </label>
                  <input
                    type="text"
                    id="inq-region"
                    disabled={isSubmitting}
                    value={stateOrRegion}
                    onChange={(e) => setStateOrRegion(e.target.value)}
                    placeholder="e.g. California / Lagos / London / Zurich"
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors shadow-2xs disabled:bg-neutral-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Preferred Model & Dependent Configuration Cascading Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <VehicleModelDropdown
                  id="inq-preferred-model"
                  selectedModelName={selectedModel}
                  onSelectModel={handleModelSelect}
                  vehicles={vehicles}
                  label="Preferred Tesla Model"
                  required
                />

                <VehicleConfigDropdown
                  id="inq-preferred-config"
                  selectedConfigName={selectedConfig}
                  onSelectConfig={handleConfigSelect}
                  configurations={currentVehicleObj?.configurations || []}
                  vehicleName={currentVehicleObj?.name || 'Selected Model'}
                  label="Preferred Configuration"
                />
              </div>

              {/* Preferred Exterior Paint (Vehicle-specific colors) */}
              {currentVehicleObj?.colors && currentVehicleObj.colors.length > 0 && (
                <div>
                  <label htmlFor="inq-preferred-color" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5 font-mono">
                    Preferred Exterior Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {currentVehicleObj.colors.map((c) => {
                      const isSelected = selectedColor === c.name;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          id={`inq-color-${c.id}`}
                          disabled={isSubmitting}
                          onClick={() => setSelectedColor(c.name)}
                          className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer disabled:opacity-50 ${
                            isSelected
                              ? 'bg-white border-neutral-900 ring-1 ring-neutral-900 text-neutral-900 shadow-2xs'
                              : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-600 hover:text-neutral-900'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-neutral-300 shadow-2xs flex-shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Purchase Method */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2 font-mono">
                  Purchase Method <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Cash', 'Financing', 'Other'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      id={`inq-method-${method.toLowerCase()}`}
                      disabled={isSubmitting}
                      onClick={() => setPurchaseMethod(method)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer disabled:opacity-50 ${
                        purchaseMethod === method
                          ? 'bg-neutral-900 border-neutral-900 text-white shadow-2xs'
                          : 'bg-white border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="inq-message" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5 font-mono">
                  Message / Special Allocation Requirements (Optional)
                </label>
                <textarea
                  id="inq-message"
                  rows={2}
                  disabled={isSubmitting}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Specify delivery timeline, custom exterior/interior colors, or corporate fleet details..."
                  className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors shadow-2xs disabled:bg-neutral-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Checkbox agreement */}
              <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-[#F8F9FA] border border-neutral-200">
                <input
                  type="checkbox"
                  id="inq-consent-checkbox"
                  checked={agreeConsent}
                  disabled={isSubmitting}
                  onChange={(e) => setAgreeConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-neutral-300 bg-white text-red-600 focus:ring-red-600 cursor-pointer disabled:opacity-50"
                  required
                />
                <label htmlFor="inq-consent-checkbox" className="text-xs text-neutral-600 leading-relaxed cursor-pointer select-none">
                  &ldquo;I confirm that the information submitted is accurate and I agree to be contacted regarding my vehicle inquiry.&rdquo;
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="submit-vehicle-request-btn"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer shadow-xs flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-98"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SUBMIT VEHICLE REQUEST</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-neutral-500 text-center">
                Submitting a vehicle request does not constitute a completed purchase, confirmed order, or guaranteed vehicle allocation.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
