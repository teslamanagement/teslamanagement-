import { ActivityLog, AuthorizationInfo, CountryData, CustomerInquiry, InquiryStatus, Vehicle } from '../types';
import { WORLDWIDE_COUNTRIES } from '../data/countries';
import { INITIAL_AUTH_INFO } from '../data/initialContent';
import { INITIAL_VEHICLES } from '../data/vehicles';
export { resolveAssetUrl } from '../utils/resolveAsset';

const TOKEN_STORAGE_KEY = 'tm_admin_bearer_token';

// Dedicated Key for Permanent Vehicle Image Persistence across all sessions & GitHub Pages
export const TESLA_VEHICLE_IMAGES_KEY = 'tesla_vehicle_images_v4';
export const VEHICLES_CACHE_KEY = 'tm_vehicles_cache_v4';
export const AUTH_INFO_CACHE_KEY = 'tm_auth_info_cache_v4';
export const DEFAULT_VEHICLES: Vehicle[] = INITIAL_VEHICLES;

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

/**
 * Apply Strict Image Persistence Priority Rule:
 * 1. Saved/custom image (savedVehicleImages[vehicleId] from localStorage / server)
 * 2. Stored vehicle image (from server/cache)
 * 3. Default image (from DEFAULT_VEHICLES)
 */
function applyVehicleImagePriority(
  rawVehicles: Vehicle[],
  savedImagesMap: Record<string, string>
): Vehicle[] {
  if (!Array.isArray(rawVehicles)) return [];

  return rawVehicles.map((v) => {
    const vehicle = { ...v };
    const defaultVehicle = DEFAULT_VEHICLES.find((d) => d.id === vehicle.id);
    const defaultImage = defaultVehicle?.imageUrl || '';

    // 1. Check if a custom/saved image exists for this specific model ID
    const savedCustomImage = savedImagesMap[vehicle.id];

    if (savedCustomImage && typeof savedCustomImage === 'string' && savedCustomImage.trim()) {
      const activeImage = savedCustomImage.trim();
      vehicle.imageUrl = activeImage;

      // Ensure galleryImages has the saved image at index 0 without losing other photos
      if (Array.isArray(vehicle.galleryImages) && vehicle.galleryImages.length > 0) {
        const cleanGallery = vehicle.galleryImages.filter((img) => typeof img === 'string' && img.trim());
        if (cleanGallery[0] !== activeImage) {
          vehicle.galleryImages = [
            activeImage,
            ...cleanGallery.filter((img) => img !== activeImage),
          ];
        } else {
          vehicle.galleryImages = cleanGallery;
        }
      } else {
        vehicle.galleryImages = [activeImage];
      }
    } else if (vehicle.imageUrl && typeof vehicle.imageUrl === 'string' && vehicle.imageUrl.trim()) {
      // 2. Use stored vehicle image
      vehicle.imageUrl = vehicle.imageUrl.trim();
      if (Array.isArray(vehicle.galleryImages)) {
        vehicle.galleryImages = vehicle.galleryImages.filter((img) => typeof img === 'string' && img.trim());
      }
    } else {
      // 3. Fallback to default image
      vehicle.imageUrl = defaultImage;
      if (!vehicle.galleryImages || vehicle.galleryImages.length === 0) {
        vehicle.galleryImages = defaultVehicle?.galleryImages ? [...defaultVehicle.galleryImages] : (defaultImage ? [defaultImage] : []);
      }
    }

    // Guard against empty imageUrl
    if (!vehicle.imageUrl && defaultImage) {
      vehicle.imageUrl = defaultImage;
    }
    if ((!vehicle.galleryImages || vehicle.galleryImages.length === 0) && vehicle.imageUrl) {
      vehicle.galleryImages = [vehicle.imageUrl];
    }

    return vehicle;
  });
}

export const storageService = {
  // ==========================================
  // Dedicated Vehicle Image Persistence Layer
  // ==========================================

  /**
   * Reads the persistent saved vehicle images dictionary from localStorage.
   * Returns a clean map of { [vehicleId: string]: string }.
   */
  getSavedVehicleImages(): Record<string, string> {
    try {
      const raw = localStorage.getItem(TESLA_VEHICLE_IMAGES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('[Storage] Error reading saved vehicle images map:', err);
    }
    return {};
  },

  /**
   * Permanently saves a custom image for a specific vehicle model.
   * Immediately updates localStorage under `tesla_vehicle_images`, updates active memory cache,
   * updates the vehicle catalog cache, and broadcasts a sync event.
   */
  saveVehicleImage(vehicleId: string, imageUrl: string): void {
    if (!vehicleId || typeof vehicleId !== 'string') return;
    const cleanId = vehicleId.trim();
    const cleanUrl = (imageUrl || '').trim();

    try {
      const currentMap = this.getSavedVehicleImages();
      if (cleanUrl) {
        currentMap[cleanId] = cleanUrl;
      } else {
        delete currentMap[cleanId];
      }
      localStorage.setItem(TESLA_VEHICLE_IMAGES_KEY, JSON.stringify(currentMap));

      // Update in-memory vehicles and persistent catalog cache with priority applied
      const currentVehicles = this.getVehicles();
      const updatedVehicles = applyVehicleImagePriority(currentVehicles, currentMap);
      cachedVehiclesMemory = updatedVehicles;

      try {
        localStorage.setItem(VEHICLES_CACHE_KEY, JSON.stringify(updatedVehicles));
      } catch {}

      // Broadcast sync event so all open views immediately update
      window.dispatchEvent(new CustomEvent('tm:vehicles_synced', { detail: updatedVehicles }));

      // Also notify server in background if session exists
      if (this.isAuthenticated() && cleanUrl) {
        fetch(`/api/admin/vehicle-images/${cleanId}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ imageUrl: cleanUrl }),
        }).catch(() => {});
      }
    } catch (err) {
      console.error('[Storage] Error saving vehicle image:', err);
    }
  },

  /**
   * Bulk updates saved vehicle images map.
   */
  saveAllVehicleImages(map: Record<string, string>): void {
    if (!map || typeof map !== 'object') return;
    try {
      const currentMap = this.getSavedVehicleImages();
      const merged = { ...currentMap, ...map };
      localStorage.setItem(TESLA_VEHICLE_IMAGES_KEY, JSON.stringify(merged));

      const currentVehicles = this.getVehicles();
      const updatedVehicles = applyVehicleImagePriority(currentVehicles, merged);
      cachedVehiclesMemory = updatedVehicles;
      try {
        localStorage.setItem(VEHICLES_CACHE_KEY, JSON.stringify(updatedVehicles));
      } catch {}
      window.dispatchEvent(new CustomEvent('tm:vehicles_synced', { detail: updatedVehicles }));
    } catch (err) {
      console.error('[Storage] Error saving all vehicle images:', err);
    }
  },

  /**
   * Removes a saved image override for a model, reverting it to default.
   */
  deleteSavedVehicleImage(vehicleId: string): void {
    if (!vehicleId) return;
    const currentMap = this.getSavedVehicleImages();
    delete currentMap[vehicleId];
    localStorage.setItem(TESLA_VEHICLE_IMAGES_KEY, JSON.stringify(currentMap));

    const currentVehicles = this.getVehicles();
    const updatedVehicles = applyVehicleImagePriority(currentVehicles, currentMap);
    cachedVehiclesMemory = updatedVehicles;
    try {
      localStorage.setItem(VEHICLES_CACHE_KEY, JSON.stringify(updatedVehicles));
    } catch {}
    window.dispatchEvent(new CustomEvent('tm:vehicles_synced', { detail: updatedVehicles }));
  },

  // ==========================================
  // Public Catalog Initial Synchronous Getters
  // ==========================================
  getVehicles(): Vehicle[] {
    const savedImages = this.getSavedVehicleImages();

    if (cachedVehiclesMemory && cachedVehiclesMemory.length > 0) {
      return applyVehicleImagePriority(cachedVehiclesMemory, savedImages);
    }

    try {
      const raw = localStorage.getItem(VEHICLES_CACHE_KEY);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const prioritized = applyVehicleImagePriority(parsed, savedImages);
          cachedVehiclesMemory = prioritized;
          return prioritized;
        }
      }
    } catch {
      // fallback
    }

    const defaultWithPriority = applyVehicleImagePriority(DEFAULT_VEHICLES, savedImages);
    cachedVehiclesMemory = defaultWithPriority;
    return defaultWithPriority;
  },

  getAuthInfo(): AuthorizationInfo {
    try {
      const raw = localStorage.getItem(AUTH_INFO_CACHE_KEY);
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

  // Fetch Public Vehicles from Server with strict image priority preservation
  async fetchVehicles(force = false): Promise<Vehicle[]> {
    const now = Date.now();
    const savedImages = this.getSavedVehicleImages();

    // Cache for 30 seconds unless forced
    if (!force && cachedVehiclesMemory && now - lastVehiclesFetchTime < 30000) {
      return applyVehicleImagePriority(cachedVehiclesMemory, savedImages);
    }

    if (pendingVehiclesPromise) {
      return pendingVehiclesPromise;
    }

    pendingVehiclesPromise = (async () => {
      try {
        const [vehiclesRes, imagesRes] = await Promise.all([
          fetch('/api/vehicles'),
          fetch('/api/vehicle-images').catch(() => null),
        ]);

        let serverSavedImages: Record<string, string> = {};
        if (imagesRes && imagesRes.ok) {
          try {
            serverSavedImages = await imagesRes.json();
          } catch {}
        }

        if (vehiclesRes.ok) {
          const data = await vehiclesRes.json();
          if (Array.isArray(data)) {
            // Merge server saved images into local saved images without clobbering existing local ones
            const localSaved = this.getSavedVehicleImages();
            const combinedSaved: Record<string, string> = { ...serverSavedImages, ...localSaved };

            // Also check data items: if a vehicle has an imageUrl that differs from default, persist it into combinedSaved
            data.forEach((v: Vehicle) => {
              const def = DEFAULT_VEHICLES.find((d) => d.id === v.id);
              if (v.imageUrl && def && v.imageUrl !== def.imageUrl && !combinedSaved[v.id]) {
                combinedSaved[v.id] = v.imageUrl;
              }
            });

            try {
              localStorage.setItem(TESLA_VEHICLE_IMAGES_KEY, JSON.stringify(combinedSaved));
            } catch {}

            const merged = applyVehicleImagePriority(data, combinedSaved);
            cachedVehiclesMemory = merged;
            lastVehiclesFetchTime = Date.now();

            try {
              localStorage.setItem(VEHICLES_CACHE_KEY, JSON.stringify(merged));
            } catch {}

            window.dispatchEvent(new CustomEvent('tm:vehicles_synced', { detail: merged }));
            return merged;
          }
        }
      } catch (err) {
        console.warn('Could not fetch vehicles from server API, using saved local data:', err);
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
            localStorage.setItem(AUTH_INFO_CACHE_KEY, JSON.stringify(data));
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
    if (!dataUrl || typeof dataUrl !== 'string') {
      return { success: false, error: 'Invalid image data' };
    }

    const cleanDataUrl = dataUrl.trim();

    // If already a hosted URL (e.g. https://... or /uploads/...), return immediately
    if (!cleanDataUrl.startsWith('data:image/')) {
      return { success: true, url: cleanDataUrl };
    }

    if (!this.isAuthenticated()) {
      // Graceful fallback for non-auth / local preview
      if (vehicleId) {
        this.saveVehicleImage(vehicleId, cleanDataUrl);
      }
      return { success: true, url: cleanDataUrl };
    }

    try {
      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ dataUrl: cleanDataUrl, vehicleId, filename }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.url) {
          if (vehicleId) {
            this.saveVehicleImage(vehicleId, json.url);
          }
          return { success: true, url: json.url };
        }
      }

      // If server responded with a non-200, fallback gracefully to cleanDataUrl
      if (vehicleId) {
        this.saveVehicleImage(vehicleId, cleanDataUrl);
      }
      return { success: true, url: cleanDataUrl };
    } catch {
      // Network or environment fallback: persist locally and return cleanDataUrl
      if (vehicleId) {
        this.saveVehicleImage(vehicleId, cleanDataUrl);
      }
      return { success: true, url: cleanDataUrl };
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
      if (vehicle.id && vehicle.imageUrl) {
        // Immediately save the image locally
        this.saveVehicleImage(vehicle.id, vehicle.imageUrl);
      }

      const res = await fetch(`/api/admin/vehicles/${vehicle.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(vehicle),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error || 'Failed to save vehicle' };
      }
      if (json.vehicles && Array.isArray(json.vehicles)) {
        const savedImages = this.getSavedVehicleImages();
        const prioritized = applyVehicleImagePriority(json.vehicles, savedImages);
        cachedVehiclesMemory = prioritized;
        try {
          localStorage.setItem(VEHICLES_CACHE_KEY, JSON.stringify(prioritized));
        } catch {}
        window.dispatchEvent(new CustomEvent('tm:vehicles_synced', { detail: prioritized }));
        return { success: true, vehicles: prioritized };
      }
      return { success: true, vehicles: this.getVehicles() };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error saving vehicle' };
    }
  },

  async deleteVehicle(id: string): Promise<{ success: boolean; vehicles?: Vehicle[]; error?: string }> {
    try {
      this.deleteSavedVehicleImage(id);
      const res = await fetch(`/api/admin/vehicles/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error || 'Failed to delete vehicle' };
      }
      if (json.vehicles && Array.isArray(json.vehicles)) {
        const savedImages = this.getSavedVehicleImages();
        const prioritized = applyVehicleImagePriority(json.vehicles, savedImages);
        cachedVehiclesMemory = prioritized;
        try {
          localStorage.setItem(VEHICLES_CACHE_KEY, JSON.stringify(prioritized));
        } catch {}
        window.dispatchEvent(new CustomEvent('tm:vehicles_synced', { detail: prioritized }));
        return { success: true, vehicles: prioritized };
      }
      return { success: true, vehicles: this.getVehicles() };
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
