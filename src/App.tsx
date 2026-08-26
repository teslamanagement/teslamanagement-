/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { AuthorizationInfo, CountryData, CustomerInquiry, Vehicle } from './types';
import { storageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VehicleCatalog } from './components/VehicleCatalog';
import { SpecialPricingSection } from './components/SpecialPricingSection';
import { HowItWorks } from './components/HowItWorks';
import { AboutManagement } from './components/AboutManagement';
import { CustomerSecurity } from './components/CustomerSecurity';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

// Code-split heavy interactive modals & admin modules
const VehicleDetailModal = lazy(() =>
  import('./components/VehicleDetailModal').then((m) => ({ default: m.VehicleDetailModal }))
);
const PurchaseRequestModal = lazy(() =>
  import('./components/PurchaseRequestModal').then((m) => ({ default: m.PurchaseRequestModal }))
);
const ManagementDashboard = lazy(() =>
  import('./components/dashboard/ManagementDashboard').then((m) => ({ default: m.ManagementDashboard }))
);

const ADMIN_PATHS = ['/admin', '/admin-dashboard', '/admin/login', '/management'];

export default function App() {
  // State from Storage Service
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => storageService.getVehicles());
  const [authInfo, setAuthInfo] = useState<AuthorizationInfo>(() => storageService.getAuthInfo());
  const [countriesList, setCountriesList] = useState<CountryData[]>(() => storageService.getCountries());
  const [isLoadingVehicles, setIsLoadingVehicles] = useState<boolean>(() => storageService.getVehicles().length === 0);

  // Modals & Active Selections
  const [selectedVehicleForDetail, setSelectedVehicleForDetail] = useState<Vehicle | null>(null);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [preferredVehicleForPurchase, setPreferredVehicleForPurchase] = useState<Vehicle | null>(null);
  const [preferredConfigName, setPreferredConfigName] = useState<string | undefined>(undefined);
  const [preferredColorName, setPreferredColorName] = useState<string | undefined>(undefined);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  // Refresh helper
  const refreshVehicles = useCallback(async () => {
    setIsLoadingVehicles(true);
    try {
      const data = await storageService.fetchVehicles();
      setVehicles(data);
    } catch (e) {
      console.error('Error fetching vehicles:', e);
    } finally {
      setIsLoadingVehicles(false);
    }
  }, []);

  // Sync route and check URL on load & popstate
  const checkRoute = useCallback(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const baseUrl = (import.meta.env.BASE_URL || '/').toLowerCase();
    // Normalize path by stripping base URL if present
    const relativePath = path.startsWith(baseUrl) ? '/' + path.slice(baseUrl.length) : path;
    const isAdminUrl =
      ADMIN_PATHS.some(p => path === p || path.startsWith(p + '/') || relativePath === p || relativePath.startsWith(p + '/')) ||
      hash === '#admin' ||
      hash === '#/admin' ||
      hash === '#admin-dashboard';

    if (isAdminUrl) {
      setDashboardOpen(true);
    }
  }, []);

  // Fetch initial fresh data from server API and listen to route changes & sync events
  useEffect(() => {
    checkRoute();

    window.addEventListener('popstate', checkRoute);

    // Listen for cross-module sync events dispatched on storage updates
    const handleVehiclesSynced = (e: CustomEvent<Vehicle[]> | Event) => {
      const custom = e as CustomEvent<Vehicle[]>;
      if (custom.detail && Array.isArray(custom.detail)) {
        setVehicles(custom.detail);
      } else {
        setVehicles(storageService.getVehicles());
      }
    };

    window.addEventListener('tm:vehicles_synced', handleVehiclesSynced as EventListener);

    refreshVehicles();
    storageService.fetchAuthInfo().then(setAuthInfo);
    storageService.fetchCountries().then(setCountriesList);

    // Prefetch lazy modules during idle time for instant click response
    const prefetchTimer = window.setTimeout(() => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          import('./components/VehicleDetailModal');
          import('./components/PurchaseRequestModal');
        });
      } else {
        import('./components/VehicleDetailModal');
        import('./components/PurchaseRequestModal');
      }
    }, 1500);

    return () => {
      window.clearTimeout(prefetchTimer);
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('tm:vehicles_synced', handleVehiclesSynced as EventListener);
    };
  }, [checkRoute, refreshVehicles]);

  const handleOpenDetailModal = (vehicle: Vehicle) => {
    setSelectedVehicleForDetail(vehicle);
  };

  const handleCloseDetailModal = () => {
    setSelectedVehicleForDetail(null);
  };

  const handleOpenPurchaseModal = (vehicle?: Vehicle, configName?: string, colorName?: string) => {
    if (vehicle) {
      setPreferredVehicleForPurchase(vehicle);
      setPreferredConfigName(configName);
      setPreferredColorName(colorName);
    } else {
      setPreferredVehicleForPurchase(null);
      setPreferredConfigName(undefined);
      setPreferredColorName(undefined);
    }
    setPurchaseModalOpen(true);
  };

  const handleClosePurchaseModal = () => {
    setPurchaseModalOpen(false);
  };

  const handleOpenDashboard = () => {
    setDashboardOpen(true);
    const baseUrl = import.meta.env.BASE_URL || '/';
    const targetPath = baseUrl.endsWith('/') ? `${baseUrl}admin-dashboard` : `${baseUrl}/admin-dashboard`;
    if (!window.location.pathname.includes('/admin')) {
      window.history.pushState({ modal: 'admin-dashboard' }, '', targetPath);
    }
  };

  const handleCloseDashboard = () => {
    setDashboardOpen(false);
    const baseUrl = import.meta.env.BASE_URL || '/';
    const path = window.location.pathname.toLowerCase();
    const relativePath = path.startsWith(baseUrl.toLowerCase()) ? '/' + path.slice(baseUrl.length) : path;
    if (ADMIN_PATHS.some(p => path.startsWith(p) || relativePath.startsWith(p))) {
      window.history.pushState(null, '', baseUrl);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-neutral-900 selection:bg-red-600 selection:text-white flex flex-col font-sans antialiased overflow-x-hidden">
      {/* Top Navigation */}
      <Navbar
        onOpenDashboard={handleOpenDashboard}
        onOpenPurchaseModal={() => handleOpenPurchaseModal()}
        authInfo={authInfo}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Section 1: Hero */}
        <Hero
          onExploreVehicles={() => {
            const el = document.getElementById('vehicles');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onContactManagement={() => handleOpenPurchaseModal()}
          authInfo={authInfo}
        />

        {/* Section 2 & 3: Vehicle Catalog */}
        <VehicleCatalog
          vehicles={vehicles}
          isLoading={isLoadingVehicles}
          onRefresh={refreshVehicles}
          onSelectVehicle={handleOpenDetailModal}
          onRequestVehicle={(vehicle) => handleOpenPurchaseModal(vehicle)}
        />

        {/* Section 5: Special Management Promotional Pricing */}
        <SpecialPricingSection
          vehicles={vehicles}
          isLoading={isLoadingVehicles}
          onRequestVehicle={(vehicle) => handleOpenPurchaseModal(vehicle)}
        />

        {/* Section 12: How It Works */}
        <HowItWorks
          onStartInquiry={() => handleOpenPurchaseModal()}
        />

        {/* Section 10: About Management */}
        <AboutManagement
          authInfo={authInfo}
        />

        {/* Section 13: Customer Security */}
        <CustomerSecurity />

        {/* Section 9: Contact Management */}
        <ContactSection
          authInfo={authInfo}
          countriesList={countriesList}
          vehicles={vehicles}
        />
      </main>

      {/* Section 16: Footer */}
      <Footer
        vehicles={vehicles}
        authInfo={authInfo}
        onSelectVehicle={handleOpenDetailModal}
        onOpenDashboard={handleOpenDashboard}
        onOpenPurchaseModal={() => handleOpenPurchaseModal()}
      />

      {/* Modals & Dialogs with Suspense boundaries */}
      <Suspense fallback={null}>
        {/* 1. Vehicle Detail Modal */}
        {selectedVehicleForDetail && (
          <VehicleDetailModal
            vehicle={selectedVehicleForDetail}
            onClose={handleCloseDetailModal}
            onRequestVehicle={(vehicle, configName, colorName) => {
              handleCloseDetailModal();
              handleOpenPurchaseModal(vehicle, configName, colorName);
            }}
          />
        )}

        {/* 2. Customer Purchase & Allocation Request Modal */}
        {purchaseModalOpen && (
          <PurchaseRequestModal
            isOpen={purchaseModalOpen}
            onClose={handleClosePurchaseModal}
            preferredVehicle={preferredVehicleForPurchase}
            preferredConfigName={preferredConfigName}
            preferredColorName={preferredColorName}
            vehicles={vehicles}
            countriesList={countriesList}
          />
        )}

        {/* 3. Private Management Dashboard */}
        {dashboardOpen && (
          <ManagementDashboard
            isOpen={dashboardOpen}
            onClose={handleCloseDashboard}
            vehicles={vehicles}
            onUpdateVehicles={(updated) => setVehicles(updated)}
            authInfo={authInfo}
            onUpdateAuthInfo={(updated) => setAuthInfo(updated)}
            countriesList={countriesList}
            onUpdateCountries={(updated) => setCountriesList(updated)}
          />
        )}
      </Suspense>
    </div>
  );
}
