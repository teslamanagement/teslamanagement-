import React from 'react';
import { ShieldCheck, CheckCircle2, Lock, ExternalLink, Hash, Calendar, Globe } from 'lucide-react';
import { AuthorizationInfo } from '../types';

interface AuthorizationSectionProps {
  authInfo?: AuthorizationInfo;
  onOpenVerification: () => void;
}

export const AuthorizationSection: React.FC<AuthorizationSectionProps> = ({
  authInfo,
  onOpenVerification,
}) => {
  const authorizedTitle = authInfo?.authorizedTitle || 'Authorized Client Vehicle Representative';
  const authorizationNumber = authInfo?.authorizationNumber || 'TM-AUTH-2026-GLOBAL-8941';
  const representativeName = authInfo?.representativeName || 'Authorized Management Desk';
  const authorizationDate = authInfo?.authorizationDate || '2026-01-01';
  const expirationDate = authInfo?.expirationDate || '2026-12-31';
  const publicRef = authInfo?.publicAuthorizationReference || 'REF-MGMT-TESLA-GLOBAL-2026';
  const verificationInstructions = authInfo?.verificationInstructions || 'To verify authorization, enter the official authorization ID into our verification system.';

  return (
    <section
      id="authorization"
      className="py-20 bg-[#F8F9FA] text-neutral-900 border-t border-neutral-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3 font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Verification Channel</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">
              Authorization & Verification
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 mt-3 max-w-2xl mx-auto leading-relaxed">
              Transparent, verifiable representation credentials ensuring client trust, authentic pricing, and authorized vehicle purchasing assistance.
            </p>
          </div>

          {/* Main Verification Certificate Card */}
          <div className="p-6 sm:p-10 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-8 relative overflow-hidden">
            {/* Background Watermark */}
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

            {/* Certificate Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-100 gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 font-mono">
                      Status: Active & Verified
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900">
                    {authorizedTitle}
                  </h3>
                </div>
              </div>

              <div className="text-right sm:text-right">
                <span className="text-[10px] text-neutral-500 uppercase font-mono block font-semibold">Registry Ref</span>
                <span className="text-xs font-mono font-bold text-neutral-800 bg-[#F8F9FA] px-3 py-1.5 rounded-lg border border-neutral-200 inline-block mt-1">
                  {authorizationNumber}
                </span>
              </div>
            </div>

            {/* Credential Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200 space-y-1">
                <div className="flex items-center space-x-1.5 text-neutral-500 font-mono text-[10px] uppercase font-semibold">
                  <Hash className="w-3 h-3" />
                  <span>Authorized Representative Name</span>
                </div>
                <div className="text-sm font-bold text-neutral-900">
                  {representativeName}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200 space-y-1">
                <div className="flex items-center space-x-1.5 text-neutral-500 font-mono text-[10px] uppercase font-semibold">
                  <Calendar className="w-3 h-3" />
                  <span>Authorization Validity Window</span>
                </div>
                <div className="text-sm font-bold text-neutral-900">
                  {authorizationDate} to {expirationDate}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200 space-y-1 sm:col-span-2">
                <div className="flex items-center space-x-1.5 text-neutral-500 font-mono text-[10px] uppercase font-semibold">
                  <Globe className="w-3 h-3" />
                  <span>Public Authorization Reference</span>
                </div>
                <div className="text-sm font-mono text-emerald-700 font-bold">
                  {publicRef}
                </div>
              </div>
            </div>

            {/* Verification Instructions Callout */}
            <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-neutral-200 space-y-2">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                Official Verification Instructions:
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {verificationInstructions}
              </p>
            </div>

            {/* Verify Authorization Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                type="button"
                id="btn-verify-authorization-main"
                onClick={onOpenVerification}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer shadow-xs flex items-center justify-center space-x-2 active:scale-95"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Authorization</span>
              </button>

              <div className="text-[11px] text-neutral-500 text-center sm:text-right">
                Encrypted Verification Reference • Updated August 2026
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
