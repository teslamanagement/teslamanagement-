import React from 'react';
import { Lock } from 'lucide-react';
import { AuthorizationInfo, Vehicle } from '../types';
import { TeslaLogo } from './TeslaLogo';
import { TeslaWordmark } from './TeslaWordmark';

interface FooterProps {
  vehicles?: Vehicle[];
  authInfo?: AuthorizationInfo;
  onOpenDashboard: () => void;
  onOpenPurchaseModal: () => void;
  onSelectVehicle?: (vehicle: Vehicle) => void;
}

export const Footer: React.FC<FooterProps> = ({
  vehicles = [],
  authInfo,
  onOpenDashboard,
  onOpenPurchaseModal,
  onSelectVehicle,
}) => {
  return (
    <footer className="bg-neutral-900 text-neutral-400 border-t border-neutral-800 pt-12 sm:pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 lg:gap-10 mb-10 sm:mb-12">
          {/* Col 1: Brand */}
          <div className="col-span-1 sm:col-span-2 md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <TeslaLogo className="w-7 h-7 flex-shrink-0 text-white" />
              <div className="flex items-center space-x-1.5">
                <TeslaWordmark className="h-3.5 w-auto text-white" />
                <span className="font-light text-sm tracking-[0.18em] uppercase text-neutral-400">
                  MANAGEMENT
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Dedicated client vehicle assistance, management promotional allocation pricing, and international purchasing coordination.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-mono">
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
                        className="hover:text-white transition-colors text-left cursor-pointer"
                      >
                        {v.name}
                      </button>
                    ) : (
                      <a href="#vehicles" className="hover:text-white transition-colors">
                        {v.name}
                      </a>
                    )}
                  </li>
                ))
              ) : (
                <li className="text-neutral-500">Loading catalog...</li>
              )}
            </ul>
          </div>

          {/* Col 3: Assistance & Terms */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-mono">
              Client Purchasing
            </h4>
            <ul className="space-y-2">
              <li><a href="#special-pricing" className="hover:text-white transition-colors">Special Promotional Pricing</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Management</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">Customer Security Policy</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Management</a></li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPurchaseModal}
                  className="text-red-400 hover:text-white font-semibold transition-colors cursor-pointer text-left"
                >
                  Submit Vehicle Request
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Administration */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-mono">
              Administration
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={onOpenDashboard}
                  className="hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer text-left"
                >
                  <Lock className="w-3.5 h-3.5 text-neutral-400" />
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
        <div className="pt-8 border-t border-neutral-800 space-y-4">
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            {authInfo?.legalDisclaimer || 'Tesla Management provides client vehicle allocation assistance, specification review, and purchase coordination. All vehicle brand names, trademarks, and vehicle imagery are the property of Tesla, Inc.'}
          </p>

          <p className="text-[11px] text-neutral-400 leading-relaxed">
            &ldquo;Final pricing may vary according to configuration, location, applicable taxes, delivery charges, inventory, eligibility and current terms. Final pricing is confirmed during the purchasing process. Submitting an inquiry does not constitute a completed vehicle purchase or guaranteed vehicle allocation.&rdquo;
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 text-[11px] text-neutral-500 gap-3 font-mono">
            <div>
              &copy; {new Date().getFullYear()} Tesla Management Desk. All Rights Reserved.
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>Standard ISO 3166-1 Worldwide System</span>
              <span>•</span>
              <button type="button" onClick={onOpenDashboard} className="hover:text-white transition-colors cursor-pointer">Admin Portal</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
