import { AuthorizationInfo } from '../types';

export const INITIAL_AUTH_INFO: AuthorizationInfo = {
  representativeName: 'Authorized Client Services & Fleet Allocation Desk',
  authorizedTitle: 'Authorized Tesla Management Representative & Allocation Coordinator',
  authorizationNumber: 'TM-AUTH-2026-GLOBAL-8941',
  authorizationDate: '2026-01-15',
  expirationDate: '2026-12-31',
  verificationUrl: 'https://auth.teslamanagement.org/verify/TM-AUTH-2026-GLOBAL-8941',
  publicAuthorizationReference: 'TM-ALLOC-GLOBAL-VERIFIED-V4',
  verificationInstructions: 'To verify authorization status, enter the Authorization Number into the official verification channel or request a real-time cryptographic confirmation from your assigned management coordinator.',
  responsibilities: [
    'Client vehicle purchase request processing and configuration coordination',
    'Authorized management promotional pricing verification and allocation vouchers',
    'Cross-border delivery, logistics, and documentation review assistance',
    'Official corporate and fleet customer order support',
    'Independent purchasing instructions and direct payment verification guidance'
  ],
  officialEmail: 'management@teslamanagement.org',
  officialPhone: '1-800-613-8840',
  officialDialCode: '+1',
  businessMessagingChannel: 'Tesla Management Official Desk (Verified Secure Protocol)',
  officeLocation: 'Tesla Management Operations & International Client Support Center, 1 Tesla Road, Austin, TX 78725 / Global Regional Hubs',
  legalDisclaimer: 'Tesla Management operates exclusively under verified client advisory authorization. All vehicle brand names, trademarks, and vehicle imagery are the property of Tesla, Inc. Promotional figures represent authorized Management Promotional Pricing and are distinct from standard manufacturer MSRP until formally matched and certified upon order completion.'
};
