import React from 'react';
import { ShieldAlert, Ban, CheckCircle2, Lock, AlertTriangle } from 'lucide-react';

export const CustomerSecurity: React.FC = () => {
  const bannedMethods = [
    'Gift cards (Retail, Digital, or Pre-loaded)',
    'Cryptocurrency transfers (Bitcoin, Ethereum, USDT, etc.)',
    'Personal mobile wallets (Cash App, Venmo, Zelle, personal PayPal)',
    'Unverified personal or third-party bank accounts',
    'Anonymous or peer-to-peer wire transfer services',
  ];

  const legitimatePractices = [
    'Direct authorized corporate wire instructions matching official documentation',
    'Independent verification through the official verification channel prior to transfer',
    'Signed purchase agreement with verified allocation reference numbers',
    'Full transparency with itemized tax, logistics, and registration documentation',
  ];

  return (
    <section id="security" className="py-20 bg-white text-neutral-900 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Fraud Prevention & Customer Protection</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">
              Customer Security & Payment Safety
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 mt-3 leading-relaxed">
              Tesla Management strictly enforces transparent, authorized purchasing protocols to protect customers worldwide against fraudulent solicitations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Prohibited Methods Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-red-50/50 border border-red-200 space-y-4 shadow-xs">
              <div className="flex items-center space-x-3 text-red-600">
                <Ban className="w-6 h-6 flex-shrink-0" />
                <h3 className="text-base font-bold uppercase tracking-wider text-neutral-900">
                  Prohibited Payment Methods
                </h3>
              </div>

              <p className="text-xs text-neutral-600">
                Management representatives will <strong className="text-red-600">NEVER</strong> instruct customers to pay through any of the following methods:
              </p>

              <ul className="space-y-2.5 pt-1">
                {bannedMethods.map((method, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs text-neutral-700 font-medium">
                    <span className="text-red-600 font-bold flex-shrink-0">✕</span>
                    <span>{method}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legitimate Protocol Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-4 shadow-xs">
              <div className="flex items-center space-x-3 text-emerald-700">
                <Lock className="w-6 h-6 flex-shrink-0" />
                <h3 className="text-base font-bold uppercase tracking-wider text-neutral-900">
                  Authorized Verification Standard
                </h3>
              </div>

              <p className="text-xs text-neutral-600">
                All legitimate vehicle allocation and purchasing procedures comply with strict security standards:
              </p>

              <ul className="space-y-2.5 pt-1">
                {legitimatePractices.map((practice, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs text-neutral-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Critical Advisory Banner */}
          <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-neutral-200 flex items-start space-x-4 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-700 space-y-1">
              <span className="font-bold text-neutral-900 block">
                Zero Password & Sensitive Credential Request Policy
              </span>
              <p className="text-neutral-600 leading-relaxed">
                Tesla Management will never ask you for passwords, PIN numbers, two-factor authentication security codes, or unnecessary sensitive identity documents outside of certified purchase contracts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
