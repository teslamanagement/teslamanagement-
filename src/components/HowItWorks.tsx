import React from 'react';
import { Car, FileCheck2, ClipboardList, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onStartInquiry: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartInquiry }) => {
  const steps = [
    {
      number: '01',
      title: 'Choose Your Tesla',
      description: 'Explore the full verified Tesla vehicle catalog, review technical specifications, select your preferred model, configuration, and battery options.',
      icon: Car,
      color: 'text-red-500',
    },
    {
      number: '02',
      title: 'Submit Your Vehicle Request',
      description: 'Provide your contact information using our international country-validated form, preferred purchase method, and specific allocation requests.',
      icon: ClipboardList,
      color: 'text-blue-400',
    },
    {
      number: '03',
      title: 'Management Confirms Availability & Pricing',
      description: 'An authorized representative reviews regional inventory, verifies applicable promotional allocation pricing, and prepares your official proposal.',
      icon: FileCheck2,
      color: 'text-amber-400',
    },
    {
      number: '04',
      title: 'Complete the Authorized Purchasing Process',
      description: 'Review final documentation, confirm delivery logistics, and complete authorized payment through independently verified official channels.',
      icon: ShieldCheck,
      color: 'text-emerald-400',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#F8F9FA] text-neutral-900 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 block mb-2">
            Structured Purchasing Journey
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-3 leading-relaxed">
            A transparent, authorized four-step process for acquiring your Tesla vehicle with verified management guidance.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                id={`step-card-${step.number}`}
                className="relative p-6 rounded-2xl bg-white hover:bg-white border border-neutral-200/90 hover:border-neutral-300 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-extrabold text-neutral-300 font-mono tracking-tighter">
                      {step.number}
                    </span>
                    <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                      <Icon className={`w-5 h-5 ${step.color}`} />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900 mb-2.5">
                    {step.title}
                  </h3>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center text-[11px] text-neutral-400 font-medium">
                  <span>Step {idx + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Explicit Disclosure Box mandated in Section 12 */}
        <div className="max-w-4xl mx-auto p-5 rounded-2xl bg-white border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start space-x-3.5">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-700">
              <span className="font-bold text-neutral-900 block mb-0.5">
                Inquiry & Allocation Clarification
              </span>
              <p className="text-neutral-600 leading-relaxed">
                Submitting an inquiry does not itself constitute a completed vehicle purchase or guaranteed allocation. All allocations are formally confirmed upon verified agreement and official documentation review.
              </p>
            </div>
          </div>

          <button
            type="button"
            id="how-it-works-start-btn"
            onClick={onStartInquiry}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors flex-shrink-0 cursor-pointer flex items-center space-x-2 shadow-xs"
          >
            <span>Start Inquiry</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
