import React from 'react';
import { ShieldCheck, Briefcase, CheckCircle2, FileText } from 'lucide-react';
import { AuthorizationInfo } from '../types';

interface AboutManagementProps {
  authInfo?: AuthorizationInfo;
  onOpenVerification: () => void;
}

export const AboutManagement: React.FC<AboutManagementProps> = ({
  authInfo,
  onOpenVerification,
}) => {
  const representativeName = authInfo?.representativeName || 'Authorized Management Desk';
  const authorizedTitle = authInfo?.authorizedTitle || 'Authorized Client Vehicle Representative';
  const authorizationNumber = authInfo?.authorizationNumber || 'TM-AUTH-2026-GLOBAL-8941';
  const expirationDate = authInfo?.expirationDate || '2026-12-31';
  const publicRef = authInfo?.publicAuthorizationReference || 'REF-MGMT-TESLA-GLOBAL-2026';
  const responsibilities = authInfo?.responsibilities || [
    'Direct coordination for verified vehicle specifications and inventory',
    'Application and confirmation of authorized promotional allocation discounts',
    'Secure communication channel for pre-delivery and corporate fleet inquiries',
    'Customer security safeguards and anti-fraud verification adherence',
  ];
  const verificationInstructions = authInfo?.verificationInstructions || 'To verify authorization, enter the official authorization ID into our verification system.';

  return (
    <section id="about" className="py-20 bg-white text-neutral-900 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 block mb-2">
            Governance & Scope
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">
            About Management
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-3 leading-relaxed">
            Operating under verified client assistance authorization to facilitate vehicle inquiries and allocations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Representative Credentials Box */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-6">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 font-semibold">
                  Authorized Role
                </span>
                <h3 className="text-lg font-bold text-neutral-900">
                  {representativeName}
                </h3>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200/80 space-y-3 text-xs">
              <div>
                <span className="text-neutral-500 uppercase font-mono text-[10px] block font-semibold">Authorized Title</span>
                <span className="text-neutral-900 font-semibold text-sm">{authorizedTitle}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-200">
                <div>
                  <span className="text-neutral-500 uppercase font-mono text-[10px] block font-semibold">Authorization ID</span>
                  <span className="text-red-600 font-mono font-bold">{authorizationNumber}</span>
                </div>
                <div>
                  <span className="text-neutral-500 uppercase font-mono text-[10px] block font-semibold">Effective Through</span>
                  <span className="text-neutral-700 font-mono font-medium">{expirationDate}</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider block mb-2 font-mono">
                Public Authorization Reference
              </span>
              <p className="text-xs text-neutral-700 font-mono bg-[#F8F9FA] p-2.5 rounded-lg border border-neutral-200">
                {publicRef}
              </p>
            </div>

            <button
              type="button"
              id="about-verify-auth-btn"
              onClick={onOpenVerification}
              className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center space-x-2 shadow-2xs"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Verify Authorization Protocol</span>
            </button>
          </div>

          {/* Scope & Verified Responsibilities */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#F8F9FA] border border-neutral-200 space-y-6 shadow-2xs">
              <div>
                <h4 className="text-lg font-bold text-neutral-900 mb-2 flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-red-600" />
                  <span>Authorized Responsibilities</span>
                </h4>
                <p className="text-xs sm:text-sm text-neutral-600">
                  Management coordinates client inquiries according to established standards:
                </p>
              </div>

              <div className="space-y-3">
                {responsibilities.map((resp, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3.5 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-neutral-800 font-medium">{resp}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-600 leading-relaxed shadow-2xs">
                <span className="font-bold text-neutral-900 block mb-1">
                  Verification Instructions:
                </span>
                {verificationInstructions}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
