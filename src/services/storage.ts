import { ActivityLog, AuthorizationInfo, CountryData, CustomerInquiry, InquiryStatus, Vehicle } from '../types';
import { WORLDWIDE_COUNTRIES } from '../data/countries';
import { INITIAL_AUTH_INFO } from '../data/initialContent';
import { INITIAL_VEHICLES } from '../data/vehicles';

const TOKEN_STORAGE_KEY = 'tm_admin_bearer_token';

// In-Memory caches (Never persistent for sensitive inquiries/logs)
let cachedInquiries: CustomerInquiry[] = [];
let cachedLogs: ActivityLog[] = [];
let cachedVehiclesMemory: Vehicle[] | null = null;
let lastVehiclesFetchTime = 0;
let pendingVehiclesPromise: Promise<Vehicle[]> | null = null;

function getAuthHeaders(): HeadersInit {
  const token = sessionStorage.getItem(TOKEN_STORAGE_KEY);
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['x-admin-token'] = token;
  }
  return headers;
}

export const storageService = {
  // ==========================================
  // Public Catalog Initial Synchronous Getters
  // ==========================================
  getVehicles(): Vehicle[] {
    if (cachedVehiclesMemory && cachedVehiclesMemory.length > 0) {
      return cachedVehiclesMemory;
    }
    try {
      const raw = localStorage.getItem('tm_vehicles_cache_v1');
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cachedVehiclesMemory = parsed;
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    cachedVehiclesMemory = INITIAL_VEHICLES;
    return INITIAL_VEHICLES;
  },

  getAuthInfo(): AuthorizationInfo {
    try {
      const raw = localStorage.getItem('tm_auth_info_cache_v1');
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.authorizationNumber) return { ...INITIAL_AUTH_INFO, ...parsed };
      }
    } catch {
      // fallback
    }
    return INITIAL_AUTH_INFO;
  },

  getCountries(): CountryData[] {
    return WORLDWIDE_COUNTRIES;
  },

  // ==========================================
  // Asynchronous API Operations
  // ==========================================

  // Fetch Public Vehicles from Server (Single Persistent Source of Truth) with deduplication & memory cache
  async fetchVehicles(force = false): Promise<Vehicle[]> {
    const now = Date.now();
    // Cache for 30 seconds unless forced
    if (!force && cachedVehiclesMemory && now - lastVehiclesFetchTime < 30000) {
      return cachedVehiclesMemory;
    }

    if (pendingVehiclesPromise) {
      return pendingVehiclesPromise;
    }

    pendingVehiclesPromise = (async () => {
      try {
        const res = await fetch('/api/vehicles');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            cachedVehiclesMemory = data;
            lastVehiclesFetchTime = Date.now();
            try {
              localStorage.setItem('tm_vehicles_cache_v1', JSON.stringify(data));
            } catch {}
            window.dispatchEvent(new CustomEvent('tm:vehicles_synced', { detail: data }));
            return data;
          }
        }
      } catch (err) {
        console.warn('Could not fetch vehicles from server API, using cached data:', err);
      } finally {
        pendingVehiclesPromise = null;
      }
      return this.getVehicles();
    })();

    return pendingVehiclesPromise;
  },

  // Fetch Public Auth Info from Server
  async fetchAuthInfo(): Promise<AuthorizationInfo> {
    try {
      const res = await fetch('/api/auth-info');
      if (res.ok) {
        const data = await res.json();
        if (data && data.authorizationNumber) {
          try {
            localStorage.setItem('tm_auth_info_cache_v1', JSON.stringify(data));
          } catch {}
          return data;
        }
      }
    } catch (err) {
      console.warn('Could not fetch auth info from server API:', err);
    }
    return this.getAuthInfo();
  },

  // Fetch Public Countries from Server
  async fetchCountries(): Promise<CountryData[]> {
    try {
      const res = await fetch('/api/countries');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (err) {
      console.warn('Could not fetch countries from server API:', err);
    }
    return WORLDWIDE_COUNTRIES;
  },

  // Public Customer Inquiry Submission
  async addInquiry(inquiry: Omit<CustomerInquiry, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; inquiryId?: string; error?: string }> {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error || 'Failed to submit inquiry' };
      }
      return { success: true, inquiryId: json.inquiryId };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network communication error' };
    }
  },

  // ==========================================
  // Admin Authentication & Session Management
  // ==========================================

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY);
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    return Boolean(token && token.startsWith('tm_auth_'));
  },

  async login(passcode: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Authentication failed' };
      }

      if (data.token) {
        sessionStorage.setItem(TOKEN_STORAGE_KEY, data.token);
        return { success: true, token: data.token };
      }
      return { success: false, error: 'No authorization token returned' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Server connection error during login' };
    }
  },

  async verifySession(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const res = await fetch('/api/admin/verify-session', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json.valid === true && json.role === 'admin';
      }
      // If 401, clear local token
      if (res.status === 401 || res.status === 403) {
        this.clearSession();
      }
      return false;
    } catch {
      return false;
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch {
      // ignore network errors on logout
    } finally {
      this.clearSession();
    }
  },

  clearSession(): void {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    cachedInquiries = [];
    cachedLogs = [];
  },

  async updatePasscode(newPasscode: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/admin/change-passcode', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ newPasscode }),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error || 'Failed to update passcode' };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error updating passcode' };
    }
  },

  // ==========================================
  // Protected Admin Management Operations
  // ==========================================

  // ==========================================
  // Protected Admin Media Upload Operations
  // ==========================================
  async uploadImage(dataUrl: string, vehicleId?: string, filename?: string): Promise<{ success: boolean; url?: string; error?: string }> {
    if (!this.isAuthenticated()) {
      return { success: false, error: 'Authentication required to upload media' };
    }

    try {
      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ dataUrl, vehicleId, filename }),
      });

      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error || 'Failed to upload image' };
      }

      return { success: true, url: json.url };
    } catch (err: any) {
      console.error('Network error during image upload:', err);
      return { success: false, error: err?.message || 'Network error during image upload' };
    }
  },

  // Customer Inquiries (Protected - Server Only)
  async getInquiries(): Promise<CustomerInquiry[]> {
    if (!this.isAuthenticated()) return [];
    try {
      const res = await fetch('/api/admin/inquiries', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        cachedInquiries = await res.json();
        return cachedInquiries;
      }
    } catch (err) {
      console.warn('Error fetching inquiries from admin API:', err);
    }
    return cachedInquiries;
  },

  async updateInquiryStatus(id: string, status: InquiryStatus, note?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, note }),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error || 'Failed to update inquiry' };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error updating inquiry' };
    }
  },

  async deleteInquiry(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const json = await res.json();
        return { success: false, error: json.error || 'Failed to delete inquiry' };
      }
      cachedInquiries = cachedInquiries.filter(i => i.id !== id);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error deleting inquiry' };
    }
  },

  // Vehicles Catalog (Protected Mutations)
  async saveVehicle(vehicle: Vehicle): Promise<{ success: boolean; vehicles?: Vehicle[]; error?: string }> {
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicle.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(vehicle),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error || 'Failed to save vehicle' };
      }
      if (json.vehicles) {
        try {
          localStorage.setItem('tm_vehicles_cache_v1', JSON.stringify(json.vehicles));
        } catch {}
        window.dispatchEvent(new CustomEvent('tm:vehicles_synced', { detail: json.vehicles }));
      }
      return { success: true, vehicles: json.vehicles };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error saving vehicle' };
    }
  },

  async deleteVehicle(id: string): Promise<{ success: boolean; vehicles?: Vehicle[]; error?: string }> {
    try {
      const res = await fetch(`/api/admin/vehicles/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error || 'Failed to delete vehicle' };
      }
      if (json.vehicles) {
        try {
          localStorage.setItem('tm_vehicles_cache_v1', JSON.stringify(json.vehicles));
        } catch {}
        window.dispatchEvent(new CustomEvent('tm:vehicles_synced', { detail: json.vehicles }));
      }
      return { success: true, vehicles: json.vehicles };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error deleting vehicle' };
    }
  },

  // Official Authorization Info (Protected Mutation)
  async saveAuthInfo(info: AuthorizationInfo): Promise<{ success: boolean; authInfo?: AuthorizationInfo; error?: string }> {
    try {
      const res = await fetch('/api/admin/auth-info', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(info),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error || 'Failed to update authorization info' };
      }
      if (json.authInfo) {
        try {
          localStorage.setItem('tm_auth_info_cache_v1', JSON.stringify(json.authInfo));
        } catch {}
      }
      return { success: true, authInfo: json.authInfo };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error updating auth info' };
    }
  },

  // Countries (Protected Mutation)
  async saveCountries(countries: CountryData[]): Promise<{ success: boolean; countries?: CountryData[]; error?: string }> {
    try {
      const res = await fetch('/api/admin/countries', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(countries),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error || 'Failed to update countries' };
      }
      return { success: true, countries: json.countries };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error updating countries' };
    }
  },

  // Audit Activity Logs (Protected - Server Only)
  async getActivityLogs(): Promise<ActivityLog[]> {
    if (!this.isAuthenticated()) return [];
    try {
      const res = await fetch('/api/admin/logs', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        cachedLogs = await res.json();
        return cachedLogs;
      }
    } catch (err) {
      console.warn('Error fetching logs from admin API:', err);
    }
    return cachedLogs;
  },

  // Factory Reset (Protected)
  async resetToFactory(): Promise<{ success: boolean; vehicles?: Vehicle[]; authInfo?: AuthorizationInfo; countries?: CountryData[]; error?: string }> {
    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error || 'Failed to reset settings' };
      }
      try {
        if (json.vehicles) {
          localStorage.setItem('tm_vehicles_cache_v1', JSON.stringify(json.vehicles));
          window.dispatchEvent(new CustomEvent('tm:vehicles_synced', { detail: json.vehicles }));
        }
        if (json.authInfo) {
          localStorage.setItem('tm_auth_info_cache_v1', JSON.stringify(json.authInfo));
        }
      } catch {}
      return {
        success: true,
        vehicles: json.vehicles,
        authInfo: json.authInfo,
        countries: json.countries,
      };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error resetting settings' };
    }
  },
};
