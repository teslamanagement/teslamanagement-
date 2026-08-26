import React, { useState, useEffect } from 'react';
import {
  X, Lock, ShieldCheck, Car, DollarSign, Users, FileText, Globe,
  Activity, Plus, Trash2, Edit3, Save, CheckCircle2, AlertCircle,
  LogOut, RefreshCw, Download, Search, Filter, Phone, Mail, ChevronRight,
  ExternalLink, Key, Eye, EyeOff, Copy, Loader2
} from 'lucide-react';
import { ActivityLog, AuthorizationInfo, CountryData, CustomerInquiry, InquiryStatus, Vehicle } from '../../types';
import { storageService } from '../../services/storage';
import { validateAndNormalizePhone } from '../../utils/phoneValidator';
import { TeslaLogo } from '../TeslaLogo';
import { TeslaWordmark } from '../TeslaWordmark';
import { VehicleMediaManager } from './VehicleMediaManager';
import { resolveAssetUrl } from '../../utils/resolveAsset';

interface ManagementDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  onUpdateVehicles: (vehicles: Vehicle[]) => void;
  authInfo: AuthorizationInfo;
  onUpdateAuthInfo: (info: AuthorizationInfo) => void;
  countriesList: CountryData[];
  onUpdateCountries: (countries: CountryData[]) => void;
}

type TabType = 'inquiries' | 'vehicles' | 'pricing' | 'content' | 'countries' | 'logs';

export const ManagementDashboard: React.FC<ManagementDashboardProps> = ({
  isOpen,
  onClose,
  vehicles,
  onUpdateVehicles,
  authInfo,
  onUpdateAuthInfo,
  countriesList,
  onUpdateCountries,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState<boolean>(true);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('inquiries');

  // Inquiries State
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('all');
  const [inquirySearch, setInquirySearch] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<CustomerInquiry | null>(null);
  const [inquiryNote, setInquiryNote] = useState('');

  // Vehicle Edit State
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [isSavingVehicle, setIsSavingVehicle] = useState(false);

  // Content/Auth Info Edit State
  const [editAuth, setEditAuth] = useState<AuthorizationInfo>(authInfo);
  const [newPasscodeSetting, setNewPasscodeSetting] = useState('');

  // Country Test State
  const [countrySearch, setCountrySearch] = useState('');
  const [testPhoneCountryIso, setTestPhoneCountryIso] = useState('US');
  const [testPhoneRaw, setTestPhoneRaw] = useState('');

  // Activity Logs State
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // Toast / Status Message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      setIsVerifyingAuth(true);
      storageService.verifySession().then((valid) => {
        if (!isMounted) return;
        setIsAuthenticated(valid);
        setIsVerifyingAuth(false);
        if (valid) {
          refreshData();
        } else {
          setInquiries([]);
          setLogs([]);
        }
      }).catch(() => {
        if (!isMounted) return;
        setIsAuthenticated(false);
        setIsVerifyingAuth(false);
      });
    } else {
      setIsVerifyingAuth(false);
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const refreshData = async () => {
    const [fetchedInquiries, fetchedLogs, fetchedAuth] = await Promise.all([
      storageService.getInquiries(),
      storageService.getActivityLogs(),
      storageService.fetchAuthInfo(),
    ]);
    setInquiries(fetchedInquiries);
    setLogs(fetchedLogs);
    setEditAuth(fetchedAuth);
  };

  const handleUpdatePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasscodeSetting.trim()) return;
    if (newPasscodeSetting.trim().length < 8) {
      showToast('Passcode must be at least 8 characters long');
      return;
    }
    const result = await storageService.updatePasscode(newPasscodeSetting.trim());
    if (result.success) {
      setNewPasscodeSetting('');
      showToast('Management portal master passcode updated securely');
      const fetchedLogs = await storageService.getActivityLogs();
      setLogs(fetchedLogs);
    } else {
      showToast(result.error || 'Failed to update passcode');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!passcode.trim()) {
      setAuthError('Please enter your management passcode.');
      return;
    }
    const result = await storageService.login(passcode.trim());
    if (result.success) {
      setIsAuthenticated(true);
      setAuthError('');
      setPasscode('');
      await refreshData();
      showToast('Authenticated as Authorized Management Representative');
    } else {
      setAuthError(result.error || 'Invalid management passcode. Access restricted to authorized personnel.');
    }
  };

  const handleLogout = async () => {
    await storageService.logout();
    setIsAuthenticated(false);
    setInquiries([]);
    setLogs([]);
    showToast('Management session ended');
  };

  // Inquiry actions
  const handleUpdateInquiryStatus = async (id: string, status: InquiryStatus) => {
    const res = await storageService.updateInquiryStatus(id, status);
    if (res.success) {
      await refreshData();
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(prev => prev ? { ...prev, status } : null);
      }
      showToast(`Inquiry status updated to ${status}`);
    } else {
      showToast(res.error || 'Failed to update status');
    }
  };

  const handleAddInquiryNote = async (id: string) => {
    if (!inquiryNote.trim()) return;
    const res = await storageService.updateInquiryStatus(id, selectedInquiry?.status || 'New', inquiryNote.trim());
    if (res.success) {
      setInquiryNote('');
      await refreshData();
      showToast('Internal note appended');
    } else {
      showToast(res.error || 'Failed to add note');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (window.confirm('Delete this inquiry record?')) {
      const res = await storageService.deleteInquiry(id);
      if (res.success) {
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
        await refreshData();
        showToast('Inquiry record removed');
      } else {
        showToast(res.error || 'Failed to delete inquiry');
      }
    }
  };

  const handleExportInquiries = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(inquiries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Tesla_Management_Inquiries_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported inquiries dataset');
  };

  // Vehicle actions
  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle || isSavingVehicle) return;

    setIsSavingVehicle(true);
    try {
      const res = await storageService.saveVehicle(editingVehicle);
      if (res.success && res.vehicles) {
        onUpdateVehicles(res.vehicles);
        setEditingVehicle(null);
        setIsAddingVehicle(false);
        await refreshData();
        showToast(`Permanently saved specifications & media for ${editingVehicle.name}`);
      } else {
        showToast(res.error || 'Failed to save vehicle');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error saving vehicle');
    } finally {
      setIsSavingVehicle(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this vehicle from the published catalog?')) {
      const res = await storageService.deleteVehicle(id);
      if (res.success && res.vehicles) {
        onUpdateVehicles(res.vehicles);
        await refreshData();
        showToast('Vehicle removed from catalog');
      } else {
        showToast(res.error || 'Failed to delete vehicle');
      }
    }
  };

  const handleCreateNewVehicle = () => {
    const newVeh: Vehicle = {
      id: `custom-veh-${Date.now()}`,
      name: 'New Tesla Model',
      modelCode: 'TM-NEW',
      tagline: 'All-Electric Platform',
      description: 'Authorized description of verified features and capabilities.',
      category: 'sedan',
      imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1600&q=80',
      galleryImages: [],
      specs: {
        range: '300 miles',
        acceleration: '3.9s 0-60 mph',
        topSpeed: '140 mph',
        drivetrain: 'Dual Motor AWD',
        seating: '5 Adults',
      },
      configurations: [
        {
          id: 'cfg-1',
          name: 'Standard AWD',
          range: '300 miles',
          acceleration: '3.9s',
          topSpeed: '140 mph',
          drivetrain: 'Dual Motor AWD',
          basePrice: 35000,
        },
      ],
      originalPrice: 45000,
      promotionalPrice: 32000,
      promotionalLabel: 'Management Promotional Price',
      availability: 'Available for Order',
      isFeatured: false,
      performanceHighlights: ['High efficiency dual electric motors'],
      interiorHighlights: ['Premium acoustic glass cabin'],
      safetyHighlights: ['Rigid passenger safety structure'],
      chargingHighlights: ['Supercharging compatible'],
    };
    setEditingVehicle(newVeh);
    setIsAddingVehicle(true);
  };

  // Auth / Content Save
  const handleSaveAuthInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await storageService.saveAuthInfo(editAuth);
    if (res.success && res.authInfo) {
      onUpdateAuthInfo(res.authInfo);
      await refreshData();
      showToast('Updated official authorization information');
    } else {
      showToast(res.error || 'Failed to update authorization info');
    }
  };

  // Factory Reset
  const handleFactoryReset = async () => {
    if (window.confirm('Reset all vehicles, authorization details, and pricing back to verified defaults? Inquiries will be preserved.')) {
      const res = await storageService.resetToFactory();
      if (res.success) {
        if (res.vehicles) onUpdateVehicles(res.vehicles);
        if (res.authInfo) onUpdateAuthInfo(res.authInfo);
        if (res.countries) onUpdateCountries(res.countries);
        await refreshData();
        showToast('Restored catalog to factory baseline');
      } else {
        showToast(res.error || 'Failed to reset settings');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div
        id="management-dashboard-window"
        className="relative w-full max-w-7xl bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden text-neutral-900 h-[94vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-neutral-200 bg-[#F8F9FA] flex-shrink-0">
          <div className="flex items-center space-x-3">
            <TeslaLogo className="w-8 h-8 flex-shrink-0" />
            <div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5">
                  <TeslaWordmark className="h-3.5 w-auto text-neutral-900" />
                  <span className="font-light text-xs tracking-wider uppercase text-neutral-600">
                    MANAGEMENT
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-mono font-bold">
                  Private Portal
                </span>
              </div>
              <span className="text-[11px] text-neutral-500">
                Tesla Management Operations & Client Assistance Portal
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {toastMessage && (
              <span className="hidden sm:inline-block px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-in fade-in">
                {toastMessage}
              </span>
            )}

            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-700 text-xs flex items-center space-x-1.5 cursor-pointer border border-neutral-200 shadow-2xs"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5 text-neutral-500" />
                <span className="hidden sm:inline font-medium">Log Out</span>
              </button>
            )}

            <button
              type="button"
              id="close-dashboard-btn"
              onClick={onClose}
              className="p-2 rounded-lg bg-white hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 border border-neutral-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="flex-1 flex items-center justify-center p-6 bg-[#F8F9FA]">
            <div className="max-w-md w-full p-8 rounded-2xl bg-white border border-neutral-200 shadow-xl text-center space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-600 mx-auto flex items-center justify-center shadow-xs">
                <Lock className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-neutral-900">Management Portal Access</h3>
                <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                  Enter your management credentials to access customer inquiries, vehicle configurations, promotional pricing, and settings.
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2 text-left">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="text-left">
                  <label htmlFor="dash-passcode" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Management Passcode
                  </label>
                  <input
                    type="password"
                    id="dash-passcode"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter management passcode"
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 font-mono placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 shadow-2xs"
                  />
                </div>

                <button
                  type="submit"
                  id="btn-login-dashboard"
                  className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs flex items-center justify-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Unlock Management Portal</span>
                </button>
              </form>

              <div className="p-3 rounded-xl bg-[#F8F9FA] border border-neutral-200 text-[11px] text-neutral-500 flex items-center justify-center space-x-2">
                <Lock className="w-3.5 h-3.5 text-neutral-400" />
                <span>Management Personnel Only • Secure Portal</span>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard Tabs & Views */
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-white">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-64 bg-[#F8F9FA] border-b lg:border-b-0 lg:border-r border-neutral-200 p-3 flex lg:flex-col justify-between overflow-x-auto lg:overflow-visible flex-shrink-0">
              <div className="flex lg:flex-col space-x-1 lg:space-x-0 lg:space-y-1 w-full">
                <button
                  type="button"
                  id="tab-inquiries"
                  onClick={() => { setActiveTab('inquiries'); setEditingVehicle(null); }}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'inquiries'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-neutral-700 hover:bg-white hover:text-neutral-900 border border-transparent hover:border-neutral-200'
                  }`}
                >
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span>Customer Inquiries</span>
                  {inquiries.filter(i => i.status === 'New').length > 0 && (
                    <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-red-600 shadow-2xs">
                      {inquiries.filter(i => i.status === 'New').length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  id="tab-vehicles"
                  onClick={() => { setActiveTab('vehicles'); }}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'vehicles'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-neutral-700 hover:bg-white hover:text-neutral-900 border border-transparent hover:border-neutral-200'
                  }`}
                >
                  <Car className="w-4 h-4 flex-shrink-0" />
                  <span>Vehicles Catalog</span>
                </button>

                <button
                  type="button"
                  id="tab-pricing"
                  onClick={() => { setActiveTab('pricing'); setEditingVehicle(null); }}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'pricing'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-neutral-700 hover:bg-white hover:text-neutral-900 border border-transparent hover:border-neutral-200'
                  }`}
                >
                  <DollarSign className="w-4 h-4 flex-shrink-0" />
                  <span>Special Pricing</span>
                </button>

                <button
                  type="button"
                  id="tab-content"
                  onClick={() => { setActiveTab('content'); setEditingVehicle(null); }}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'content'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-neutral-700 hover:bg-white hover:text-neutral-900 border border-transparent hover:border-neutral-200'
                  }`}
                >
                  <FileText className="w-4 h-4 flex-shrink-0" />
                  <span>Desk & Settings</span>
                </button>

                <button
                  type="button"
                  id="tab-countries"
                  onClick={() => { setActiveTab('countries'); setEditingVehicle(null); }}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'countries'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-neutral-700 hover:bg-white hover:text-neutral-900 border border-transparent hover:border-neutral-200'
                  }`}
                >
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <span>Country & Phone Data</span>
                </button>

                <button
                  type="button"
                  id="tab-logs"
                  onClick={() => { setActiveTab('logs'); setEditingVehicle(null); }}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'logs'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-neutral-700 hover:bg-white hover:text-neutral-900 border border-transparent hover:border-neutral-200'
                  }`}
                >
                  <Activity className="w-4 h-4 flex-shrink-0" />
                  <span>Activity Logs</span>
                </button>
              </div>

              <div className="hidden lg:block pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={handleFactoryReset}
                  className="w-full py-2 px-3 rounded-xl text-[11px] text-neutral-600 hover:text-red-600 hover:bg-white border border-neutral-200 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Restore Factory Baseline</span>
                </button>
              </div>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
              {/* TAB 1: CUSTOMER INQUIRIES */}
              {activeTab === 'inquiries' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900 flex items-center space-x-2">
                        <Users className="w-5 h-5 text-red-600" />
                        <span>Customer Purchase & Allocation Inquiries</span>
                      </h3>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Manage submitted inquiries, review international contact records, and track client progression.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleExportInquiries}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer self-start sm:self-auto border border-neutral-200 shadow-2xs"
                    >
                      <Download className="w-4 h-4 text-neutral-500" />
                      <span>Export Inquiries ({inquiries.length})</span>
                    </button>
                  </div>

                  {/* Filters and Search */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={inquirySearch}
                        onChange={(e) => setInquirySearch(e.target.value)}
                        placeholder="Search by customer name, email, model, or country..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 shadow-2xs"
                      />
                    </div>

                    <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
                      {['all', 'New', 'Contacted', 'Processing', 'Completed', 'Archived'].map((status) => (
                        <button
                          key={status}
                          onClick={() => setInquiryStatusFilter(status)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                            inquiryStatusFilter === status
                              ? 'bg-red-600 text-white shadow-2xs'
                              : 'bg-[#F8F9FA] text-neutral-600 hover:text-neutral-900 border border-neutral-200'
                          }`}
                        >
                          {status === 'all' ? 'All' : status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Inquiries Table / Master-Detail Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* List Column */}
                    <div className="lg:col-span-6 space-y-2.5 max-h-[60vh] overflow-y-auto">
                      {inquiries
                        .filter((inq) => {
                          const matchStatus = inquiryStatusFilter === 'all' || inq.status === inquiryStatusFilter;
                          const matchQuery =
                            inq.fullName.toLowerCase().includes(inquirySearch.toLowerCase()) ||
                            inq.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
                            inq.preferredModel.toLowerCase().includes(inquirySearch.toLowerCase()) ||
                            inq.countryName.toLowerCase().includes(inquirySearch.toLowerCase());
                          return matchStatus && matchQuery;
                        })
                        .map((inq) => (
                          <div
                            key={inq.id}
                            onClick={() => setSelectedInquiry(inq)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                              selectedInquiry?.id === inq.id
                                ? 'bg-red-50/40 border-red-500 ring-1 ring-red-500 shadow-xs'
                                : 'bg-[#F8F9FA] border-neutral-200 hover:bg-neutral-100/60'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-sm text-neutral-900">{inq.fullName}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-neutral-600 font-mono border border-neutral-200">
                                  {inq.countryIsoCode}
                                </span>
                              </div>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  inq.status === 'New'
                                    ? 'bg-red-50 text-red-700 border-red-200'
                                    : inq.status === 'Contacted'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : inq.status === 'Processing'
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : inq.status === 'Completed'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                                }`}
                              >
                                {inq.status}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-xs text-neutral-500">
                              <span className="text-red-600 font-semibold">{inq.preferredModel}</span>
                              <span className="font-mono text-[11px]">
                                {new Date(inq.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="text-[11px] text-neutral-500 mt-1 truncate">
                              {inq.countryName} • {inq.normalizedPhoneNumber || `${inq.countryDialingCode} ${inq.phoneNumber}`}
                            </div>
                          </div>
                        ))}

                      {inquiries.length === 0 && (
                        <div className="p-8 text-center bg-[#F8F9FA] rounded-2xl border border-neutral-200 text-neutral-500 text-xs">
                          No inquiries received yet. Inquiries submitted through the purchase modal or contact form will appear here.
                        </div>
                      )}
                    </div>

                    {/* Detail Card Column */}
                    <div className="lg:col-span-6">
                      {selectedInquiry ? (
                        <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-neutral-200 space-y-4 shadow-xs">
                          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                            <div>
                              <span className="text-[10px] font-mono text-neutral-500 uppercase block">Inquiry ID</span>
                              <h4 className="text-lg font-bold text-neutral-900">{selectedInquiry.fullName}</h4>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                              className="p-2 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-neutral-200"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Status Select */}
                          <div className="space-y-1.5">
                            <label className="block text-xs font-semibold uppercase text-neutral-700">
                              Workflow Status
                            </label>
                            <div className="grid grid-cols-5 gap-1.5">
                              {(['New', 'Contacted', 'Processing', 'Completed', 'Archived'] as InquiryStatus[]).map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => handleUpdateInquiryStatus(selectedInquiry.id, st)}
                                  className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                                    selectedInquiry.status === st
                                      ? 'bg-red-600 text-white shadow-2xs'
                                      : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Detail Grid */}
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-white border border-neutral-200">
                              <span className="text-neutral-500 uppercase font-mono text-[10px] block font-semibold">Email</span>
                              <a href={`mailto:${selectedInquiry.email}`} className="text-neutral-900 hover:underline truncate block font-medium">
                                {selectedInquiry.email}
                              </a>
                            </div>

                            <div className="p-3 rounded-xl bg-white border border-neutral-200">
                              <span className="text-neutral-500 uppercase font-mono text-[10px] block font-semibold">Phone (Normalized E.164)</span>
                              <span className="text-neutral-900 font-mono font-medium">{selectedInquiry.normalizedPhoneNumber || selectedInquiry.phoneNumber}</span>
                            </div>

                            <div className="p-3 rounded-xl bg-white border border-neutral-200">
                              <span className="text-neutral-500 uppercase font-mono text-[10px] block font-semibold">Country & Dial Code</span>
                              <span className="text-neutral-900">{selectedInquiry.countryName} ({selectedInquiry.countryDialingCode})</span>
                            </div>

                            <div className="p-3 rounded-xl bg-white border border-neutral-200">
                              <span className="text-neutral-500 uppercase font-mono text-[10px] block font-semibold">Purchase Method</span>
                              <span className="text-neutral-900 font-medium">{selectedInquiry.purchaseMethod}</span>
                            </div>

                            <div className="p-3 rounded-xl bg-white border border-neutral-200 sm:col-span-2">
                              <span className="text-neutral-500 uppercase font-mono text-[10px] block font-semibold">Requested Vehicle / Configuration</span>
                              <span className="text-red-600 font-bold">{selectedInquiry.preferredModel}</span>
                              {selectedInquiry.preferredConfiguration && (
                                <span className="text-neutral-700 ml-2 font-medium">({selectedInquiry.preferredConfiguration})</span>
                              )}
                            </div>
                          </div>

                          {selectedInquiry.message && (
                            <div className="p-3 rounded-xl bg-white border border-neutral-200 text-xs">
                              <span className="text-neutral-500 uppercase font-mono text-[10px] block mb-1 font-semibold">Customer Message</span>
                              <p className="text-neutral-800 leading-relaxed">{selectedInquiry.message}</p>
                            </div>
                          )}

                          {/* Notes */}
                          <div className="space-y-2 pt-2 border-t border-neutral-200">
                            <span className="text-xs font-semibold uppercase text-neutral-700 block">
                              Internal Management Notes
                            </span>
                            {selectedInquiry.notes && selectedInquiry.notes.length > 0 && (
                              <div className="space-y-1 max-h-24 overflow-y-auto">
                                {selectedInquiry.notes.map((note, idx) => (
                                  <div key={idx} className="p-2 rounded-lg bg-white border border-neutral-200 text-neutral-700 text-xs font-mono">
                                    {note}
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={inquiryNote}
                                onChange={(e) => setInquiryNote(e.target.value)}
                                placeholder="Add follow-up notes..."
                                className="flex-1 px-3 py-1.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 shadow-2xs"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddInquiryNote(selectedInquiry.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-semibold cursor-pointer shadow-2xs"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-12 text-center bg-[#F8F9FA] rounded-2xl border border-neutral-200 text-neutral-500 text-xs">
                          Select an inquiry from the list to view full customer contact data, country dialing credentials, and update status.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: VEHICLES MANAGEMENT */}
              {activeTab === 'vehicles' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900 flex items-center space-x-2">
                        <Car className="w-5 h-5 text-red-600" />
                        <span>Vehicle Catalog & Specifications</span>
                      </h3>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Manage published Tesla vehicle models, verified specifications, availability tags, and photo assets.
                      </p>
                    </div>

                    {!editingVehicle && (
                      <button
                        type="button"
                        onClick={handleCreateNewVehicle}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Vehicle</span>
                      </button>
                    )}
                  </div>

                  {editingVehicle ? (
                    <form onSubmit={handleSaveVehicle} className="p-6 rounded-2xl bg-[#F8F9FA] border border-neutral-200 space-y-6 shadow-xs">
                      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                        <h4 className="text-lg font-bold text-neutral-900">
                          {isAddingVehicle ? 'Add New Vehicle' : `Edit ${editingVehicle.name}`}
                        </h4>
                        <button
                          type="button"
                          onClick={() => { setEditingVehicle(null); setIsAddingVehicle(false); }}
                          className="text-xs text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-xl bg-white border border-neutral-200 shadow-2xs"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">Model Name</label>
                          <input
                            type="text"
                            required
                            value={editingVehicle.name}
                            onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">Model Code</label>
                          <input
                            type="text"
                            required
                            value={editingVehicle.modelCode}
                            onChange={(e) => setEditingVehicle({ ...editingVehicle, modelCode: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 font-mono shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">Availability Status</label>
                          <select
                            value={editingVehicle.availability}
                            onChange={(e) => setEditingVehicle({ ...editingVehicle, availability: e.target.value as any })}
                            className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 shadow-2xs"
                          >
                            <option value="Available for Order">Available for Order</option>
                            <option value="Limited Allocation">Limited Allocation</option>
                            <option value="Reservation Inquiry">Reservation Inquiry</option>
                            <option value="Production Preview">Production Preview</option>
                            <option value="Custom Delivery">Custom Delivery</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">Tagline</label>
                          <input
                            type="text"
                            value={editingVehicle.tagline}
                            onChange={(e) => setEditingVehicle({ ...editingVehicle, tagline: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">Image URL</label>
                          <input
                            type="text"
                            value={editingVehicle.imageUrl}
                            onChange={(e) => setEditingVehicle({ ...editingVehicle, imageUrl: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 font-mono shadow-2xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={editingVehicle.description}
                          onChange={(e) => setEditingVehicle({ ...editingVehicle, description: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 shadow-2xs"
                        />
                      </div>

                      {/* Specs */}
                      <div className="space-y-3 pt-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 block">
                          Verified Technical Specifications
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[10px] text-neutral-500 uppercase font-mono mb-1 font-semibold">Range</label>
                            <input
                              type="text"
                              value={editingVehicle.specs.range}
                              onChange={(e) => setEditingVehicle({
                                ...editingVehicle,
                                specs: { ...editingVehicle.specs, range: e.target.value }
                              })}
                              className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 shadow-2xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-neutral-500 uppercase font-mono mb-1 font-semibold">0-60 mph Acceleration</label>
                            <input
                              type="text"
                              value={editingVehicle.specs.acceleration}
                              onChange={(e) => setEditingVehicle({
                                ...editingVehicle,
                                specs: { ...editingVehicle.specs, acceleration: e.target.value }
                              })}
                              className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 shadow-2xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-neutral-500 uppercase font-mono mb-1 font-semibold">Top Speed</label>
                            <input
                              type="text"
                              value={editingVehicle.specs.topSpeed}
                              onChange={(e) => setEditingVehicle({
                                ...editingVehicle,
                                specs: { ...editingVehicle.specs, topSpeed: e.target.value }
                              })}
                              className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 shadow-2xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-neutral-500 uppercase font-mono mb-1 font-semibold">Drivetrain</label>
                            <input
                              type="text"
                              value={editingVehicle.specs.drivetrain}
                              onChange={(e) => setEditingVehicle({
                                ...editingVehicle,
                                specs: { ...editingVehicle.specs, drivetrain: e.target.value }
                              })}
                              className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 shadow-2xs"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Pricing Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-200">
                        <div>
                          <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
                            Authorized Original/Reference Price (MSRP)
                          </label>
                          <input
                            type="number"
                            value={editingVehicle.originalPrice || ''}
                            onChange={(e) => setEditingVehicle({
                              ...editingVehicle,
                              originalPrice: e.target.value ? Number(e.target.value) : undefined
                            })}
                            placeholder="Leave empty if not authorized"
                            className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 font-mono shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
                            Management Promotional Price <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="number"
                            required
                            value={editingVehicle.promotionalPrice}
                            onChange={(e) => setEditingVehicle({
                              ...editingVehicle,
                              promotionalPrice: Number(e.target.value)
                            })}
                            className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 font-mono shadow-2xs"
                          />
                        </div>
                      </div>

                      {/* Image and Color Media Management */}
                      <VehicleMediaManager
                        vehicle={editingVehicle}
                        onChange={(updated) => setEditingVehicle(updated)}
                      />

                      <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
                        <button
                          type="button"
                          onClick={() => { setEditingVehicle(null); setIsAddingVehicle(false); }}
                          className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-semibold border border-neutral-200 shadow-2xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSavingVehicle}
                          className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 shadow-xs cursor-pointer"
                        >
                          {isSavingVehicle ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Saving to Disk...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span>Save Vehicle</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {vehicles.map((v) => (
                        <div
                          key={v.id}
                          className="p-4 rounded-2xl bg-[#F8F9FA] border border-neutral-200 space-y-3 flex flex-col justify-between shadow-2xs"
                        >
                          <div>
                            <div className="relative aspect-[16/9] mb-3 rounded-xl overflow-hidden bg-neutral-200 border border-neutral-200">
                              <img
                                src={resolveAssetUrl(v.imageUrl)}
                                alt={v.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs font-mono">
                                {(v.galleryImages?.length || 1)} photo{(v.galleryImages?.length || 1) > 1 ? 's' : ''}
                              </span>
                            </div>

                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-neutral-900 text-base">{v.name}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-white text-neutral-600 font-mono border border-neutral-200">
                                {v.modelCode}
                              </span>
                            </div>

                            <p className="text-xs text-neutral-600 line-clamp-2">{v.description}</p>

                            {/* Color swatches preview */}
                            {v.colors && v.colors.length > 0 && (
                              <div className="mt-2.5 pt-2 border-t border-neutral-200/80 flex items-center justify-between">
                                <span className="text-[10px] font-mono uppercase font-semibold text-neutral-500">
                                  {v.colors.length} Color{v.colors.length > 1 ? 's' : ''}
                                </span>
                                <div className="flex items-center -space-x-1">
                                  {v.colors.map((c) => (
                                    <span
                                      key={c.id}
                                      title={c.name}
                                      className="w-4 h-4 rounded-full border-2 border-white shadow-2xs"
                                      style={{ backgroundColor: c.hex }}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="mt-3 text-xs space-y-1">
                              <div className="flex justify-between">
                                <span className="text-neutral-500">Promotional:</span>
                                <span className="font-bold text-neutral-900 font-mono">${v.promotionalPrice.toLocaleString()}</span>
                              </div>
                              {v.originalPrice && (
                                <div className="flex justify-between text-neutral-500">
                                  <span>Original:</span>
                                  <span className="line-through font-mono text-neutral-400">${v.originalPrice.toLocaleString()}</span>
                                </div>
                              )}
                              <div className="flex justify-between text-neutral-600">
                                <span>Status:</span>
                                <span className="text-emerald-700 font-semibold">{v.availability}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 pt-2 border-t border-neutral-200">
                            <button
                              type="button"
                              onClick={() => { setEditingVehicle(v); setIsAddingVehicle(false); }}
                              className="flex-1 py-1.5 px-3 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-semibold flex items-center justify-center space-x-1 cursor-pointer border border-neutral-200 shadow-2xs"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-neutral-500" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteVehicle(v.id)}
                              className="p-1.5 rounded-xl bg-white hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer border border-neutral-200"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SPECIAL PRICING MANAGEMENT */}
              {activeTab === 'pricing' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                      <span>Special Promotional Pricing Configuration</span>
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Configure authorized promotional figures, reference MSRPs, crossed-out display, effective windows, and pricing terms.
                    </p>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F8F9FA] text-neutral-600 uppercase font-mono text-[11px] border-b border-neutral-200">
                        <tr>
                          <th className="p-3.5 font-bold">Model</th>
                          <th className="p-3.5 font-bold">Original / Ref Price</th>
                          <th className="p-3.5 font-bold">Management Promotional Price</th>
                          <th className="p-3.5 font-bold">Promotional Label</th>
                          <th className="p-3.5 font-bold">Status & Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 text-neutral-700">
                        {vehicles.map((v) => (
                          <tr key={v.id} className="hover:bg-neutral-50">
                            <td className="p-3.5 font-bold text-neutral-900">
                              {v.name} <span className="text-[10px] text-neutral-500 block font-mono font-normal">{v.modelCode}</span>
                            </td>
                            <td className="p-3.5 font-mono">
                              {v.originalPrice ? (
                                <span className="line-through text-neutral-400 font-medium">
                                  ${v.originalPrice.toLocaleString()}
                                </span>
                              ) : (
                                <span className="text-neutral-400 italic">Not supplied</span>
                              )}
                            </td>
                            <td className="p-3.5 font-mono font-bold text-neutral-900 text-sm">
                              ${v.promotionalPrice.toLocaleString()}
                            </td>
                            <td className="p-3.5 text-neutral-600">
                              {v.promotionalLabel || 'Management Promotional Price'}
                            </td>
                            <td className="p-3.5">
                              <button
                                type="button"
                                onClick={() => { setActiveTab('vehicles'); setEditingVehicle(v); }}
                                className="px-3 py-1 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 font-semibold cursor-pointer border border-neutral-200 shadow-2xs"
                              >
                                Edit Rate
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-neutral-200 text-xs text-neutral-600 leading-relaxed">
                    <span className="font-bold text-neutral-900 block mb-1">Pricing Publication Guidelines:</span>
                    Original reference prices should only be included and crossed out when comparative baseline data exists. If an original reference price is omitted, only the Management Promotional Price is displayed without artificial strikethroughs.
                  </div>
                </div>
              )}

              {/* TAB 4: DESK & SETTINGS */}
              {activeTab === 'content' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-red-600" />
                      <span>Management Desk & Content Settings</span>
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Update official representative information, contact channels, office location, and legal disclaimer.
                    </p>
                  </div>

                  <form onSubmit={handleSaveAuthInfo} className="p-6 rounded-2xl bg-[#F8F9FA] border border-neutral-200 space-y-5 shadow-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
                          Representative Desk Name
                        </label>
                        <input
                          type="text"
                          required
                          value={editAuth.representativeName}
                          onChange={(e) => setEditAuth({ ...editAuth, representativeName: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 shadow-2xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
                          Management Desk Function / Title
                        </label>
                        <input
                          type="text"
                          required
                          value={editAuth.authorizedTitle}
                          onChange={(e) => setEditAuth({ ...editAuth, authorizedTitle: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 shadow-2xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
                          Official Management Email
                        </label>
                        <input
                          type="email"
                          required
                          value={editAuth.officialEmail}
                          onChange={(e) => setEditAuth({ ...editAuth, officialEmail: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 shadow-2xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
                          Official Telephone
                        </label>
                        <input
                          type="text"
                          required
                          value={editAuth.officialPhone}
                          onChange={(e) => setEditAuth({ ...editAuth, officialPhone: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 font-mono shadow-2xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
                          Office Location / Delivery Center
                        </label>
                        <input
                          type="text"
                          value={editAuth.officeLocation}
                          onChange={(e) => setEditAuth({ ...editAuth, officeLocation: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 shadow-2xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
                          Client Messaging Channel
                        </label>
                        <input
                          type="text"
                          value={editAuth.businessMessagingChannel}
                          onChange={(e) => setEditAuth({ ...editAuth, businessMessagingChannel: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 shadow-2xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
                        Official Legal Disclaimer
                      </label>
                      <textarea
                        rows={3}
                        value={editAuth.legalDisclaimer}
                        onChange={(e) => setEditAuth({ ...editAuth, legalDisclaimer: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 shadow-2xs"
                      />
                    </div>

                    <div className="flex justify-end pt-3 border-t border-neutral-200">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer shadow-xs"
                      >
                        <Save className="w-4 h-4" />
                        <span>Update Desk Settings</span>
                      </button>
                    </div>
                  </form>

                  {/* Passcode Security Management */}
                  <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-neutral-200 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Key className="w-5 h-5 text-amber-600" />
                        <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                          Management Portal Access Passcode
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                        256-Bit Protected
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600">
                      Manage the confidential security passcode used to unlock the authorized management administration portal.
                    </p>

                    <div className="p-4 rounded-xl bg-white border border-neutral-200 space-y-3 shadow-2xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase font-mono block font-semibold">Master Authorization Credential</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="font-mono text-sm font-bold text-neutral-900">
                              ••••••••••••••••••••
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 font-mono">
                              Server-Side Encrypted
                            </span>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-neutral-500 uppercase font-mono block font-semibold">Status</span>
                          <span className="inline-flex items-center space-x-1 text-xs text-emerald-700 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Active & Enforced</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleUpdatePasscode} className="space-y-3 pt-2">
                      <label className="block text-xs font-semibold uppercase text-neutral-700">
                        Update Management Passcode (Min 8 Characters)
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="password"
                          required
                          minLength={8}
                          value={newPasscodeSetting}
                          onChange={(e) => setNewPasscodeSetting(e.target.value)}
                          placeholder="Enter new master passcode"
                          className="flex-1 px-3 py-2 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 font-mono placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 shadow-2xs"
                        />
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 cursor-pointer transition-colors shadow-2xs"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Passcode</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 5: COUNTRY & PHONE REGISTRY */}
              {activeTab === 'countries' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <span>Worldwide Country & International Phone Registry</span>
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Maintain the ISO 3166-1 country dataset (240+ countries), international dialing codes, and test phone normalization.
                    </p>
                  </div>

                  {/* Phone Validation Tester */}
                  <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-neutral-200 space-y-4 shadow-xs">
                    <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                      Interactive International Phone Normalization Tester
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-neutral-700 mb-1 font-semibold">Select Country</label>
                        <select
                          value={testPhoneCountryIso}
                          onChange={(e) => setTestPhoneCountryIso(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 shadow-2xs"
                        >
                          {countriesList.map((c) => (
                            <option key={c.isoCode} value={c.isoCode}>
                              {c.flag} {c.name} ({c.dialCode}) [{c.isoCode}]
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs text-neutral-700 mb-1 font-semibold">Test Number Input</label>
                        <input
                          type="text"
                          value={testPhoneRaw}
                          onChange={(e) => setTestPhoneRaw(e.target.value)}
                          placeholder="e.g. 08031234567 or 4155552671"
                          className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 font-mono shadow-2xs"
                        />
                      </div>
                    </div>

                    {testPhoneRaw && (() => {
                      const testCountry = countriesList.find(c => c.isoCode === testPhoneCountryIso) || countriesList[0];
                      const result = validateAndNormalizePhone(testPhoneRaw, testCountry);
                      return (
                        <div className={`p-3.5 rounded-xl border text-xs font-mono space-y-1 ${
                          result.isValid ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-red-50 border-red-200 text-red-700'
                        }`}>
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <span className="font-bold">{result.isValid ? 'VALID' : 'INVALID'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Normalized E.164:</span>
                            <span className="font-bold text-neutral-900">{result.normalizedE164 || 'N/A'}</span>
                          </div>
                          {result.errorMessage && (
                            <div className="text-red-600 pt-1 font-sans">{result.errorMessage}</div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Country List Table */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                        Registered Supported Countries ({countriesList.length})
                      </h4>
                      <input
                        type="text"
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        placeholder="Filter country table..."
                        className="px-3 py-1.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 w-56 shadow-2xs"
                      />
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white max-h-72 overflow-y-auto shadow-2xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F8F9FA] text-neutral-600 font-mono text-[10px] uppercase sticky top-0 border-b border-neutral-200">
                          <tr>
                            <th className="p-2.5 font-bold">Flag</th>
                            <th className="p-2.5 font-bold">Country Name</th>
                            <th className="p-2.5 font-bold">ISO Code</th>
                            <th className="p-2.5 font-bold">Dialing Code</th>
                            <th className="p-2.5 font-bold">Expected Length</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 text-neutral-700">
                          {countriesList
                            .filter(c =>
                              c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
                              c.isoCode.toLowerCase().includes(countrySearch.toLowerCase()) ||
                              c.dialCode.includes(countrySearch)
                            )
                            .map((c) => (
                              <tr key={c.isoCode} className="hover:bg-neutral-50">
                                <td className="p-2.5 text-lg">{c.flag}</td>
                                <td className="p-2.5 font-medium text-neutral-900">{c.name}</td>
                                <td className="p-2.5 font-mono text-neutral-500">{c.isoCode}</td>
                                <td className="p-2.5 font-mono font-bold text-red-600">{c.dialCode}</td>
                                <td className="p-2.5 font-mono text-neutral-500">
                                  {c.minLength} - {c.maxLength} digits
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: ACTIVITY LOGS */}
              {activeTab === 'logs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900 flex items-center space-x-2">
                        <Activity className="w-5 h-5 text-red-600" />
                        <span>Management Activity & Security Audit Logs</span>
                      </h3>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Immutable log of administrative operations, customer inquiries, and pricing adjustments.
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white max-h-[65vh] overflow-y-auto shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F8F9FA] text-neutral-600 uppercase font-mono text-[10px] sticky top-0 border-b border-neutral-200">
                        <tr>
                          <th className="p-3 font-bold">Timestamp</th>
                          <th className="p-3 font-bold">Action</th>
                          <th className="p-3 font-bold">Category</th>
                          <th className="p-3 font-bold">Details</th>
                          <th className="p-3 font-bold">Actor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 text-neutral-700 font-mono text-[11px]">
                        {logs.map((log) => (
                          <tr key={log.id} className="hover:bg-neutral-50">
                            <td className="p-3 text-neutral-500 whitespace-nowrap">
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td className="p-3 font-bold text-neutral-900 whitespace-nowrap">
                              {log.action}
                            </td>
                            <td className="p-3">
                              <span className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[10px] font-semibold border border-neutral-200">
                                {log.category}
                              </span>
                            </td>
                            <td className="p-3 text-neutral-800 font-sans text-xs">
                              {log.details}
                            </td>
                            <td className="p-3 text-neutral-500 whitespace-nowrap">
                              {log.performedBy}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
