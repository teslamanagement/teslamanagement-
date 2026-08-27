import React, { useState, useMemo } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2, AlertCircle, Loader2, RotateCcw, FileText, Check } from 'lucide-react';
import { AuthorizationInfo, CountryData, Vehicle } from '../types';
import { CountryPhonePicker, CountryPhoneValue } from './CountryPhonePicker';
import { VehicleModelDropdown, VehicleConfigDropdown } from './VehicleModelPicker';
import { storageService } from '../services/storage';
import { INITIAL_VEHICLES } from '../data/vehicles';

interface ContactSectionProps {
  authInfo?: AuthorizationInfo;
  countriesList: CountryData[];
  vehicles?: Vehicle[];
}

interface SubmittedInquirySummary {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  countryName: string;
  topic: string;
  model?: string;
  configuration?: string;
  submittedAt: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  authInfo,
  countriesList,
  vehicles: propVehicles,
}) => {
  const vehicles = useMemo(() => {
    if (Array.isArray(propVehicles) && propVehicles.length > 0) return propVehicles;
    const stored = storageService.getVehicles();
    if (Array.isArray(stored) && stored.length > 0) return stored;
    return INITIAL_VEHICLES;
  }, [propVehicles]);

  const officialEmail = authInfo?.officialEmail || 'teslasemi60@gmail.com';
  const officialDialCode = authInfo?.officialDialCode || '+1';
  const officialPhone = authInfo?.officialPhone || 'Unavailable at this moment';
  const businessMessagingChannel = authInfo?.businessMessagingChannel || 'Tesla Management Client Desk';
  const officeLocation = authInfo?.officeLocation || 'Tesla Management Operations & International Client Support Center, 1 Tesla Road, Austin, TX 78725';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryTopic, setInquiryTopic] = useState('Vehicle Purchase Inquiry');
  const [selectedModel, setSelectedModel] = useState(vehicles[0]?.name || 'Model S');
  const [selectedConfig, setSelectedConfig] = useState(vehicles[0]?.configurations?.[0]?.name || '');
  const [message, setMessage] = useState('');
  const [agreeConsent, setAgreeConsent] = useState(false);

  const currentVehicleObj = useMemo(() => {
    return vehicles.find((v) => v.name.toLowerCase() === selectedModel.toLowerCase()) || vehicles[0];
  }, [vehicles, selectedModel]);

  const handleModelSelect = (veh: Vehicle) => {
    setSelectedModel(veh.name);
    if (veh.configurations && veh.configurations.length > 0) {
      setSelectedConfig(veh.configurations[0].name);
    } else {
      setSelectedConfig('');
    }
  };

  const [phoneState, setPhoneState] = useState<CountryPhoneValue>({
    countryName: 'United States',
    countryIsoCode: 'US',
    countryDialingCode: '+1',
    phoneNumber: '',
    normalizedPhoneNumber: '',
    isValid: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedSummary, setSubmittedSummary] = useState<SubmittedInquirySummary | null>(null);
  const [error, setError] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setMessage('');
    setAgreeConsent(false);
    setPhoneState((prev) => ({ ...prev, phoneNumber: '', normalizedPhoneNumber: '', isValid: false }));
    setSubmitted(false);
    setSubmittedSummary(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Validate full name
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setError('Please provide your full name.');
      return;
    }

    // 2. Validate email address
    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setError('Please provide a valid email address.');
      return;
    }

    // 3. Validate telephone
    if (!phoneState.phoneNumber.trim()) {
      setError('Please provide your contact telephone number.');
      return;
    }
    if (!phoneState.isValid) {
      setError(`Please provide a valid contact number for ${phoneState.countryName}.`);
      return;
    }

    // 4. Validate message
    if (!message.trim()) {
      setError('Please enter your inquiry message or request details.');
      return;
    }

    // 5. Validate consent
    if (!agreeConsent) {
      setError('Please confirm that you agree to be contacted regarding this inquiry.');
      return;
    }

    const isVehicleRelated =
      inquiryTopic.includes('Vehicle') || inquiryTopic.includes('Pricing') || inquiryTopic.includes('Fleet');

    let finalConfig = selectedConfig;
    if (isVehicleRelated && currentVehicleObj && currentVehicleObj.configurations && currentVehicleObj.configurations.length > 0) {
      const validConfigExists = currentVehicleObj.configurations.some(
        (c) => c.name.toLowerCase() === selectedConfig.toLowerCase()
      );
      if (!validConfigExists) {
        finalConfig = currentVehicleObj.configurations[0].name;
        setSelectedConfig(finalConfig);
      }
    }

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
        preferredModel: isVehicleRelated ? selectedModel : inquiryTopic,
        preferredConfiguration: isVehicleRelated ? finalConfig || undefined : undefined,
        purchaseMethod: 'Other',
        message: message.trim(),
      });

      setIsSubmitting(false);

      if (result && result.success) {
        setSubmittedSummary({
          id: result.inquiryId || `INQ-${Date.now()}`,
          fullName: trimmedName,
          email: trimmedEmail,
          phoneNumber: phoneState.normalizedPhoneNumber || `${phoneState.countryDialingCode} ${phoneState.phoneNumber}`,
          countryName: phoneState.countryName,
          topic: inquiryTopic,
          model: isVehicleRelated ? selectedModel : undefined,
          configuration: isVehicleRelated ? finalConfig || undefined : undefined,
          submittedAt: new Date().toISOString(),
        });
        setSubmitted(true);
      } else {
        setSubmitted(false);
        setError(result?.error || "We couldn't submit your request right now. Please check your connection and try again.");
      }
    } catch (err: any) {
      console.error('[ContactSection] Submission error:', err);
      setIsSubmitting(false);
      setSubmitted(false);
      setError("We couldn't submit your request right now. Please check your connection and try again.");
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-[#F8F9FA] text-neutral-900 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left max-w-3xl mb-10 sm:mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 block mb-2">
            Direct Communication Desk
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Contact Management
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-2 leading-relaxed">
            Reach Tesla Management representatives for vehicle allocations, corporate orders, and direct pricing inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Contact Details Sidebar */}
          <div className="col-span-1 lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-6">
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-red-600" />
                <span>Direct Contact Channels</span>
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-[#F8F9FA] border border-neutral-200">
                  <Mail className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-mono block font-semibold">Official Management Email</span>
                    <a href={`mailto:${officialEmail}`} className="text-neutral-900 hover:text-red-600 transition-colors font-medium break-all text-xs sm:text-sm">
                      {officialEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-[#F8F9FA] border border-neutral-200">
                  <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-mono block font-semibold">Official Telephone Number</span>
                    <span className="text-neutral-900 font-mono font-medium text-xs sm:text-sm">
                      {officialDialCode} {officialPhone}
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-[#F8F9FA] border border-neutral-200">
                  <MessageSquare className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-mono block font-semibold">Client Messaging Channel</span>
                    <span className="text-neutral-800 font-medium text-xs sm:text-sm">
                      {businessMessagingChannel}
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-[#F8F9FA] border border-neutral-200">
                  <MapPin className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-mono block font-semibold">Office Information</span>
                    <span className="text-neutral-800 leading-relaxed text-xs">
                      {officeLocation}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Contact Form */}
          <div className="col-span-1 lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 shadow-xs">
            {submitted && submittedSummary ? (
              <div className="py-6 text-center space-y-6 animate-in zoom-in-95 duration-200" id="contact-success-state">
                {/* Success Indicator Badge */}
                <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 mx-auto flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="max-w-xl mx-auto space-y-3">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Reference ID: {submittedSummary.id}</span>
                  </div>

                  <h4 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
                    Request Submitted Successfully
                  </h4>

                  {/* Prominent Required Confirmation Notice */}
                  <div className="text-left bg-[#F8F9FA] p-6 rounded-2xl border border-neutral-200 space-y-3 text-sm text-neutral-700 leading-relaxed shadow-2xs">
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

                {/* Submitted Summary Box */}
                <div className="p-5 rounded-2xl bg-white border border-neutral-200 text-left text-xs text-neutral-600 max-w-xl mx-auto space-y-2 font-mono shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-100 text-neutral-900 font-sans font-bold text-xs uppercase tracking-wider">
                    <span className="flex items-center space-x-1.5 text-neutral-700">
                      <FileText className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Submission Details</span>
                    </span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Status: Received
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="flex flex-col space-y-0.5">
                      <span className="text-neutral-500">Applicant:</span>
                      <span className="text-neutral-900 font-medium">{submittedSummary.fullName}</span>
                    </div>

                    {submittedSummary.model && (
                      <div className="flex flex-col space-y-0.5">
                        <span className="text-neutral-500">Vehicle Model:</span>
                        <span className="text-neutral-900 font-bold">{submittedSummary.model}</span>
                      </div>
                    )}

                    {submittedSummary.configuration && (
                      <div className="flex flex-col space-y-0.5">
                        <span className="text-neutral-500">Configuration:</span>
                        <span className="text-neutral-900 font-medium">{submittedSummary.configuration}</span>
                      </div>
                    )}

                    <div className="flex flex-col space-y-0.5">
                      <span className="text-neutral-500">Contact Number:</span>
                      <span className="text-neutral-900 font-medium">{submittedSummary.phoneNumber}</span>
                    </div>

                    <div className="flex flex-col space-y-0.5">
                      <span className="text-neutral-500">Email Address:</span>
                      <span className="text-neutral-900 font-medium">{submittedSummary.email}</span>
                    </div>

                    <div className="flex flex-col space-y-0.5">
                      <span className="text-neutral-500">Topic:</span>
                      <span className="text-neutral-900 font-medium">{submittedSummary.topic}</span>
                    </div>
                  </div>
                </div>

                {/* Actions: Done & Submit Another Request */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-md mx-auto">
                  <button
                    type="button"
                    id="contact-done-btn"
                    onClick={() => {
                      resetForm();
                      const section = document.getElementById('contact');
                      if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs active:scale-98"
                  >
                    Done
                  </button>

                  <button
                    type="button"
                    id="contact-another-request-btn"
                    onClick={resetForm}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold uppercase tracking-wider border border-neutral-300 transition-colors cursor-pointer flex items-center justify-center space-x-2 active:scale-98"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Submit Another Request</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" id="contact-management-form">
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 mb-2">
                  Direct Inquiries & Assistance
                </h3>

                {error && (
                  <div id="contact-form-error" className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2.5 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Your Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      required
                      disabled={isSubmitting}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Marcus Aurelius"
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors shadow-2xs disabled:bg-neutral-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      required
                      disabled={isSubmitting}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. marcus@example.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors shadow-2xs disabled:bg-neutral-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Worldwide country & phone selector */}
                <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-neutral-200">
                  <CountryPhonePicker
                    idPrefix="contact-phone"
                    value={phoneState}
                    onChange={setPhoneState}
                    countriesList={countriesList}
                  />
                </div>

                <div>
                  <label htmlFor="contact-topic" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Inquiry Topic
                  </label>
                  <select
                    id="contact-topic"
                    disabled={isSubmitting}
                    value={inquiryTopic}
                    onChange={(e) => setInquiryTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors cursor-pointer shadow-2xs disabled:bg-neutral-100 disabled:cursor-not-allowed"
                  >
                    <option value="Vehicle Purchase Inquiry">Vehicle Purchase Inquiry</option>
                    <option value="Promotional Allocation Pricing">Promotional Allocation Pricing</option>
                    <option value="Corporate Fleet Order">Corporate Fleet Order</option>
                    <option value="International Delivery Coordination">International Delivery Coordination</option>
                    <option value="General Vehicle Inquiry">General Vehicle Inquiry</option>
                  </select>
                </div>

                {/* Model & Configuration Pickers for vehicle-related topics */}
                {(inquiryTopic.includes('Vehicle') || inquiryTopic.includes('Pricing') || inquiryTopic.includes('Fleet')) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-[#F8F9FA] border border-neutral-200">
                    <VehicleModelDropdown
                      id="contact-preferred-model"
                      selectedModelName={selectedModel}
                      onSelectModel={handleModelSelect}
                      vehicles={vehicles}
                      label="Tesla Model of Interest"
                    />

                    <VehicleConfigDropdown
                      id="contact-preferred-config"
                      selectedConfigName={selectedConfig}
                      onSelectConfig={setSelectedConfig}
                      configurations={currentVehicleObj?.configurations || []}
                      vehicleName={currentVehicleObj?.name || 'Selected Model'}
                      label="Configuration Trim"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="contact-msg" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Your Message <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="contact-msg"
                    rows={3}
                    required
                    disabled={isSubmitting}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter details of your inquiry or required delivery destination..."
                    className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors shadow-2xs disabled:bg-neutral-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-[#F8F9FA] border border-neutral-200">
                  <input
                    type="checkbox"
                    id="contact-consent"
                    checked={agreeConsent}
                    disabled={isSubmitting}
                    onChange={(e) => setAgreeConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-neutral-300 bg-white text-red-600 focus:ring-red-500 cursor-pointer disabled:opacity-50"
                    required
                  />
                  <label htmlFor="contact-consent" className="text-xs text-neutral-700 leading-relaxed cursor-pointer select-none">
                    I agree to be contacted by a Tesla Management coordinator regarding this inquiry.
                  </label>
                </div>

                <button
                  type="submit"
                  id="btn-submit-contact"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#000000] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer shadow-xs flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-98"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>SUBMIT VEHICLE REQUEST</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
