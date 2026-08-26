/**
 * Automotive Paint Shader & Metallic Gradient Engine
 * Provides realistic automotive paint simulations with specular reflections,
 * pearl coat luster, and depth gradients for Tesla exterior colors.
 */

export interface PaintStyle {
  background: string;
  boxShadow: string;
  border?: string;
  hasShimmer?: boolean;
}

export function getAutomotivePaintStyle(hex: string, name?: string): PaintStyle {
  const normalizedName = (name || '').toLowerCase();
  const normalizedHex = (hex || '').toLowerCase().trim();

  // 1. Pearl White Multi-Coat
  if (
    normalizedName.includes('pearl') ||
    normalizedName.includes('white') ||
    normalizedHex === '#f4f5f7' ||
    normalizedHex === '#ffffff' ||
    normalizedHex === '#f5f5f5'
  ) {
    return {
      background: 'radial-gradient(circle at 35% 28%, #FFFFFF 0%, #F0F2F5 35%, #D6DBE4 70%, #B8C0CC 100%)',
      boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -2px 4px rgba(0,0,0,0.25), 0 2px 5px rgba(0,0,0,0.4)',
      border: '1px solid rgba(255,255,255,0.4)',
      hasShimmer: true,
    };
  }

  // 2. Ultra Red / Deep Red / Pearl Red
  if (
    normalizedName.includes('red') ||
    normalizedHex === '#96151d' ||
    normalizedHex === '#e82127' ||
    normalizedHex === '#8e1018'
  ) {
    return {
      background: 'radial-gradient(circle at 35% 28%, #FF3B40 0%, #D81E28 30%, #8E1018 70%, #4A050B 100%)',
      boxShadow: 'inset 0 1px 2px rgba(255,160,160,0.6), inset 0 -2px 4px rgba(0,0,0,0.5), 0 2px 5px rgba(142,16,24,0.4)',
      border: '1px solid rgba(255,100,100,0.3)',
      hasShimmer: true,
    };
  }

  // 3. Deep Blue Metallic / Glacier Blue / Marine Blue
  if (
    normalizedName.includes('blue') ||
    normalizedHex === '#1b355a' ||
    normalizedHex === '#55758c' ||
    normalizedHex === '#1c3f60' ||
    normalizedHex === '#546e7a'
  ) {
    return {
      background: 'radial-gradient(circle at 35% 28%, #4B79A1 0%, #28558A 35%, #153259 70%, #0A192F 100%)',
      boxShadow: 'inset 0 1px 2px rgba(180,220,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.5), 0 2px 5px rgba(0,0,0,0.4)',
      border: '1px solid rgba(100,160,240,0.25)',
      hasShimmer: true,
    };
  }

  // 4. Quicksilver / Metallic Silver / Cosmic Silver / Lunar Silver
  if (
    normalizedName.includes('silver') ||
    normalizedName.includes('quicksilver') ||
    normalizedHex === '#7a808a' ||
    normalizedHex === '#8e939c' ||
    normalizedHex === '#9eadb8' ||
    normalizedHex === '#b8b8ba'
  ) {
    return {
      background: 'radial-gradient(circle at 35% 28%, #E2E6EC 0%, #A5ACB8 35%, #6B7280 70%, #404550 100%)',
      boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.4), 0 2px 5px rgba(0,0,0,0.4)',
      border: '1px solid rgba(255,255,255,0.3)',
      hasShimmer: true,
    };
  }

  // 5. Stealth Gray / Titanium Grey
  if (
    normalizedName.includes('gray') ||
    normalizedName.includes('grey') ||
    normalizedName.includes('titanium') ||
    normalizedHex === '#3d4148' ||
    normalizedHex === '#303033'
  ) {
    return {
      background: 'radial-gradient(circle at 35% 28%, #6B7280 0%, #464B54 35%, #2D3138 70%, #191B20 100%)',
      boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.6), 0 2px 5px rgba(0,0,0,0.4)',
      border: '1px solid rgba(255,255,255,0.15)',
      hasShimmer: true,
    };
  }

  // 6. Diamond Black / Shield Black / Deep Black
  if (
    normalizedName.includes('black') ||
    normalizedHex === '#111215' ||
    normalizedHex === '#1a1b1e' ||
    normalizedHex === '#0b0b0c' ||
    normalizedHex === '#000000'
  ) {
    return {
      background: 'radial-gradient(circle at 35% 28%, #3A3D45 0%, #202227 35%, #111215 70%, #060607 100%)',
      boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.8), 0 2px 5px rgba(0,0,0,0.6)',
      border: '1px solid rgba(255,255,255,0.15)',
      hasShimmer: true,
    };
  }

  // Fallback metallic shader based on dynamic hex
  return {
    background: `radial-gradient(circle at 35% 28%, rgba(255,255,255,0.4) 0%, ${hex} 40%, rgba(0,0,0,0.6) 100%)`,
    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.5), 0 2px 5px rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.2)',
  };
}
