import { VehicleColor } from '../types';

export interface TeslaColorPreset {
  id: string;
  name: string;
  hex: string;
  models?: string[]; // Recommended models
}

export const TESLA_COLOR_PRESETS: TeslaColorPreset[] = [
  { id: 'diamond-black', name: 'Diamond Black', hex: '#111215' },
  { id: 'stealth-gray', name: 'Stealth Gray', hex: '#3D4148' },
  { id: 'ultra-red', name: 'Ultra Red', hex: '#96151D' },
  { id: 'pearl-white-multi-coat', name: 'Pearl White Multi-Coat', hex: '#F4F5F7' },
  { id: 'pearl-white', name: 'Pearl White', hex: '#F4F5F7' },
  { id: 'deep-blue-metallic', name: 'Deep Blue Metallic', hex: '#1B355A' },
  { id: 'quicksilver', name: 'Quicksilver', hex: '#7A808A' },
  { id: 'glacier-blue', name: 'Glacier Blue', hex: '#55758C' },
  { id: 'cosmic-silver', name: 'Cosmic Silver', hex: '#8E939C' },
  { id: 'marine-blue', name: 'Marine Blue', hex: '#1C3F60' },
  { id: 'shield-black', name: 'Shield Black', hex: '#1A1B1E' },
  { id: 'frost-blue-metallic', name: 'Frost Blue Metallic', hex: '#546E7A' },
  { id: 'lunar-silver', name: 'Lunar Silver', hex: '#9EADB8' },
];

// MODEL 3: 6 Exact Exterior Colors
export const DEFAULT_MODEL_3_COLORS: VehicleColor[] = [
  {
    id: 'm3-diamond-black',
    name: 'Diamond Black',
    hex: '#111215',
    images: [
      'https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'm3-stealth-gray',
    name: 'Stealth Gray',
    hex: '#3D4148',
    images: [
      'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'm3-ultra-red',
    name: 'Ultra Red',
    hex: '#96151D',
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'm3-pearl-white',
    name: 'Pearl White Multi-Coat',
    hex: '#F4F5F7',
    images: [
      'https://images.unsplash.com/photo-1561580125-028ee3bd62eb?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'm3-deep-blue',
    name: 'Deep Blue Metallic',
    hex: '#1B355A',
    images: [
      'https://images.unsplash.com/photo-1554744512-d6c603f27c54?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'm3-quicksilver',
    name: 'Quicksilver',
    hex: '#7A808A',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=80',
    ],
  },
];

// MODEL Y: 6 Exact Exterior Colors
export const DEFAULT_MODEL_Y_COLORS: VehicleColor[] = [
  {
    id: 'my-pearl-white',
    name: 'Pearl White Multi-Coat',
    hex: '#F4F5F7',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'my-diamond-black',
    name: 'Diamond Black',
    hex: '#111215',
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'my-glacier-blue',
    name: 'Glacier Blue',
    hex: '#55758C',
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'my-stealth-gray',
    name: 'Stealth Gray',
    hex: '#3D4148',
    images: [
      'https://images.unsplash.com/photo-1554744512-d6c603f27c54?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'my-quicksilver',
    name: 'Quicksilver',
    hex: '#7A808A',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'my-ultra-red',
    name: 'Ultra Red',
    hex: '#96151D',
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=80',
    ],
  },
];

// MODEL Y L: 6 Exact Exterior Colors
export const DEFAULT_MODEL_Y_L_COLORS: VehicleColor[] = [
  {
    id: 'myl-cosmic-silver',
    name: 'Cosmic Silver',
    hex: '#8E939C',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'myl-ultra-red',
    name: 'Ultra Red',
    hex: '#96151D',
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'myl-diamond-black',
    name: 'Diamond Black',
    hex: '#111215',
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'myl-marine-blue',
    name: 'Marine Blue',
    hex: '#1C3F60',
    images: [
      'https://images.unsplash.com/photo-1554744512-d6c603f27c54?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'myl-pearl-white',
    name: 'Pearl White',
    hex: '#F4F5F7',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'myl-stealth-gray',
    name: 'Stealth Gray',
    hex: '#3D4148',
    images: [
      'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1600&q=80',
    ],
  },
];

// CYBERTRUCK: 1 Exact Exterior Color
export const DEFAULT_CYBERTRUCK_COLORS: VehicleColor[] = [
  {
    id: 'ct-shield-black',
    name: 'Shield Black',
    hex: '#1A1B1E',
    images: [
      'https://images.unsplash.com/photo-1698877546059-d8cbff695796?auto=format&fit=crop&w=1600&q=80',
    ],
  },
];

// MODEL S: 6 Exact Exterior Colors
export const DEFAULT_MODEL_S_COLORS: VehicleColor[] = [
  {
    id: 'ms-stealth-gray',
    name: 'Stealth Gray',
    hex: '#3D4148',
    images: [
      'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'ms-diamond-black',
    name: 'Diamond Black',
    hex: '#111215',
    images: [
      'https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'ms-frost-blue',
    name: 'Frost Blue Metallic',
    hex: '#546E7A',
    images: [
      'https://images.unsplash.com/photo-1554744512-d6c603f27c54?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'ms-lunar-silver',
    name: 'Lunar Silver',
    hex: '#9EADB8',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'ms-pearl-white',
    name: 'Pearl White Multi-Coat',
    hex: '#F4F5F7',
    images: [
      'https://images.unsplash.com/photo-1561580125-028ee3bd62eb?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'ms-ultra-red',
    name: 'Ultra Red',
    hex: '#96151D',
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=80',
    ],
  },
];

// MODEL X: 6 Exact Exterior Colors
export const DEFAULT_MODEL_X_COLORS: VehicleColor[] = [
  {
    id: 'mx-stealth-gray',
    name: 'Stealth Gray',
    hex: '#3D4148',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'mx-diamond-black',
    name: 'Diamond Black',
    hex: '#111215',
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'mx-frost-blue',
    name: 'Frost Blue Metallic',
    hex: '#546E7A',
    images: [
      'https://images.unsplash.com/photo-1554744512-d6c603f27c54?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'mx-lunar-silver',
    name: 'Lunar Silver',
    hex: '#9EADB8',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'mx-pearl-white',
    name: 'Pearl White Multi-Coat',
    hex: '#F4F5F7',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80',
    ],
  },
  {
    id: 'mx-ultra-red',
    name: 'Ultra Red',
    hex: '#96151D',
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=80',
    ],
  },
];
