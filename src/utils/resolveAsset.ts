/**
 * Asset URL Resolver for GitHub Pages and Custom Domains
 * Ensures local upload paths and assets correctly resolve whether the app is hosted
 * at the root domain (https://teslamanagement.github.io/) or on a subpath.
 */

export function resolveAssetUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  
  // External URLs or Base64 / Blob URLs are returned as-is
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Get Vite's base path (e.g., '/' or '/teslamanagement-/')
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;

  // If already prefixed with base, return as-is
  if (cleanBase !== '/' && trimmed.startsWith(cleanBase)) {
    return trimmed;
  }

  const cleanPath = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;

  return `${cleanBase}${cleanPath}`;
}
