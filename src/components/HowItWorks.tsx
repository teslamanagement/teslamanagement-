import React from 'react';
import { Car, FileCheck2, ClipboardList, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onStartInquiry: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartInquiry }) => {
  const steps = [
    {
      number: '01',
      title: 'Select Model & Configuration',
      description: 'Explore vehicle specifications, powertrain options, range figures, and exterior colors.',
      icon: Car,
      color: 'text-red-500',
    },
    {
      number: '02',
      title: 'Submit Inquiry',
      description: 'Provide your contact details, country, and preferred delivery or purchase arrangements.',
      icon: ClipboardList,
      color: 'text-blue-500',
    },
    {
      number: '03',
      title: 'Allocation & Pricing Review',
      description: 'Management reviews inventory, promotional eligibility, and prepares documentation.',
      icon: FileCheck2,
      color: 'text-amber-500',
    },
    {
      number: '04',
      title: 'Finalize Purchase Agreement',
      description: 'Confirm purchase documentation, schedule delivery, and finalize through direct management channels.',
      icon: CheckCircle2,
      color: 'text-emerald-500',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-[#F8F9FA] text-neutral-900 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 block mb-2">
            Purchasing Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-2 max-w-2xl leading-relaxed">
            A transparent four-step process for selecting, reserving, and acquiring your vehicle.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                id={`step-card-${step.number}`}
                className="relative p-5 rounded-2xl bg-white hover:bg-white border border-neutral-200/90 hover:border-neutral-300 transition-all duration-300 shadow-2xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl sm:text-3xl font-extrabold text-neutral-300 font-mono tracking-tighter">
                      {step.number}
                    </span>
                    <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-200">
                      <Icon className={`w-4 h-4 ${step.color}`} />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 mb-1.5">
                    {step.title}
                  </h3>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center text-[11px] text-neutral-400 font-medium">
                  <span>Step {idx + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclosure Box */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start space-x-3.5">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-700">
              <span className="font-bold text-neutral-900 block mb-0.5">
                Inquiry & Allocation Clarification
              </span>
              <p className="text-neutral-600 leading-relaxed">
                Submitting an inquiry does not constitute a completed vehicle purchase or guaranteed allocation. All allocations are confirmed upon signed agreement and official documentation review.
              </p>
            </div>
          </div>

          <button
            type="button"
            id="how-it-works-start-btn"
            onClick={onStartInquiry}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#000000] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors flex-shrink-0 cursor-pointer flex items-center justify-center space-x-2 shadow-2xs whitespace-nowrap"
          >
            <span>Start Inquiry</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
