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

const M3_IMAGES = [
  '/uploads/model-3-img-1787823274281-674eb4c3.webp',
  '/uploads/model-3-img-1787823275866-5bb9e87b.webp'
];

const MY_IMAGES = [
  '/uploads/model-y-img-1787823311496-e945c3bf.webp',
  '/uploads/model-y-img-1787823312906-e5d7e6e9.webp'
];

const MYL_IMAGES = [
  '/uploads/model-y-l-img-1787823336064-e27f2f43.webp',
  '/uploads/model-y-l-img-1787823337645-a8db7ab1.webp'
];

const CT_IMAGES = [
  '/uploads/cybertruck-main-1787823385132-f3d687cd.webp',
  '/uploads/cybertruck-gal-0-1787823385132-4a3fc8e7.webp',
  '/uploads/cybertruck-img-1787823380357-16448ec1.webp'
];

const MS_IMAGES = [
  '/uploads/model-s-img-1787823409678-655c31fd.webp',
  '/uploads/model-s-img-1787823411499-f77af729.webp'
];

const MX_IMAGES = [
  '/uploads/model-x-img-1787823435675-d840c478.webp',
  '/uploads/model-x-img-1787823437292-778d50cf.webp'
];

// MODEL 3: 6 Exact Exterior Colors
export const DEFAULT_MODEL_3_COLORS: VehicleColor[] = [
  { id: 'm3-diamond-black', name: 'Diamond Black', hex: '#111215', images: [...M3_IMAGES] },
  { id: 'm3-stealth-gray', name: 'Stealth Gray', hex: '#3D4148', images: [...M3_IMAGES] },
  { id: 'm3-ultra-red', name: 'Ultra Red', hex: '#96151D', images: [...M3_IMAGES] },
  { id: 'm3-pearl-white', name: 'Pearl White Multi-Coat', hex: '#F4F5F7', images: [...M3_IMAGES] },
  { id: 'm3-deep-blue', name: 'Deep Blue Metallic', hex: '#1B355A', images: [...M3_IMAGES] },
  { id: 'm3-quicksilver', name: 'Quicksilver', hex: '#7A808A', images: [...M3_IMAGES] },
];

// MODEL Y: 6 Exact Exterior Colors
export const DEFAULT_MODEL_Y_COLORS: VehicleColor[] = [
  { id: 'my-pearl-white', name: 'Pearl White Multi-Coat', hex: '#F4F5F7', images: [...MY_IMAGES] },
  { id: 'my-diamond-black', name: 'Diamond Black', hex: '#111215', images: [...MY_IMAGES] },
  { id: 'my-glacier-blue', name: 'Glacier Blue', hex: '#55758C', images: [...MY_IMAGES] },
  { id: 'my-stealth-gray', name: 'Stealth Gray', hex: '#3D4148', images: [...MY_IMAGES] },
  { id: 'my-quicksilver', name: 'Quicksilver', hex: '#7A808A', images: [...MY_IMAGES] },
  { id: 'my-ultra-red', name: 'Ultra Red', hex: '#96151D', images: [...MY_IMAGES] },
];

// MODEL Y L: 6 Exact Exterior Colors
export const DEFAULT_MODEL_Y_L_COLORS: VehicleColor[] = [
  { id: 'myl-cosmic-silver', name: 'Cosmic Silver', hex: '#8E939C', images: [...MYL_IMAGES] },
  { id: 'myl-ultra-red', name: 'Ultra Red', hex: '#96151D', images: [...MYL_IMAGES] },
  { id: 'myl-diamond-black', name: 'Diamond Black', hex: '#111215', images: [...MYL_IMAGES] },
  { id: 'myl-marine-blue', name: 'Marine Blue', hex: '#1C3F60', images: [...MYL_IMAGES] },
  { id: 'myl-pearl-white', name: 'Pearl White', hex: '#F4F5F7', images: [...MYL_IMAGES] },
  { id: 'myl-stealth-gray', name: 'Stealth Gray', hex: '#3D4148', images: [...MYL_IMAGES] },
];

// CYBERTRUCK: 1 Exact Exterior Color
export const DEFAULT_CYBERTRUCK_COLORS: VehicleColor[] = [
  { id: 'ct-shield-black', name: 'Shield Black', hex: '#1A1B1E', images: [...CT_IMAGES] },
];

// MODEL S: 6 Exact Exterior Colors
export const DEFAULT_MODEL_S_COLORS: VehicleColor[] = [
  { id: 'ms-stealth-gray', name: 'Stealth Gray', hex: '#3D4148', images: [...MS_IMAGES] },
  { id: 'ms-diamond-black', name: 'Diamond Black', hex: '#111215', images: [...MS_IMAGES] },
  { id: 'ms-frost-blue', name: 'Frost Blue Metallic', hex: '#546E7A', images: [...MS_IMAGES] },
  { id: 'ms-lunar-silver', name: 'Lunar Silver', hex: '#9EADB8', images: [...MS_IMAGES] },
  { id: 'ms-pearl-white', name: 'Pearl White Multi-Coat', hex: '#F4F5F7', images: [...MS_IMAGES] },
  { id: 'ms-ultra-red', name: 'Ultra Red', hex: '#96151D', images: [...MS_IMAGES] },
];

// MODEL X: 6 Exact Exterior Colors
export const DEFAULT_MODEL_X_COLORS: VehicleColor[] = [
  { id: 'mx-stealth-gray', name: 'Stealth Gray', hex: '#3D4148', images: [...MX_IMAGES] },
  { id: 'mx-diamond-black', name: 'Diamond Black', hex: '#111215', images: [...MX_IMAGES] },
  { id: 'mx-frost-blue', name: 'Frost Blue Metallic', hex: '#546E7A', images: [...MX_IMAGES] },
  { id: 'mx-lunar-silver', name: 'Lunar Silver', hex: '#9EADB8', images: [...MX_IMAGES] },
  { id: 'mx-pearl-white', name: 'Pearl White Multi-Coat', hex: '#F4F5F7', images: [...MX_IMAGES] },
  { id: 'mx-ultra-red', name: 'Ultra Red', hex: '#96151D', images: [...MX_IMAGES] },
];
