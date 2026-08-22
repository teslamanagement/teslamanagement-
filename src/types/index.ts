export interface VehicleSpec {
  range: string;
  acceleration: string;
  topSpeed: string;
  drivetrain: string;
  seating: string;
  cargoCapacity?: string;
  chargingRate?: string;
  payloadOrTowing?: string;
}

export interface VehicleConfiguration {
  id: string;
  name: string;
  range: string;
  acceleration: string;
  topSpeed: string;
  drivetrain: string;
  basePrice?: number;
}

export interface VehicleColor {
  id: string;
  name: string;
  hex: string;
  images?: string[]; // Up to 5 color-specific images
}

export interface Vehicle {
  id: string;
  name: string;
  modelCode: string;
  tagline: string;
  description: string;
  category: 'sedan' | 'suv' | 'truck' | 'specialty' | 'commercial';
  imageUrl: string;
  galleryImages: string[];
  colors?: VehicleColor[];
  specs: VehicleSpec;
  configurations: VehicleConfiguration[];
  originalPrice?: number; // Authorized original reference price (MSRP)
  promotionalPrice: number; // Management Promotional Price
  promotionalLabel?: string;
  availability: 'Available for Order' | 'Limited Allocation' | 'Custom Delivery' | 'Reservation Inquiry' | 'Production Preview';
  isFeatured: boolean;
  performanceHighlights: string[];
  interiorHighlights: string[];
  safetyHighlights: string[];
  chargingHighlights: string[];
  pricingNotes?: string;
  effectiveDate?: string;
  expirationDate?: string;
  eligibilityRequirements?: string;
}

export interface CountryData {
  name: string;
  isoCode: string; // ISO 3166-1 alpha-2
  dialCode: string; // e.g. +1, +234
  flag: string; // Emoji flag
  format?: string; // Example format e.g. "XXX XXX XXXX"
  minLength?: number;
  maxLength?: number;
}

export type InquiryStatus = 'New' | 'Contacted' | 'Processing' | 'Completed' | 'Archived';

export interface CustomerInquiry {
  id: string;
  fullName: string;
  email: string;
  countryName: string;
  countryIsoCode: string;
  countryDialingCode: string;
  phoneNumber: string;
  normalizedPhoneNumber: string;
  stateOrRegion?: string;
  preferredModel: string;
  preferredConfiguration?: string;
  preferredColor?: string;
  purchaseMethod: 'Cash' | 'Financing' | 'Other';
  message?: string;
  status: InquiryStatus;
  createdAt: string;
  notes?: string[];
  assignedRepresentative?: string;
}

export interface AuthorizationInfo {
  representativeName: string;
  authorizedTitle: string;
  authorizationNumber: string;
  authorizationDate: string;
  expirationDate: string;
  verificationUrl: string;
  publicAuthorizationReference: string;
  verificationInstructions: string;
  responsibilities: string[];
  officialEmail: string;
  officialPhone: string;
  officialDialCode: string;
  businessMessagingChannel: string;
  officeLocation: string;
  legalDisclaimer: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  category: 'INQUIRY' | 'VEHICLE' | 'PRICING' | 'AUTH' | 'COUNTRY' | 'SECURITY';
  details: string;
  performedBy: string;
}
