import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { INITIAL_VEHICLES } from './src/data/vehicles';
import { INITIAL_AUTH_INFO } from './src/data/initialContent';
import { WORLDWIDE_COUNTRIES } from './src/data/countries';
import { ActivityLog, AuthorizationInfo, CountryData, CustomerInquiry, InquiryStatus, Vehicle } from './src/types';

dotenv.config();

// Persistent Disk Storage File & Uploads Directory
const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const PUBLIC_UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Helper: Convert Base64 data URL to permanent disk file in /data/uploads/ and /public/uploads/
function saveBase64ImageToDisk(dataUrlOrUrl: string, prefix = 'vehicle'): string {
  if (!dataUrlOrUrl || typeof dataUrlOrUrl !== 'string') return '';
  const trimmed = dataUrlOrUrl.trim();
  
  // If it is already a regular URL or relative upload path, return as-is
  if (!trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  try {
    const matches = trimmed.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (!matches || matches.length < 3) {
      return trimmed;
    }

    const rawType = matches[1].toLowerCase();
    let ext = '.jpg';
    if (rawType.includes('png')) ext = '.png';
    else if (rawType.includes('webp')) ext = '.webp';
    else if (rawType.includes('gif')) ext = '.gif';
    else if (rawType.includes('svg')) ext = '.svg';
    else if (rawType.includes('jpeg') || rawType.includes('jpg')) ext = '.jpg';

    const buffer = Buffer.from(matches[2], 'base64');
    const safePrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const filename = `${safePrefix}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);
    const publicFilePath = path.join(PUBLIC_UPLOADS_DIR, filename);

    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    if (!fs.existsSync(PUBLIC_UPLOADS_DIR)) {
      fs.mkdirSync(PUBLIC_UPLOADS_DIR, { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);
    fs.writeFileSync(publicFilePath, buffer);
    console.log(`[Uploads] Saved image to disk & public: ${filename} (${buffer.length} bytes)`);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('[Uploads] Error saving base64 image to disk:', err);
    return trimmed;
  }
}

// Recursively sanitize and extract any base64 images into disk files
function normalizeVehicleImages(v: Vehicle): Vehicle {
  if (!v) return v;
  const vehicle = { ...v };
  if (vehicle.imageUrl) {
    vehicle.imageUrl = saveBase64ImageToDisk(vehicle.imageUrl, `${vehicle.id || 'veh'}-main`);
  }
  if (Array.isArray(vehicle.galleryImages)) {
    vehicle.galleryImages = vehicle.galleryImages.map((img, idx) =>
      saveBase64ImageToDisk(img, `${vehicle.id || 'veh'}-gal-${idx}`)
    );
  }
  if (Array.isArray(vehicle.colors)) {
    vehicle.colors = vehicle.colors.map((col, colIdx) => {
      const colorCopy = { ...col };
      if (Array.isArray(colorCopy.images)) {
        colorCopy.images = colorCopy.images.map((img, idx) =>
          saveBase64ImageToDisk(img, `${vehicle.id || 'veh'}-col-${col.id || colIdx}-${idx}`)
        );
      }
      return colorCopy;
    });
  }
  return vehicle;
}

// In-Memory Secure State (Synchronized with Disk Storage)
let vehicles: Vehicle[] = JSON.parse(JSON.stringify(INITIAL_VEHICLES));
let savedVehicleImages: Record<string, string> = {};
let authInfo: AuthorizationInfo = JSON.parse(JSON.stringify(INITIAL_AUTH_INFO));
let countriesList: CountryData[] = JSON.parse(JSON.stringify(WORLDWIDE_COUNTRIES));
let inquiries: CustomerInquiry[] = [];
let activityLogs: ActivityLog[] = [
  {
    id: 'log-boot-1',
    timestamp: new Date().toISOString(),
    action: 'SYSTEM_BOOT',
    category: 'SECURITY',
    details: 'Tesla Management secure server initialized with authorized endpoints and role protection.',
    performedBy: 'System Core'
  }
];

// Master Admin Passcode (Configured server-side, never exposed to client bundles)
let adminPasscode = process.env.ADMIN_PASSCODE || 'vQ7$z5N2!rL9@xJK4#pT76&';

// Safe Disk Store Synchronizers
function initStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    if (!fs.existsSync(PUBLIC_UPLOADS_DIR)) {
      fs.mkdirSync(PUBLIC_UPLOADS_DIR, { recursive: true });
    }

    // Sync any pre-existing files from public/uploads to data/uploads
    if (fs.existsSync(PUBLIC_UPLOADS_DIR)) {
      const publicFiles = fs.readdirSync(PUBLIC_UPLOADS_DIR);
      for (const file of publicFiles) {
        const src = path.join(PUBLIC_UPLOADS_DIR, file);
        const dest = path.join(UPLOADS_DIR, file);
        if (fs.statSync(src).isFile() && !fs.existsSync(dest)) {
          fs.copyFileSync(src, dest);
        }
      }
    }

    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (data.savedVehicleImages && typeof data.savedVehicleImages === 'object' && !Array.isArray(data.savedVehicleImages)) {
        savedVehicleImages = data.savedVehicleImages;
      }
      if (Array.isArray(data.vehicles)) {
        // Automatically extract and migrate any legacy embedded base64 to disk files
        vehicles = data.vehicles.map(normalizeVehicleImages);
      }
      // Apply strict priority: 1. Saved/custom image, 2. Stored vehicle image (if valid remote or custom), 3. Default image
      vehicles = vehicles.map((v) => {
        const defaultVehicle = INITIAL_VEHICLES.find((d) => d.id === v.id);
        const customImg = savedVehicleImages[v.id];
        if (customImg && typeof customImg === 'string' && customImg.trim()) {
          const cleanImg = customImg.trim();
          v.imageUrl = cleanImg;
          if (Array.isArray(v.galleryImages) && v.galleryImages.length > 0) {
            if (v.galleryImages[0] !== cleanImg) {
              v.galleryImages = [cleanImg, ...v.galleryImages.filter((img) => img !== cleanImg)];
            }
          } else {
            v.galleryImages = [cleanImg];
          }
        } else if (v.imageUrl && typeof v.imageUrl === 'string' && v.imageUrl.trim()) {
          // Valid stored image URL (uploads path, remote URL, or base64)
          v.imageUrl = v.imageUrl.trim();
          if (!Array.isArray(v.galleryImages) || v.galleryImages.length === 0) {
            v.galleryImages = defaultVehicle?.galleryImages ? [...defaultVehicle.galleryImages] : [v.imageUrl];
          }
        } else {
          // Use default vehicle image from INITIAL_VEHICLES
          v.imageUrl = defaultVehicle?.imageUrl || '';
          if (defaultVehicle?.galleryImages) {
            v.galleryImages = [...defaultVehicle.galleryImages];
          }
        }
        return v;
      });

      if (data.authInfo && typeof data.authInfo === 'object') {
        authInfo = { ...INITIAL_AUTH_INFO, ...data.authInfo };
        if (authInfo.officialEmail === 'teslasemi60@gmail.com' || !authInfo.officialEmail) {
          authInfo.officialEmail = 'teslamanagementct@gmail.com';
        }
      }
      if (Array.isArray(data.countriesList)) {
        countriesList = data.countriesList;
      }
      if (Array.isArray(data.inquiries)) {
        inquiries = data.inquiries;
      }
      if (Array.isArray(data.activityLogs)) {
        activityLogs = data.activityLogs;
      }
      if (typeof data.adminPasscode === 'string' && data.adminPasscode.length >= 8) {
        adminPasscode = data.adminPasscode;
      }
      console.log(`[Store] Loaded ${vehicles.length} vehicles from persistent disk storage.`);
      saveStoreToDisk();
      return;
    }
  } catch (err) {
    console.error('[Store] Error reading persistent store, seeding initial database:', err);
  }

  saveStoreToDisk();
}

function saveStoreToDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const payload = {
      vehicles,
      savedVehicleImages,
      authInfo,
      countriesList,
      inquiries,
      activityLogs,
      adminPasscode,
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(STORE_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Store] Failed to write persistent store to disk:', err);
  }
}

// Initialize on boot
initStore();

interface SessionData {
  token: string;
  role: 'admin';
  createdAt: number;
  expiresAt: number;
  ip?: string;
  userAgent?: string;
}

// Active Admin Sessions Store: Token -> SessionData
const activeSessions = new Map<string, SessionData>();

// Session TTL: 24 Hours
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function addAuditLog(
  action: string,
  category: ActivityLog['category'],
  details: string,
  performedBy = 'Management Admin'
) {
  const newLog: ActivityLog = {
    id: `log-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    timestamp: new Date().toISOString(),
    action,
    category,
    details,
    performedBy
  };
  activityLogs.unshift(newLog);
  if (activityLogs.length > 300) activityLogs.length = 300;
}

// Helper: Timing-safe password verification
function verifyPasscode(input: string, stored: string): boolean {
  if (typeof input !== 'string' || typeof stored !== 'string') return false;
  const inputBuffer = Buffer.from(input.trim());
  const storedBuffer = Buffer.from(stored.trim());

  if (inputBuffer.length !== storedBuffer.length) {
    // Perform dummy comparison to prevent timing leak
    crypto.timingSafeEqual(inputBuffer, inputBuffer);
    return false;
  }
  return crypto.timingSafeEqual(inputBuffer, storedBuffer);
}

// Authentication & Authorization Middleware for Admin Routes
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const customHeader = req.headers['x-admin-token'];
  
  let token: string | undefined;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (typeof customHeader === 'string') {
    token = customHeader.trim();
  }

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized: Authentication token required for management dashboard.',
      code: 'UNAUTHORIZED'
    });
  }

  const session = activeSessions.get(token);
  if (!session) {
    return res.status(401).json({
      error: 'Unauthorized: Session invalid or has expired. Please log in again.',
      code: 'INVALID_SESSION'
    });
  }

  // Check TTL expiration
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return res.status(401).json({
      error: 'Unauthorized: Session expired. Please log in again.',
      code: 'SESSION_EXPIRED'
    });
  }

  // Check Role
  if (session.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden: Insufficient privileges. Admin role required.',
      code: 'FORBIDDEN'
    });
  }

  // Update expiration timestamp on activity (sliding window)
  session.expiresAt = Date.now() + SESSION_TTL_MS;
  (req as any).adminSession = session;
  next();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // HTTP Compression (gzip/deflate/brotli) for all responses
  app.use(compression({
    level: 6,
    threshold: 1024,
  }));

  // JSON & URL-encoded Body Parsers with 50MB limit (for seamless batch vehicle media uploads)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Static serving for persistent uploaded media files with caching headers
  app.use('/uploads', express.static(UPLOADS_DIR, {
    maxAge: '7d',
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
      res.setHeader('X-Content-Type-Options', 'nosniff');
    }
  }));
  app.use('/uploads', express.static(PUBLIC_UPLOADS_DIR, {
    maxAge: '7d',
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
      res.setHeader('X-Content-Type-Options', 'nosniff');
    }
  }));

  // Security Headers Middleware
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // ==========================================
  // PUBLIC API ENDPOINTS (No Admin Auth Required)
  // ==========================================

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 1. Get Public Vehicle Catalog (with cache-control)
  app.get('/api/vehicles', (_req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'public, max-age=15, stale-while-revalidate=60');
    res.json(vehicles);
  });

  // 1b. Get Public Saved Vehicle Images Map
  app.get('/api/vehicle-images', (_req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'public, max-age=5, stale-while-revalidate=30');
    res.json(savedVehicleImages);
  });

  // 2. Get Public Authorization Info (with cache-control)
  app.get('/api/auth-info', (_req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
    res.json(authInfo);
  });

  // 3. Get Public Supported Countries (with cache-control)
  app.get('/api/countries', (_req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    res.json(countriesList);
  });

  // 4. Submit Customer Vehicle Purchase Inquiry / Allocation Request
  app.post('/api/inquiries', (req: Request, res: Response) => {
    try {
      const {
        fullName,
        email,
        countryName,
        countryIsoCode,
        countryDialingCode,
        phoneNumber,
        normalizedPhoneNumber,
        stateOrRegion,
        preferredModel,
        preferredConfiguration,
        preferredColor,
        purchaseMethod,
        message,
      } = req.body;

      if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
        return res.status(400).json({
          error: 'Please provide your full legal name.',
          code: 'INVALID_NAME'
        });
      }

      if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
        return res.status(400).json({
          error: 'Please provide a valid email address.',
          code: 'INVALID_EMAIL'
        });
      }

      if (!phoneNumber || typeof phoneNumber !== 'string' || !phoneNumber.trim()) {
        return res.status(400).json({
          error: 'Please provide a valid contact telephone number.',
          code: 'INVALID_PHONE'
        });
      }

      if (!preferredModel || typeof preferredModel !== 'string' || !preferredModel.trim()) {
        return res.status(400).json({
          error: 'Please select a preferred Tesla model.',
          code: 'INVALID_MODEL'
        });
      }

      const newInquiry: CustomerInquiry = {
        id: `INQ-${Date.now()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        countryName: String(countryName || 'United States').trim(),
        countryIsoCode: String(countryIsoCode || 'US').trim(),
        countryDialingCode: String(countryDialingCode || '+1').trim(),
        phoneNumber: phoneNumber.trim(),
        normalizedPhoneNumber: String(normalizedPhoneNumber || phoneNumber).trim(),
        stateOrRegion: stateOrRegion ? String(stateOrRegion).trim() : undefined,
        preferredModel: preferredModel.trim(),
        preferredConfiguration: preferredConfiguration ? String(preferredConfiguration).trim() : undefined,
        preferredColor: preferredColor ? String(preferredColor).trim() : undefined,
        purchaseMethod: purchaseMethod === 'Cash' || purchaseMethod === 'Financing' ? purchaseMethod : 'Other',
        message: message ? String(message).trim() : undefined,
        status: 'New',
        createdAt: new Date().toISOString(),
        notes: [],
      };

      inquiries.unshift(newInquiry);
      saveStoreToDisk();
      addAuditLog(
        'INQUIRY_RECEIVED',
        'INQUIRY',
        `Inquiry received for ${newInquiry.preferredModel}${newInquiry.preferredColor ? ` (${newInquiry.preferredColor})` : ''} from ${newInquiry.fullName} (${newInquiry.countryName})`,
        'Public Customer Portal'
      );

      return res.status(201).json({
        success: true,
        inquiryId: newInquiry.id,
        inquiry: newInquiry,
        message: 'Your vehicle request has been successfully submitted and received by our management team.'
      });
    } catch (err: any) {
      console.error('[Inquiries] Error processing inquiry submission:', err);
      return res.status(500).json({
        error: "We couldn't submit your request right now. Please check your connection and try again.",
        code: 'INTERNAL_ERROR'
      });
    }
  });

  // ==========================================
  // AUTHENTICATION ENDPOINTS
  // ==========================================

  // 5. Admin Passcode Login
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { passcode } = req.body;

    if (!passcode || typeof passcode !== 'string') {
      return res.status(400).json({
        error: 'Passcode is required.',
        code: 'MISSING_PASSCODE'
      });
    }

    const isValid = verifyPasscode(passcode, adminPasscode);

    if (!isValid) {
      addAuditLog(
        'ADMIN_LOGIN_FAILED',
        'SECURITY',
        `Failed management portal login attempt from IP ${req.ip || 'unknown'}`,
        'Security Sentinel'
      );
      return res.status(401).json({
        error: 'Invalid management passcode. Access restricted to authorized personnel.',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Generate Cryptographically Secure Session Token
    const sessionToken = `tm_auth_${crypto.randomBytes(32).toString('hex')}`;
    const sessionData: SessionData = {
      token: sessionToken,
      role: 'admin',
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_TTL_MS,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    };

    activeSessions.set(sessionToken, sessionData);

    addAuditLog(
      'ADMIN_LOGIN_SUCCESS',
      'SECURITY',
      'Authorized management representative authenticated successfully.',
      authInfo.representativeName || 'Authorized Admin'
    );

    res.json({
      success: true,
      token: sessionToken,
      role: 'admin',
      expiresIn: SESSION_TTL_MS,
      user: {
        name: authInfo.representativeName || 'Authorized Management Representative',
        role: 'admin',
        title: authInfo.authorizedTitle || 'Representative'
      }
    });
  });

  // 6. Verify Active Admin Session Token
  app.get('/api/admin/verify-session', requireAdminAuth, (_req: Request, res: Response) => {
    res.json({
      valid: true,
      role: 'admin',
      user: {
        name: authInfo.representativeName || 'Authorized Management Representative',
        role: 'admin',
        title: authInfo.authorizedTitle || 'Representative'
      }
    });
  });

  // 7. Admin Logout
  app.post('/api/admin/logout', requireAdminAuth, (req: Request, res: Response) => {
    const session = (req as any).adminSession as SessionData;
    if (session && session.token) {
      activeSessions.delete(session.token);
    }
    addAuditLog('ADMIN_LOGOUT', 'SECURITY', 'Authorized management session terminated.', 'Management Admin');
    res.json({ success: true, message: 'Session successfully terminated.' });
  });

  // 8. Change Management Passcode (Admin Only)
  app.post('/api/admin/change-passcode', requireAdminAuth, (req: Request, res: Response) => {
    const { newPasscode } = req.body;
    if (!newPasscode || typeof newPasscode !== 'string' || newPasscode.trim().length < 8) {
      return res.status(400).json({
        error: 'New passcode must be at least 8 characters long.',
        code: 'INVALID_PASSCODE_LENGTH'
      });
    }

    adminPasscode = newPasscode.trim();
    saveStoreToDisk();
    addAuditLog('PASSCODE_UPDATED', 'SECURITY', 'Management portal master passcode updated.', 'Management Admin');
    res.json({ success: true, message: 'Management portal passcode successfully updated.' });
  });

  // ==========================================
  // PROTECTED ADMIN MANAGEMENT ENDPOINTS
  // ==========================================

  // 9. Get Inquiries (Admin Only - Confidential Customer Information!)
  app.get('/api/admin/inquiries', requireAdminAuth, (_req: Request, res: Response) => {
    res.json(inquiries);
  });

  // 10. Update Inquiry Status / Append Internal Notes (Admin Only)
  app.patch('/api/admin/inquiries/:id', requireAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, note } = req.body;

    const inquiry = inquiries.find((i) => i.id === id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found', code: 'NOT_FOUND' });
    }

    if (status) {
      inquiry.status = status as InquiryStatus;
    }

    if (note && typeof note === 'string' && note.trim()) {
      inquiry.notes = inquiry.notes || [];
      inquiry.notes.push(`[${new Date().toLocaleDateString()}] ${note.trim()}`);
    }

    saveStoreToDisk();
    addAuditLog('INQUIRY_UPDATED', 'INQUIRY', `Inquiry ${id} updated to status: ${inquiry.status}`, 'Management Admin');
    res.json({ success: true, inquiry });
  });

  // 11. Delete Inquiry (Admin Only)
  app.delete('/api/admin/inquiries/:id', requireAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLen = inquiries.length;
    inquiries = inquiries.filter((i) => i.id !== id);

    if (inquiries.length === initialLen) {
      return res.status(404).json({ error: 'Inquiry not found', code: 'NOT_FOUND' });
    }

    saveStoreToDisk();
    addAuditLog('INQUIRY_DELETED', 'INQUIRY', `Inquiry ${id} removed by admin.`, 'Management Admin');
    res.json({ success: true, message: 'Inquiry deleted.' });
  });

  // 12. Dedicated Admin Image Upload Endpoint (Direct binary saving to disk)
  app.post('/api/admin/upload-image', requireAdminAuth, (req: Request, res: Response) => {
    const { dataUrl, filename, vehicleId } = req.body;
    if (!dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({ error: 'Missing image dataUrl', code: 'INVALID_PAYLOAD' });
    }

    try {
      const prefix = vehicleId ? `${vehicleId}-img` : (filename ? path.parse(filename).name : 'media');
      const savedUrl = saveBase64ImageToDisk(dataUrl, prefix);
      
      if (!savedUrl) {
        return res.status(500).json({ error: 'Failed to write image to disk storage', code: 'STORAGE_ERROR' });
      }

      addAuditLog('MEDIA_UPLOADED', 'VEHICLE', `Uploaded image for ${vehicleId || 'catalog'} (${savedUrl})`, 'Management Admin');
      res.json({ success: true, url: savedUrl });
    } catch (err: any) {
      console.error('[Upload] Failed to process image upload:', err);
      res.status(500).json({ error: err?.message || 'Server error processing image', code: 'SERVER_ERROR' });
    }
  });

  // 12b. Update Saved Vehicle Image Directly (Admin Only)
  app.put('/api/admin/vehicle-images/:id', requireAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const { imageUrl } = req.body;
    if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.trim()) {
      return res.status(400).json({ error: 'Missing or invalid imageUrl', code: 'INVALID_PAYLOAD' });
    }

    const cleanUrl = saveBase64ImageToDisk(imageUrl.trim(), `${id}-custom`);
    savedVehicleImages[id] = cleanUrl;

    const vehIndex = vehicles.findIndex((v) => v.id === id);
    if (vehIndex >= 0) {
      vehicles[vehIndex].imageUrl = cleanUrl;
      if (Array.isArray(vehicles[vehIndex].galleryImages)) {
        if (vehicles[vehIndex].galleryImages[0] !== cleanUrl) {
          vehicles[vehIndex].galleryImages = [
            cleanUrl,
            ...vehicles[vehIndex].galleryImages.filter((img) => img !== cleanUrl),
          ];
        }
      } else {
        vehicles[vehIndex].galleryImages = [cleanUrl];
      }
    }

    saveStoreToDisk();
    addAuditLog('IMAGE_UPDATED', 'VEHICLE', `Saved permanent vehicle image for ${id}`, 'Management Admin');
    res.json({ success: true, savedVehicleImages, vehicle: vehIndex >= 0 ? vehicles[vehIndex] : null, vehicles });
  });

  // 13. Create / Update Vehicle in Catalog (Admin Only)
  app.post('/api/admin/vehicles', requireAdminAuth, (req: Request, res: Response) => {
    const rawVehicle = req.body as Vehicle;
    if (!rawVehicle || !rawVehicle.id || !rawVehicle.name) {
      return res.status(400).json({ error: 'Invalid vehicle payload', code: 'INVALID_PAYLOAD' });
    }

    // Automatically convert any embedded base64 to disk files and clean URLs
    const newVehicle = normalizeVehicleImages(rawVehicle);

    if (newVehicle.imageUrl && typeof newVehicle.imageUrl === 'string' && newVehicle.imageUrl.trim()) {
      savedVehicleImages[newVehicle.id] = newVehicle.imageUrl.trim();
    }

    const existingIndex = vehicles.findIndex((v) => v.id === newVehicle.id);
    if (existingIndex >= 0) {
      vehicles[existingIndex] = newVehicle;
    } else {
      vehicles.push(newVehicle);
    }

    saveStoreToDisk();
    addAuditLog('VEHICLE_SAVED', 'VEHICLE', `Saved vehicle ${newVehicle.name} (${newVehicle.id})`, 'Management Admin');
    res.json({ success: true, vehicle: newVehicle, vehicles, savedVehicleImages });
  });

  // 14. Update Vehicle by ID (Admin Only)
  app.put('/api/admin/vehicles/:id', requireAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const rawVehicle = req.body as Vehicle;
    if (!rawVehicle) {
      return res.status(400).json({ error: 'Missing vehicle data', code: 'INVALID_PAYLOAD' });
    }

    // Automatically convert any embedded base64 to disk files and clean URLs
    const updatedVehicle = normalizeVehicleImages({ ...rawVehicle, id });

    if (updatedVehicle.imageUrl && typeof updatedVehicle.imageUrl === 'string' && updatedVehicle.imageUrl.trim()) {
      savedVehicleImages[id] = updatedVehicle.imageUrl.trim();
    }

    const index = vehicles.findIndex((v) => v.id === id);
    if (index >= 0) {
      vehicles[index] = updatedVehicle;
    } else {
      vehicles.push(updatedVehicle);
    }

    saveStoreToDisk();
    addAuditLog('VEHICLE_UPDATED', 'VEHICLE', `Updated specifications/media for ${updatedVehicle.name}`, 'Management Admin');
    res.json({ success: true, vehicle: updatedVehicle, vehicles, savedVehicleImages });
  });

  // 15. Delete Vehicle (Admin Only)
  app.delete('/api/admin/vehicles/:id', requireAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    delete savedVehicleImages[id];
    vehicles = vehicles.filter((v) => v.id !== id);
    saveStoreToDisk();
    addAuditLog('VEHICLE_DELETED', 'VEHICLE', `Vehicle ${id} removed from catalog`, 'Management Admin');
    res.json({ success: true, vehicles, savedVehicleImages });
  });

  // 16. Update Official Authorization Info (Admin Only)
  app.put('/api/admin/auth-info', requireAdminAuth, (req: Request, res: Response) => {
    const newAuth = req.body as AuthorizationInfo;
    if (!newAuth || !newAuth.authorizationNumber) {
      return res.status(400).json({ error: 'Invalid authorization payload', code: 'INVALID_PAYLOAD' });
    }
    authInfo = { ...INITIAL_AUTH_INFO, ...newAuth };
    saveStoreToDisk();
    addAuditLog('AUTH_INFO_UPDATED', 'AUTH', `Updated representative: ${authInfo.representativeName}`, 'Management Admin');
    res.json({ success: true, authInfo });
  });

  // 17. Update Countries Dataset (Admin Only)
  app.put('/api/admin/countries', requireAdminAuth, (req: Request, res: Response) => {
    const list = req.body as CountryData[];
    if (!Array.isArray(list)) {
      return res.status(400).json({ error: 'Invalid country dataset format', code: 'INVALID_PAYLOAD' });
    }
    countriesList = list;
    saveStoreToDisk();
    addAuditLog('COUNTRIES_UPDATED', 'COUNTRY', `Country dataset updated (${list.length} entries)`, 'Management Admin');
    res.json({ success: true, countries: countriesList });
  });

  // 18. Get Activity Logs (Admin Only)
  app.get('/api/admin/logs', requireAdminAuth, (_req: Request, res: Response) => {
    res.json(activityLogs);
  });

  // 19. Factory Reset Catalog & Content (Admin Only)
  app.post('/api/admin/reset', requireAdminAuth, (_req: Request, res: Response) => {
    vehicles = JSON.parse(JSON.stringify(INITIAL_VEHICLES));
    authInfo = JSON.parse(JSON.stringify(INITIAL_AUTH_INFO));
    countriesList = JSON.parse(JSON.stringify(WORLDWIDE_COUNTRIES));
    saveStoreToDisk();
    addAuditLog('SYSTEM_RESET', 'SECURITY', 'Catalog and settings restored to factory defaults.', 'Management Admin');
    res.json({
      success: true,
      vehicles,
      authInfo,
      countries: countriesList,
      message: 'Catalog and settings successfully restored to authorized baseline.'
    });
  });

  // ==========================================
  // VITE DEV MIDDLEWARE & PRODUCTION SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, {
      maxAge: '1d',
      setHeaders: (res, filePath) => {
        if (filePath.includes('/assets/')) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
    }));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tesla Management Server running on port ${PORT}`);
  });
}

startServer();
