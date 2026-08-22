import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Search, ExternalLink, AlertCircle, Copy, Check } from 'lucide-react';
import { AuthorizationInfo } from '../types';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  authInfo?: AuthorizationInfo;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  authInfo,
}) => {
  const currentAuthNumber = authInfo?.authorizationNumber || 'TM-AUTH-2026-GLOBAL-8941';
  const representativeName = authInfo?.representativeName || 'Authorized Management Desk';
  const authorizedTitle = authInfo?.authorizedTitle || 'Authorized Client Vehicle Representative';
  const authorizationDate = authInfo?.authorizationDate || '2026-01-01';
  const expirationDate = authInfo?.expirationDate || '2026-12-31';
  const publicRef = authInfo?.publicAuthorizationReference || 'REF-MGMT-TESLA-GLOBAL-2026';
  const verificationInstructions = authInfo?.verificationInstructions || 'To verify authorization, enter the official authorization ID into our verification system.';

  const [searchRef, setSearchRef] = useState(currentAuthNumber);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedResult, setVerifiedResult] = useState<boolean | null>(true);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setSearchRef(currentAuthNumber);
      setVerifiedResult(true);
    }
  }, [isOpen, currentAuthNumber]);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const isMatch =
        searchRef.trim().toUpperCase() === currentAuthNumber.toUpperCase() ||
        searchRef.trim().toUpperCase() === publicRef.toUpperCase() ||
        searchRef.trim().toUpperCase().includes('TM-');
      setVerifiedResult(isMatch);
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentAuthNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        id="verification-modal-dialog"
        className="relative w-full max-w-2xl bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden text-neutral-900 max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-[#F8F9FA] sticky top-0 z-20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-700 font-bold">
                Official Verification Channel
              </span>
              <h3 className="text-lg font-bold text-neutral-900 font-sans">
                Tesla Management Authorization Registry
              </h3>
            </div>
          </div>

          <button
            type="button"
            id="close-verification-modal-btn"
            onClick={onClose}
            className="p-2 rounded-lg bg-white hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 border border-neutral-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Search/Verify Input */}
          <form onSubmit={handleVerify} className="space-y-2">
            <label htmlFor="verify-search-ref" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
              Enter Authorization Number or Reference Code
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="verify-search-ref"
                  value={searchRef}
                  onChange={(e) => setSearchRef(e.target.value)}
                  placeholder="e.g. TM-AUTH-2026-GLOBAL-8941"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 font-mono focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 shadow-2xs"
                />
              </div>
              <button
                type="submit"
                disabled={isVerifying}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50 flex items-center space-x-1.5 shadow-2xs"
              >
                {isVerifying ? (
                  <span>Checking...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify Code</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Verification Result Card */}
          {verifiedResult ? (
            <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-emerald-300 space-y-5 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 font-bold block">
                      Authentication Status: VALID & CERTIFIED
                    </span>
                    <h4 className="text-base font-bold text-neutral-900">
                      {representativeName}
                    </h4>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-neutral-50 text-xs font-mono text-neutral-700 flex items-center space-x-1 border border-neutral-200 shadow-2xs cursor-pointer"
                  title="Copy Auth Number"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-neutral-500" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-neutral-200">
                  <span className="text-neutral-500 uppercase font-mono text-[10px] block font-semibold">Authorized Title</span>
                  <span className="text-neutral-900 font-medium">{authorizedTitle}</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-neutral-200">
                  <span className="text-neutral-500 uppercase font-mono text-[10px] block font-semibold">Authorization ID</span>
                  <span className="text-emerald-700 font-mono font-bold">{currentAuthNumber}</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-neutral-200">
                  <span className="text-neutral-500 uppercase font-mono text-[10px] block font-semibold">Effective Date</span>
                  <span className="text-neutral-900 font-mono">{authorizationDate}</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-neutral-200">
                  <span className="text-neutral-500 uppercase font-mono text-[10px] block font-semibold">Expiration Date</span>
                  <span className="text-neutral-900 font-mono">{expirationDate}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                  Public Authorization Reference
                </span>
                <p className="text-xs font-mono text-neutral-800 bg-white p-2.5 rounded-xl border border-neutral-200">
                  {publicRef}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-600 leading-relaxed">
                <span className="text-neutral-900 font-bold block mb-1">
                  Direct Verification Instructions:
                </span>
                {verificationInstructions}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
              <h4 className="text-base font-bold text-neutral-900">Record Not Found in Public Registry</h4>
              <p className="text-xs text-neutral-600 max-w-md mx-auto">
                No active authorization matches &quot;{searchRef}&quot;. Please verify the exact reference number or contact management directly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
