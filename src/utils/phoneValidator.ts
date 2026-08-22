import { CountryData } from '../types';

export interface PhoneValidationResult {
  isValid: boolean;
  normalizedE164: string;
  formattedNumber: string;
  errorMessage?: string;
}

/**
 * Validates and formats international phone numbers against country dial codes and standard rules.
 */
export function validateAndNormalizePhone(
  rawPhone: string,
  country?: CountryData | null
): PhoneValidationResult {
  const safeCountry: CountryData = country || {
    name: 'United States',
    isoCode: 'US',
    dialCode: '+1',
    flag: '🇺🇸',
    minLength: 10,
    maxLength: 10,
  };

  if (!rawPhone || !rawPhone.trim()) {
    return {
      isValid: false,
      normalizedE164: '',
      formattedNumber: '',
      errorMessage: 'Phone number is required.',
    };
  }

  // Strip non-digit characters except leading plus
  let cleaned = rawPhone.trim().replace(/[^\d+]/g, '');

  // Strip international dial code prefix if user typed it redundantly
  const dialCodeDigits = (safeCountry.dialCode || '+1').replace('+', '');
  if (cleaned.startsWith(`+${dialCodeDigits}`)) {
    cleaned = cleaned.slice(dialCodeDigits.length + 1);
  } else if (cleaned.startsWith(dialCodeDigits)) {
    cleaned = cleaned.slice(dialCodeDigits.length);
  }

  // Remove leading local zero if present (e.g. 0803... in UK/Nigeria becomes 803...)
  if (cleaned.startsWith('0') && safeCountry.dialCode !== '+1') {
    cleaned = cleaned.slice(1);
  }

  // Only digits remain in cleaned local number
  const digitsOnly = cleaned.replace(/\D/g, '');

  const minLen = safeCountry.minLength || 7;
  const maxLen = safeCountry.maxLength || 12;

  if (digitsOnly.length === 0) {
    return {
      isValid: false,
      normalizedE164: '',
      formattedNumber: '',
      errorMessage: 'Please enter your phone number.',
    };
  }

  if (digitsOnly.length < minLen) {
    return {
      isValid: false,
      normalizedE164: `${safeCountry.dialCode}${digitsOnly}`,
      formattedNumber: `${safeCountry.dialCode} ${digitsOnly}`,
      errorMessage: `Phone number is too short for ${safeCountry.name} (minimum ${minLen} digits).`,
    };
  }

  if (digitsOnly.length > maxLen + 2) {
    return {
      isValid: false,
      normalizedE164: `${safeCountry.dialCode}${digitsOnly}`,
      formattedNumber: `${safeCountry.dialCode} ${digitsOnly}`,
      errorMessage: `Phone number is too long for ${safeCountry.name} (maximum ${maxLen} digits).`,
    };
  }

  // Normalize into standard E.164: +[CountryCode][NationalNumber]
  const normalizedE164 = `${safeCountry.dialCode}${digitsOnly}`;
  const formattedNumber = `${safeCountry.dialCode} ${digitsOnly}`;

  return {
    isValid: true,
    normalizedE164,
    formattedNumber,
  };
}
