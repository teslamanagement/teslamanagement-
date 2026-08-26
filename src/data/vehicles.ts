import { Vehicle } from '../types';
import {
  DEFAULT_MODEL_3_COLORS,
  DEFAULT_MODEL_Y_COLORS,
  DEFAULT_MODEL_Y_L_COLORS,
  DEFAULT_CYBERTRUCK_COLORS,
  DEFAULT_MODEL_S_COLORS,
  DEFAULT_MODEL_X_COLORS,
} from './colors';

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'model-3',
    name: 'Model 3',
    modelCode: 'M3-2026',
    tagline: 'Electric Sports Sedan',
    description: 'Built for distance, performance and everyday comfort. Streamlined aerodynamics, responsive handling, and an all-glass acoustic interior.',
    category: 'sedan',
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?auto=format&fit=crop&w=1600&q=80'
    ],
    colors: DEFAULT_MODEL_3_COLORS,
    specs: {
      range: '341 miles (EPA est.)',
      acceleration: '2.9s 0-60 mph (Performance)',
      topSpeed: '163 mph',
      drivetrain: 'Rear-Wheel Drive / Dual Motor AWD',
      seating: '5 Adults',
      cargoCapacity: '24.1 cu ft',
      chargingRate: 'Up to 175 miles in 15 min (250kW Supercharging)',
      payloadOrTowing: '1,000 lbs towing capacity'
    },
    configurations: [
      {
        id: 'm3-rwd',
        name: 'Rear-Wheel Drive Standard',
        range: '272 miles',
        acceleration: '5.8s 0-60 mph',
        topSpeed: '125 mph',
        drivetrain: 'Single Motor RWD',
        basePrice: 23178
      },
      {
        id: 'm3-lrawd',
        name: 'Long Range All-Wheel Drive',
        range: '341 miles',
        acceleration: '4.2s 0-60 mph',
        topSpeed: '125 mph',
        drivetrain: 'Dual Motor AWD',
        basePrice: 27500
      },
      {
        id: 'm3-perf',
        name: 'Performance All-Wheel Drive',
        range: '303 miles',
        acceleration: '2.9s 0-60 mph',
        topSpeed: '163 mph',
        drivetrain: 'Dual Motor Performance AWD',
        basePrice: 32900
      }
    ],
    originalPrice: 38990,
    promotionalPrice: 23178,
    promotionalLabel: 'Management Promotional Price',
    availability: 'Available for Order',
    isFeatured: true,
    performanceHighlights: [
      'Refined suspension tuning with frequency-selective damping',
      '0.219 drag coefficient for maximum highway efficiency',
      'Track Mode V3 calibration on Performance trim'
    ],
    interiorHighlights: [
      '15.4-inch center touchscreen with ultra-thin bezel',
      '8-inch rear passenger display for climate and media',
      '360-degree acoustic glass for a quiet cabin'
    ],
    safetyHighlights: [
      '5-Star safety rating in all tested categories',
      'Rigid steel and aluminum passenger cell architecture',
      'Active collision avoidance and emergency braking suite'
    ],
    chargingHighlights: [
      'Access to 50,000+ Superchargers worldwide',
      'Up to 250 kW charging speed capability',
      'Automatic battery preconditioning for rapid charging stops'
    ],
    pricingNotes: 'Final pricing confirmed during authorized documentation review based on options and local duties.',
    effectiveDate: '2026-08-01',
    expirationDate: '2026-12-31',
    eligibilityRequirements: 'Applicable to authorized client inquiries with confirmed allocation voucher.'
  },
  {
    id: 'model-y',
    name: 'Model Y',
    modelCode: 'MY-2026',
    tagline: 'Mid-Size Electric SUV',
    description: 'Engineered for versatility, elevated seating height, generous cargo volume, and confident all-weather capability.',
    category: 'suv',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=80'
    ],
    colors: DEFAULT_MODEL_Y_COLORS,
    specs: {
      range: '310 miles (EPA est.)',
      acceleration: '3.5s 0-60 mph (Performance)',
      topSpeed: '155 mph',
      drivetrain: 'Dual Motor All-Wheel Drive',
      seating: '5 to 7 Adults',
      cargoCapacity: '76 cu ft maximum storage',
      chargingRate: 'Up to 162 miles in 15 min',
      payloadOrTowing: '3,500 lbs towing capacity'
    },
    configurations: [
      {
        id: 'my-lrawd',
        name: 'Long Range All-Wheel Drive',
        range: '310 miles',
        acceleration: '4.8s 0-60 mph',
        topSpeed: '135 mph',
        drivetrain: 'Dual Motor AWD',
        basePrice: 23994
      },
      {
        id: 'my-perf',
        name: 'Performance All-Wheel Drive',
        range: '279 miles',
        acceleration: '3.5s 0-60 mph',
        topSpeed: '155 mph',
        drivetrain: 'Performance Dual Motor AWD',
        basePrice: 29500
      },
      {
        id: 'my-rwd',
        name: 'Standard Range Rear-Wheel Drive',
        range: '260 miles',
        acceleration: '6.6s 0-60 mph',
        topSpeed: '135 mph',
        drivetrain: 'Single Motor RWD',
        basePrice: 21900
      }
    ],
    originalPrice: 44990,
    promotionalPrice: 23994,
    promotionalLabel: 'Management Promotional Price',
    availability: 'Available for Order',
    isFeatured: true,
    performanceHighlights: [
      'Dual motors digitally regulate torque to front and rear wheels',
      'Off-Road Assist mode for increased traction on rough terrain',
      'Low center of gravity for balanced handling and roll resistance'
    ],
    interiorHighlights: [
      'All-glass panoramic roof with UV and infrared protection',
      'Second-row seating with adjustable recline angles',
      'Power liftgate with deep under-floor trunk wells'
    ],
    safetyHighlights: [
      'Top Safety Pick+ rating with high-strength passenger cell',
      'Standard active safety suite with blind spot monitoring'
    ],
    chargingHighlights: [
      'NACS standard charging port with 250 kW support',
      'Integrated Trip Planner with real-time Supercharger routing'
    ],
    pricingNotes: 'Subject to inventory status and authorized management approval.',
    effectiveDate: '2026-08-01',
    expirationDate: '2026-12-31'
  },
  {
    id: 'model-y-l',
    name: 'Model Y L',
    modelCode: 'MYL-2026',
    tagline: 'Extended Wheelbase Luxury Crossover',
    description: 'Extended wheelbase architecture paired with executive rear captain seating, enhanced legroom, and refined acoustic isolation.',
    category: 'suv',
    imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=80'
    ],
    colors: DEFAULT_MODEL_Y_L_COLORS,
    specs: {
      range: '335 miles (EPA est.)',
      acceleration: '4.1s 0-60 mph',
      topSpeed: '145 mph',
      drivetrain: 'Dual Motor All-Wheel Drive',
      seating: '4 or 6 Executive Passenger Layout',
      cargoCapacity: '82 cu ft maximum storage',
      chargingRate: 'Up to 170 miles in 15 min',
      payloadOrTowing: '3,800 lbs towing capacity'
    },
    configurations: [
      {
        id: 'myl-exec',
        name: 'Executive Lounge AWD',
        range: '335 miles',
        acceleration: '4.1s 0-60 mph',
        topSpeed: '145 mph',
        drivetrain: 'Dual Motor AWD',
        basePrice: 37194
      },
      {
        id: 'myl-lounge',
        name: 'Grand Touring AWD',
        range: '350 miles',
        acceleration: '4.4s 0-60 mph',
        topSpeed: '140 mph',
        drivetrain: 'Dual Motor AWD',
        basePrice: 39500
      }
    ],
    originalPrice: 52490,
    promotionalPrice: 37194,
    promotionalLabel: 'Management Promotional Price',
    availability: 'Limited Allocation',
    isFeatured: true,
    performanceHighlights: [
      'Adaptive air suspension tuned for executive highway comfort',
      'Ultra-quiet acoustic glass throughout cabin'
    ],
    interiorHighlights: [
      'Power reclining rear executive massage seating',
      'Dual rear entertainment displays with independent audio zones',
      'Fold-out work surfaces and temperature-controlled storage'
    ],
    safetyHighlights: [
      'Reinforced long-wheelbase chassis with side-impact deflection',
      'Surround vision camera network with real-time hazard detection'
    ],
    chargingHighlights: [
      'High-speed Supercharging with smart thermal battery control'
    ],
    pricingNotes: 'Limited allocation reservation with verified executive client status.',
    effectiveDate: '2026-08-01',
    expirationDate: '2026-12-31'
  },
  {
    id: 'cybertruck',
    name: 'Cybertruck',
    modelCode: 'CT-2026',
    tagline: 'Stainless-Steel Utility Vehicle',
    description: 'Engineered with a durable stainless-steel exoskeleton, shatter-resistant Armor Glass, 4-wheel steer-by-wire agility, and 11,000 lbs towing capacity.',
    category: 'truck',
    imageUrl: 'https://images.unsplash.com/photo-1698877546059-d8cbff695796?auto=format&fit=crop&w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1698877546059-d8cbff695796?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80'
    ],
    colors: DEFAULT_CYBERTRUCK_COLORS,
    specs: {
      range: '340 miles (470+ mi with Range Extender)',
      acceleration: '2.6s 0-60 mph (Cyberbeast)',
      topSpeed: '130 mph',
      drivetrain: 'Dual Motor AWD / Tri-Motor Cyberbeast',
      seating: '5 Adults',
      cargoCapacity: '120.9 cu ft lockable vault + frunk',
      chargingRate: 'Up to 136 miles in 15 min (800V architecture)',
      payloadOrTowing: '11,000 lbs towing / 2,500 lbs payload'
    },
    configurations: [
      {
        id: 'ct-awd',
        name: 'All-Wheel Drive (Dual Motor)',
        range: '340 miles',
        acceleration: '4.1s 0-60 mph',
        topSpeed: '112 mph',
        drivetrain: 'Dual Motor AWD',
        basePrice: 49341
      },
      {
        id: 'ct-beast',
        name: 'Cyberbeast (Tri-Motor)',
        range: '320 miles',
        acceleration: '2.6s 0-60 mph',
        topSpeed: '130 mph',
        drivetrain: 'Tri-Motor AWD',
        basePrice: 68500
      },
      {
        id: 'ct-rwd',
        name: 'Rear-Wheel Drive (Future Production)',
        range: '250 miles',
        acceleration: '6.5s 0-60 mph',
        topSpeed: '112 mph',
        drivetrain: 'Single Motor RWD',
        basePrice: 44000
      }
    ],
    originalPrice: 79990,
    promotionalPrice: 49341,
    promotionalLabel: 'Management Promotional Price',
    availability: 'Limited Allocation',
    isFeatured: true,
    performanceHighlights: [
      '800V electrical architecture for high-power Supercharging',
      'Steer-by-wire system paired with responsive rear-wheel steering',
      'Adaptive air suspension with up to 17 inches of clearance'
    ],
    interiorHighlights: [
      '18.5-inch center display and 9.4-inch rear entertainment screen',
      'Integrated 120V and 240V outlets delivering up to 11.5 kW onboard power',
      'Motorized lockable vault tonneau cover'
    ],
    safetyHighlights: [
      'Cold-rolled stainless-steel skin helps reduce denting and corrosion',
      'Armor Glass resists impact and road debris'
    ],
    chargingHighlights: [
      'Powershare bidirectional charging capability for home backup'
    ],
    pricingNotes: 'Management promotional pricing available on confirmed authorized allocations.',
    effectiveDate: '2026-08-01',
    expirationDate: '2026-12-31'
  },
  {
    id: 'model-s',
    name: 'Model S',
    modelCode: 'MS-2026',
    tagline: 'Flagship Luxury Sedan',
    description: 'Instant torque, long-distance range, aerodynamic efficiency, and tri-motor Plaid performance packaged in a refined luxury silhouette.',
    category: 'sedan',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1600&q=80'
    ],
    colors: DEFAULT_MODEL_S_COLORS,
    specs: {
      range: '402 miles (EPA est.)',
      acceleration: '1.99s 0-60 mph (Plaid)',
      topSpeed: '200 mph',
      drivetrain: 'Dual Motor AWD / Tri-Motor Plaid AWD',
      seating: '5 Adults',
      cargoCapacity: '28 cu ft trunk + frunk',
      chargingRate: 'Up to 200 miles in 15 min',
      payloadOrTowing: '1,020 hp peak output'
    },
    configurations: [
      {
        id: 'ms-awd',
        name: 'Model S Dual Motor AWD',
        range: '402 miles',
        acceleration: '3.1s 0-60 mph',
        topSpeed: '130 mph',
        drivetrain: 'Dual Motor AWD',
        basePrice: 53994
      },
      {
        id: 'ms-plaid',
        name: 'Model S Plaid (Tri-Motor)',
        range: '359 miles',
        acceleration: '1.99s 0-60 mph',
        topSpeed: '200 mph',
        drivetrain: 'Tri-Motor Carbon-Sleeved AWD',
        basePrice: 69900
      }
    ],
    originalPrice: 74990,
    promotionalPrice: 53994,
    promotionalLabel: 'Management Promotional Price',
    availability: 'Available for Order',
    isFeatured: true,
    performanceHighlights: [
      '1,020 horsepower with torque vectoring across three carbon-sleeved rotors',
      '0.208 drag coefficient for extended range and quiet cruising',
      'Adaptive air suspension with automatic location-based memory'
    ],
    interiorHighlights: [
      '17-inch cinematic tilting touchscreen with 2200x1300 resolution',
      '22-speaker audio system with active road noise cancellation',
      'Tri-zone climate control with invisible interior air vents'
    ],
    safetyHighlights: [
      'Rigid floor-mounted battery architecture protecting the cabin',
      'Full Autopilot sensor suite with 360-degree vision coverage'
    ],
    chargingHighlights: [
      '250 kW Supercharging with automatic battery preconditioning'
    ],
    pricingNotes: 'Authorized promotional rate valid for selected corporate and private client requests.',
    effectiveDate: '2026-08-01',
    expirationDate: '2026-12-31'
  },
  {
    id: 'model-x',
    name: 'Model X',
    modelCode: 'MX-2026',
    tagline: 'Flagship Electric SUV',
    description: 'Falcon Wing rear doors, expansive panoramic windshield, three-row luxury seating, and up to 5,000 lbs towing capacity.',
    category: 'suv',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=80'
    ],
    colors: DEFAULT_MODEL_X_COLORS,
    specs: {
      range: '335 miles (EPA est.)',
      acceleration: '2.5s 0-60 mph (Plaid)',
      topSpeed: '163 mph',
      drivetrain: 'Dual Motor AWD / Tri-Motor Plaid AWD',
      seating: '5, 6 or 7 Adults',
      cargoCapacity: '88 cu ft maximum storage',
      chargingRate: 'Up to 175 miles in 15 min',
      payloadOrTowing: '5,000 lbs towing capacity'
    },
    configurations: [
      {
        id: 'mx-awd',
        name: 'Model X Dual Motor AWD',
        range: '335 miles',
        acceleration: '3.8s 0-60 mph',
        topSpeed: '149 mph',
        drivetrain: 'Dual Motor AWD',
        basePrice: 59994
      },
      {
        id: 'mx-plaid',
        name: 'Model X Plaid (Tri-Motor)',
        range: '326 miles',
        acceleration: '2.5s 0-60 mph',
        topSpeed: '163 mph',
        drivetrain: 'Tri-Motor Plaid AWD',
        basePrice: 76000
      }
    ],
    originalPrice: 79990,
    promotionalPrice: 59994,
    promotionalLabel: 'Management Promotional Price',
    availability: 'Available for Order',
    isFeatured: true,
    performanceHighlights: [
      '2.5-second 0-60 mph acceleration on Plaid configuration',
      'Dual and tri-motor all-wheel-drive configurations'
    ],
    interiorHighlights: [
      'Falcon Wing doors with dual-hinged sensor clearance',
      'Panoramic windshield providing expansive road and sky views',
      'Flexible seating configurations for up to seven passengers'
    ],
    safetyHighlights: [
      'Low rollover risk with high-strength floor-mounted battery pack',
      'Medical-grade HEPA filtration with Bioweapon Defense Mode'
    ],
    chargingHighlights: [
      'Integrated Supercharging network route guidance'
    ],
    pricingNotes: 'Authorized management promotional pricing subject to inventory matching.',
    effectiveDate: '2026-08-01',
    expirationDate: '2026-12-31'
  },
  {
    id: 'roadster',
    name: 'Roadster',
    modelCode: 'RD-2026',
    tagline: 'Electric Supercar',
    description: 'Engineered to maximize aerodynamic efficiency and electric powertrain performance into record-setting acceleration and highway range.',
    category: 'specialty',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1600&q=80'
    ],
    specs: {
      range: '620 miles',
      acceleration: '1.9s 0-60 mph (sub-1s with thruster package)',
      topSpeed: '250+ mph',
      drivetrain: 'All-Wheel Drive Tri-Motor',
      seating: '4 Passengers (2+2)',
      cargoCapacity: 'Removable lightweight glass roof trunk',
      chargingRate: 'High-Density 350 kW Support',
      payloadOrTowing: '10,000 Nm wheel torque'
    },
    configurations: [
      {
        id: 'rd-base',
        name: 'Roadster Founders Series Reservation',
        range: '620 miles',
        acceleration: '1.9s 0-60 mph',
        topSpeed: '250+ mph',
        drivetrain: 'Tri-Motor All-Wheel Drive',
        basePrice: 120000
      }
    ],
    originalPrice: 200000,
    promotionalPrice: 120000,
    promotionalLabel: 'Management Promotional Price',
    availability: 'Reservation Inquiry',
    isFeatured: false,
    performanceHighlights: [
      '10,000 Nm wheel torque delivering immediate power delivery',
      'Sub-8.8 second quarter-mile run capability',
      'Active rear wing and underbody ground-effect diffuser'
    ],
    interiorHighlights: [
      'Lightweight removable glass roof stows neatly in the trunk',
      'Driver-focused minimalist cockpit with curved digital interface'
    ],
    safetyHighlights: [
      'Carbon-composite passenger safety structure'
    ],
    chargingHighlights: [
      'High-capacity energy pack with dual-phase thermal management'
    ],
    pricingNotes: 'Reservation inquiry via authorized management allocation protocol only.',
    effectiveDate: '2026-08-01',
    expirationDate: '2026-12-31'
  },
  {
    id: 'cybercab',
    name: 'Cybercab',
    modelCode: 'CC-2026',
    tagline: 'Autonomous Mobility',
    description: 'Designed exclusively for autonomous, driverless transportation with motorized butterfly doors, inductive wireless charging, and an open lounge cabin.',
    category: 'specialty',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1600&q=80'
    ],
    specs: {
      range: '200+ miles per charge',
      acceleration: 'Autonomous speed control',
      topSpeed: '110 mph',
      drivetrain: 'High-Efficiency Single Motor Rear Drive',
      seating: '2 Passengers with generous luggage space',
      cargoCapacity: 'Spacious rear luggage trunk for two full suitcases',
      chargingRate: '100% Inductive Wireless Pad Charging',
      payloadOrTowing: 'Dedicated fleet autonomy architecture'
    },
    configurations: [
      {
        id: 'cc-autonomous',
        name: 'Cybercab Fleet Edition',
        range: '200+ miles',
        acceleration: 'Autonomous Speed Regulation',
        topSpeed: '110 mph',
        drivetrain: 'Rear-Wheel Drive Autonomous',
        basePrice: 180000
      }
    ],
    originalPrice: 25000,
    promotionalPrice: 18000,
    promotionalLabel: 'Management Promotional Price',
    availability: 'Production Preview',
    isFeatured: false,
    performanceHighlights: [
      'Full Self-Driving hardware platform with redundant compute nodes',
      'Purpose-built cabin without pedals or manual steering controls'
    ],
    interiorHighlights: [
      '21-inch center passenger display for media and route information',
      'Ergonomic lounge seating with durable sustainable textiles',
      'Curbside butterfly doors for easy entry and exit'
    ],
    safetyHighlights: [
      'Full sensor redundancy and fail-operational vehicle controls'
    ],
    chargingHighlights: [
      'Inductive wireless pad charging without physical connectors'
    ],
    pricingNotes: 'Commercial and fleet interest inquiry. Subject to regulatory approvals.',
    effectiveDate: '2026-08-01',
    expirationDate: '2026-12-31'
  },
  {
    id: 'tesla-semi',
    name: 'Tesla Semi',
    modelCode: 'SEMI-2026',
    tagline: 'Class 8 Electric Truck',
    description: 'Heavy-duty commercial freight semi with center-driver cockpit, 3 independent electric motors, and substantial operational efficiency.',
    category: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80'
    ],
    specs: {
      range: '500 miles at 82,000 lbs gross combination weight',
      acceleration: '0-60 mph in 20s with full 82,000 lbs load',
      topSpeed: '65 mph highway cruising on a 5% grade',
      drivetrain: 'Tri-Motor Rear Axle Electric Drive',
      seating: 'Center Captain Seat + Passenger Jump Seat',
      cargoCapacity: 'Class 8 semi-truck trailer connection',
      chargingRate: 'Megawatt Charging (Up to 70% in 30 minutes)',
      payloadOrTowing: '82,000 lbs GCW Rating'
    },
    configurations: [
      {
        id: 'semi-300',
        name: 'Tesla Semi 300-Mile Range',
        range: '300 miles fully loaded',
        acceleration: '20s 0-60 mph (loaded)',
        topSpeed: '65 mph',
        drivetrain: 'Tri-Motor Rear Axles',
        basePrice: 90000
      },
      {
        id: 'semi-500',
        name: 'Tesla Semi 500-Mile Range',
        range: '500 miles fully loaded',
        acceleration: '20s 0-60 mph (loaded)',
        topSpeed: '65 mph',
        drivetrain: 'Tri-Motor Rear Axles',
        basePrice: 110000
      }
    ],
    originalPrice: 150000,
    promotionalPrice: 90000,
    promotionalLabel: 'Management Promotional Price',
    availability: 'Limited Allocation',
    isFeatured: false,
    performanceHighlights: [
      'Maintains 65 mph highway speeds uphill on a 5% continuous grade',
      'Regenerative braking returns energy directly to the battery'
    ],
    interiorHighlights: [
      'Center driver seating position for commanding road visibility',
      'Dual 15-inch touchscreens for navigation and blind-spot monitoring'
    ],
    safetyHighlights: [
      'Active torque control on rear axles helps prevent jackknifing',
      'Low center of gravity with battery mounted low in the frame'
    ],
    chargingHighlights: [
      'Compatible with Megawatt Charging System (MCS)'
    ],
    pricingNotes: 'Commercial fleet inquiry pricing subject to fleet contract terms and delivery region.',
    effectiveDate: '2026-08-01',
    expirationDate: '2026-12-31'
  }
];
