import React from 'react';
import { ShieldCheck, Lock, Globe, ExternalLink } from 'lucide-react';
import { AuthorizationInfo, Vehicle } from '../types';
import { TeslaLogo } from './TeslaLogo';
import { TeslaWordmark } from './TeslaWordmark';

interface FooterProps {
  vehicles?: Vehicle[];
  authInfo?: AuthorizationInfo;
  onOpenVerification: () => void;
  onOpenDashboard: () => void;
  onOpenPurchaseModal: () => void;
  onSelectVehicle?: (vehicle: Vehicle) => void;
}

export const Footer: React.FC<FooterProps> = ({
  vehicles = [],
  authInfo,
  onOpenVerification,
  onOpenDashboard,
  onOpenPurchaseModal,
  onSelectVehicle,
}) => {
  return (
    <footer className="bg-white text-neutral-600 border-t border-neutral-200 pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1: Brand & Authorization */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <TeslaLogo className="w-7 h-7 flex-shrink-0" />
              <div className="flex items-center space-x-1.5">
                <TeslaWordmark className="h-3.5 w-auto text-neutral-900" />
                <span className="font-light text-sm tracking-[0.18em] uppercase text-neutral-600">
                  MANAGEMENT
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed max-w-sm">
              Dedicated client vehicle assistance, verified management promotional allocation pricing, and international purchasing coordination.
            </p>

            <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-neutral-200 space-y-1">
              <div className="flex items-center space-x-2 text-neutral-800 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Authorized Representative ID</span>
              </div>
              <div className="font-mono text-emerald-700 font-bold text-xs">
                {authInfo?.authorizationNumber || 'TM-AUTH-2026-GLOBAL-8941'}
              </div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 font-mono">
              Vehicle Lineup
            </h4>
            <ul className="space-y-2">
              {vehicles.length > 0 ? (
                vehicles.map((v) => (
                  <li key={v.id}>
                    {onSelectVehicle ? (
                      <button
                        type="button"
                        onClick={() => onSelectVehicle(v)}
                        className="hover:text-neutral-900 transition-colors text-left cursor-pointer"
                      >
                        {v.name}
                      </button>
                    ) : (
                      <a href="#vehicles" className="hover:text-neutral-900 transition-colors">
                        {v.name}
                      </a>
                    )}
                  </li>
                ))
              ) : (
                <li className="text-neutral-400">Loading catalog...</li>
              )}
            </ul>
          </div>

          {/* Col 3: Assistance & Terms */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 font-mono">
              Client Purchasing
            </h4>
            <ul className="space-y-2">
              <li><a href="#special-pricing" className="hover:text-neutral-900 transition-colors">Special Promotional Pricing</a></li>
              <li><a href="#how-it-works" className="hover:text-neutral-900 transition-colors">How It Works</a></li>
              <li><a href="#about" className="hover:text-neutral-900 transition-colors">About Management</a></li>
              <li><a href="#security" className="hover:text-neutral-900 transition-colors">Customer Security Policy</a></li>
              <li><a href="#contact" className="hover:text-neutral-900 transition-colors">Contact Management</a></li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPurchaseModal}
                  className="text-red-600 hover:text-red-700 font-semibold transition-colors cursor-pointer text-left"
                >
                  Submit Vehicle Request
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Verification & Administration */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 font-mono">
              Verification & Admin
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={onOpenVerification}
                  className="hover:text-neutral-900 flex items-center space-x-1.5 transition-colors cursor-pointer text-left"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verify Authorization</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenDashboard}
                  className="hover:text-neutral-900 flex items-center space-x-1.5 transition-colors cursor-pointer text-left"
                >
                  <Lock className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Management Portal</span>
                </button>
              </li>
              <li className="pt-2 text-[11px] text-neutral-500 font-mono">
                Global Operations: US, EU, UK, NG, CA, APAC
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="pt-8 border-t border-neutral-200 space-y-4">
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            {authInfo?.legalDisclaimer || 'Tesla Management operates as an authorized representative for client vehicle allocation, specifications verification, and purchase coordination. All promotional vehicle prices are published under authorization reference TM-AUTH-2026-GLOBAL-8941.'}
          </p>

          <p className="text-[11px] text-neutral-500 leading-relaxed">
            &ldquo;Final pricing may vary according to configuration, location, applicable taxes, delivery charges, inventory, eligibility and current terms. Final pricing is confirmed during the authorized purchasing process. Submitting an inquiry does not constitute a completed vehicle purchase or guaranteed vehicle allocation.&rdquo;
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 text-[11px] text-neutral-500 gap-2">
            <div>
              &copy; {new Date().getFullYear()} Tesla Management Desk. All Rights Reserved. Operating Under Verified Client Assistance Authorization.
            </div>
            <div className="flex items-center space-x-4">
              <span>Standard ISO 3166-1 Worldwide Phone System</span>
              <span>•</span>
              <button type="button" onClick={onOpenDashboard} className="hover:text-neutral-900 transition-colors">Admin Portal</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
