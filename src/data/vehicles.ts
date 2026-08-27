// Authoritative Production Vehicle Data
import { Vehicle } from '../types';

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    "id": "model-3",
    "name": "Model 3",
    "modelCode": "M3-2026",
    "tagline": "High-Efficiency Electric Sports Sedan",
    "description": "Designed for electric efficiency, refined aerodynamics, quiet acoustic glass cabin, ambient interior lighting, and nimble handling.",
    "category": "sedan",
    "imageUrl": "/uploads/model-3-img-1787823274281-674eb4c3.webp",
    "galleryImages": [
      "/uploads/model-3-img-1787823274281-674eb4c3.webp",
      "/uploads/model-3-img-1787823275866-5bb9e87b.webp"
    ],
    "colors": [
      {
        "id": "m3-diamond-black",
        "name": "Diamond Black",
        "hex": "#111215",
        "images": [
          "/uploads/model-3-img-1787823274281-674eb4c3.webp",
          "/uploads/model-3-img-1787823275866-5bb9e87b.webp"
        ]
      },
      {
        "id": "m3-stealth-gray",
        "name": "Stealth Gray",
        "hex": "#3D4148",
        "images": [
          "/uploads/model-3-img-1787823274281-674eb4c3.webp",
          "/uploads/model-3-img-1787823275866-5bb9e87b.webp"
        ]
      },
      {
        "id": "m3-ultra-red",
        "name": "Ultra Red",
        "hex": "#96151D",
        "images": [
          "/uploads/model-3-img-1787823274281-674eb4c3.webp",
          "/uploads/model-3-img-1787823275866-5bb9e87b.webp"
        ]
      },
      {
        "id": "m3-pearl-white",
        "name": "Pearl White Multi-Coat",
        "hex": "#F4F5F7",
        "images": [
          "/uploads/model-3-img-1787823274281-674eb4c3.webp",
          "/uploads/model-3-img-1787823275866-5bb9e87b.webp"
        ]
      },
      {
        "id": "m3-deep-blue",
        "name": "Deep Blue Metallic",
        "hex": "#1B355A",
        "images": [
          "/uploads/model-3-img-1787823274281-674eb4c3.webp",
          "/uploads/model-3-img-1787823275866-5bb9e87b.webp"
        ]
      },
      {
        "id": "m3-quicksilver",
        "name": "Quicksilver",
        "hex": "#7A808A",
        "images": [
          "/uploads/model-3-img-1787823274281-674eb4c3.webp",
          "/uploads/model-3-img-1787823275866-5bb9e87b.webp"
        ]
      }
    ],
    "specs": {
      "range": "341 miles (EPA est.)",
      "acceleration": "2.9s 0-60 mph (Performance)",
      "topSpeed": "163 mph",
      "drivetrain": "Rear-Wheel Drive / Dual Motor AWD",
      "seating": "5 Adults",
      "cargoCapacity": "24.1 cu ft",
      "chargingRate": "Up to 175 miles in 15 min (250kW Supercharging)",
      "payloadOrTowing": "1,000 lbs towing capacity"
    },
    "configurations": [
      {
        "id": "m3-rwd",
        "name": "Rear-Wheel Drive Standard",
        "range": "272 miles",
        "acceleration": "5.8s 0-60 mph",
        "topSpeed": "125 mph",
        "drivetrain": "Single Motor RWD",
        "basePrice": 23178
      },
      {
        "id": "m3-lrawd",
        "name": "Long Range All-Wheel Drive",
        "range": "341 miles",
        "acceleration": "4.2s 0-60 mph",
        "topSpeed": "125 mph",
        "drivetrain": "Dual Motor AWD",
        "basePrice": 27500
      },
      {
        "id": "m3-perf",
        "name": "Performance All-Wheel Drive",
        "range": "303 miles",
        "acceleration": "2.9s 0-60 mph",
        "topSpeed": "163 mph",
        "drivetrain": "Dual Motor Performance AWD",
        "basePrice": 32900
      }
    ],
    "originalPrice": 38990,
    "promotionalPrice": 23178,
    "promotionalLabel": "Management Promotional Price",
    "availability": "Available for Order",
    "isFeatured": true,
    "performanceHighlights": [
      "Refined sport suspension with adaptive frequency-selective damping",
      "Ultra-low 0.219 drag coefficient for maximum efficiency",
      "Track Mode V3 on Performance trim"
    ],
    "interiorHighlights": [
      "15.4-inch center touchscreen with ultra-thin bezel",
      "8-inch rear passenger display for climate & media controls",
      "Acoustic glass with 360-degree cabin sound dampening"
    ],
    "safetyHighlights": [
      "5-Star overall safety rating in all categories and subcategories",
      "Rigid steel and aluminum unibody passenger cell structure",
      "Active emergency braking, lane departure avoidance & side collision warning"
    ],
    "chargingHighlights": [
      "Access to 50,000+ Tesla Superchargers worldwide",
      "Up to 250 kW peak charging speeds",
      "Automated battery preconditioning for rapid stopovers"
    ],
    "pricingNotes": "Final pricing confirmed during authorized documentation review based on options and local duties.",
    "effectiveDate": "2026-08-01",
    "expirationDate": "2026-12-31",
    "eligibilityRequirements": "Applicable to authorized client inquiries with confirmed allocation voucher."
  },
  {
    "id": "model-y",
    "name": "Model Y",
    "modelCode": "MY-2026",
    "tagline": "Versatile Mid-Size Electric Crossover SUV",
    "description": "The best-selling all-electric crossover SUV engineered with maximum cargo versatility, elevated ride height, and all-weather capability.",
    "category": "suv",
    "imageUrl": "/uploads/model-y-img-1787823311496-e945c3bf.webp",
    "galleryImages": [
      "/uploads/model-y-img-1787823311496-e945c3bf.webp",
      "/uploads/model-y-img-1787823312906-e5d7e6e9.webp"
    ],
    "colors": [
      {
        "id": "my-pearl-white",
        "name": "Pearl White Multi-Coat",
        "hex": "#F4F5F7",
        "images": [
          "/uploads/model-y-img-1787823311496-e945c3bf.webp",
          "/uploads/model-y-img-1787823312906-e5d7e6e9.webp"
        ]
      },
      {
        "id": "my-diamond-black",
        "name": "Diamond Black",
        "hex": "#111215",
        "images": [
          "/uploads/model-y-img-1787823311496-e945c3bf.webp",
          "/uploads/model-y-img-1787823312906-e5d7e6e9.webp"
        ]
      },
      {
        "id": "my-glacier-blue",
        "name": "Glacier Blue",
        "hex": "#55758C",
        "images": [
          "/uploads/model-y-img-1787823311496-e945c3bf.webp",
          "/uploads/model-y-img-1787823312906-e5d7e6e9.webp"
        ]
      },
      {
        "id": "my-stealth-gray",
        "name": "Stealth Gray",
        "hex": "#3D4148",
        "images": [
          "/uploads/model-y-img-1787823311496-e945c3bf.webp",
          "/uploads/model-y-img-1787823312906-e5d7e6e9.webp"
        ]
      },
      {
        "id": "my-quicksilver",
        "name": "Quicksilver",
        "hex": "#7A808A",
        "images": [
          "/uploads/model-y-img-1787823311496-e945c3bf.webp",
          "/uploads/model-y-img-1787823312906-e5d7e6e9.webp"
        ]
      },
      {
        "id": "my-ultra-red",
        "name": "Ultra Red",
        "hex": "#96151D",
        "images": [
          "/uploads/model-y-img-1787823311496-e945c3bf.webp",
          "/uploads/model-y-img-1787823312906-e5d7e6e9.webp"
        ]
      }
    ],
    "specs": {
      "range": "310 miles (EPA est.)",
      "acceleration": "3.5s 0-60 mph (Performance)",
      "topSpeed": "155 mph",
      "drivetrain": "Dual Motor All-Wheel Drive",
      "seating": "5 to 7 Adults",
      "cargoCapacity": "76 cu ft maximum storage",
      "chargingRate": "Up to 162 miles in 15 min",
      "payloadOrTowing": "3,500 lbs towing capacity"
    },
    "configurations": [
      {
        "id": "my-lrawd",
        "name": "Long Range All-Wheel Drive",
        "range": "310 miles",
        "acceleration": "4.8s 0-60 mph",
        "topSpeed": "135 mph",
        "drivetrain": "Dual Motor AWD",
        "basePrice": 23994
      },
      {
        "id": "my-perf",
        "name": "Performance All-Wheel Drive",
        "range": "279 miles",
        "acceleration": "3.5s 0-60 mph",
        "topSpeed": "155 mph",
        "drivetrain": "Performance Dual Motor AWD",
        "basePrice": 29500
      },
      {
        "id": "my-rwd",
        "name": "Standard Range Rear-Wheel Drive",
        "range": "260 miles",
        "acceleration": "6.6s 0-60 mph",
        "topSpeed": "135 mph",
        "drivetrain": "Single Motor RWD",
        "basePrice": 21900
      }
    ],
    "originalPrice": 44990,
    "promotionalPrice": 23994,
    "promotionalLabel": "Management Promotional Price",
    "availability": "Available for Order",
    "isFeatured": true,
    "performanceHighlights": [
      "Independent digital motors controlling torque to front and rear wheels in milliseconds",
      "Off-road assist mode and dedicated snow traction control",
      "Lower center of gravity for superior rollover protection"
    ],
    "interiorHighlights": [
      "Panoramic all-glass roof with ultraviolet and infrared protection",
      "Expansive second-row legroom with adjustable seat backs",
      "Power liftgate with deep sub-trunk storage wells"
    ],
    "safetyHighlights": [
      "Top Safety Pick+ award winner with ultra-high-strength steel pillars",
      "Active safety suite including blind spot collision warning and obstacle-aware acceleration"
    ],
    "chargingHighlights": [
      "High-speed NACS charging compatibility",
      "Integrated route planner optimizing Supercharger stops globally"
    ],
    "pricingNotes": "Subject to inventory status and authorized management approval.",
    "effectiveDate": "2026-08-01",
    "expirationDate": "2026-12-31"
  },
  {
    "id": "model-y-l",
    "name": "Model Y L",
    "modelCode": "MYL-2026",
    "tagline": "Extended Wheelbase Luxury Executive Crossover",
    "description": "Authorized extended-wheelbase specification featuring executive rear captain seating, enhanced legroom, premium sound isolation, and dual lounge consoles.",
    "category": "suv",
    "imageUrl": "/uploads/model-y-l-img-1787823336064-e27f2f43.webp",
    "galleryImages": [
      "/uploads/model-y-l-img-1787823336064-e27f2f43.webp",
      "/uploads/model-y-l-img-1787823337645-a8db7ab1.webp"
    ],
    "colors": [
      {
        "id": "myl-cosmic-silver",
        "name": "Cosmic Silver",
        "hex": "#8E939C",
        "images": [
          "/uploads/model-y-l-img-1787823336064-e27f2f43.webp",
          "/uploads/model-y-l-img-1787823337645-a8db7ab1.webp"
        ]
      },
      {
        "id": "myl-ultra-red",
        "name": "Ultra Red",
        "hex": "#96151D",
        "images": [
          "/uploads/model-y-l-img-1787823336064-e27f2f43.webp",
          "/uploads/model-y-l-img-1787823337645-a8db7ab1.webp"
        ]
      },
      {
        "id": "myl-diamond-black",
        "name": "Diamond Black",
        "hex": "#111215",
        "images": [
          "/uploads/model-y-l-img-1787823336064-e27f2f43.webp",
          "/uploads/model-y-l-img-1787823337645-a8db7ab1.webp"
        ]
      },
      {
        "id": "myl-marine-blue",
        "name": "Marine Blue",
        "hex": "#1C3F60",
        "images": [
          "/uploads/model-y-l-img-1787823336064-e27f2f43.webp",
          "/uploads/model-y-l-img-1787823337645-a8db7ab1.webp"
        ]
      },
      {
        "id": "myl-pearl-white",
        "name": "Pearl White",
        "hex": "#F4F5F7",
        "images": [
          "/uploads/model-y-l-img-1787823336064-e27f2f43.webp",
          "/uploads/model-y-l-img-1787823337645-a8db7ab1.webp"
        ]
      },
      {
        "id": "myl-stealth-gray",
        "name": "Stealth Gray",
        "hex": "#3D4148",
        "images": [
          "/uploads/model-y-l-img-1787823336064-e27f2f43.webp",
          "/uploads/model-y-l-img-1787823337645-a8db7ab1.webp"
        ]
      }
    ],
    "specs": {
      "range": "335 miles (EPA est.)",
      "acceleration": "4.1s 0-60 mph",
      "topSpeed": "145 mph",
      "drivetrain": "Dual Motor All-Wheel Drive",
      "seating": "4 or 6 Executive Passenger Layout",
      "cargoCapacity": "82 cu ft maximum storage",
      "chargingRate": "Up to 170 miles in 15 min",
      "payloadOrTowing": "3,800 lbs towing capacity"
    },
    "configurations": [
      {
        "id": "myl-exec",
        "name": "Executive Lounge AWD",
        "range": "335 miles",
        "acceleration": "4.1s 0-60 mph",
        "topSpeed": "145 mph",
        "drivetrain": "Dual Motor AWD",
        "basePrice": 37194
      },
      {
        "id": "myl-lounge",
        "name": "Grand Touring AWD",
        "range": "350 miles",
        "acceleration": "4.4s 0-60 mph",
        "topSpeed": "140 mph",
        "drivetrain": "Dual Motor AWD",
        "basePrice": 39500
      }
    ],
    "originalPrice": 52490,
    "promotionalPrice": 37194,
    "promotionalLabel": "Management Promotional Price",
    "availability": "Limited Allocation",
    "isFeatured": true,
    "performanceHighlights": [
      "Calibrated executive smooth-ride air suspension",
      "Whisper-quiet electric powertrain acoustics"
    ],
    "interiorHighlights": [
      "Power reclining rear executive massage seating",
      "Dual 10-inch rear entertainment monitors with wireless audio",
      "Executive work fold-out tables and chilled beverage compartment"
    ],
    "safetyHighlights": [
      "Reinforced long-wheelbase chassis with active side impact deflection",
      "Complete 360-degree vision camera architecture"
    ],
    "chargingHighlights": [
      "Fast Supercharging with thermal battery management"
    ],
    "pricingNotes": "Limited allocation reservation with verified executive client status.",
    "effectiveDate": "2026-08-01",
    "expirationDate": "2026-12-31"
  },
  {
    "id": "cybertruck",
    "name": "Cybertruck",
    "modelCode": "CT-2026",
    "tagline": "Ultra-Hard 30X Cold-Rolled Stainless-Steel Exoskeleton",
    "description": "Built with an impenetrable exterior exoskeleton, shatter-resistant Armor Glass, 4-wheel steer-by-wire agility, and up to 11,000 lbs of towing power.",
    "category": "truck",
    "imageUrl": "/uploads/cybertruck-main-1787823385132-f3d687cd.webp",
    "galleryImages": [
      "/uploads/cybertruck-main-1787823385132-f3d687cd.webp",
      "/uploads/cybertruck-gal-0-1787823385132-4a3fc8e7.webp",
      "/uploads/cybertruck-img-1787823380357-16448ec1.webp"
    ],
    "colors": [
      {
        "id": "ct-shield-black",
        "name": "Shield Black",
        "hex": "#1A1B1E",
        "images": [
          "/uploads/cybertruck-main-1787823385132-f3d687cd.webp",
          "/uploads/cybertruck-gal-0-1787823385132-4a3fc8e7.webp",
          "/uploads/cybertruck-img-1787823380357-16448ec1.webp"
        ]
      }
    ],
    "specs": {
      "range": "340 miles (470+ mi with Range Extender)",
      "acceleration": "2.6s 0-60 mph (Cyberbeast)",
      "topSpeed": "130 mph",
      "drivetrain": "Dual Motor AWD / Tri-Motor Cyberbeast",
      "seating": "5 Adults",
      "cargoCapacity": "120.9 cu ft lockable vault + frunk",
      "chargingRate": "Up to 136 miles in 15 min (800V architecture)",
      "payloadOrTowing": "11,000 lbs towing / 2,500 lbs payload"
    },
    "configurations": [
      {
        "id": "ct-awd",
        "name": "All-Wheel Drive (Dual Motor)",
        "range": "340 miles",
        "acceleration": "4.1s 0-60 mph",
        "topSpeed": "112 mph",
        "drivetrain": "Dual Motor AWD",
        "basePrice": 49341
      },
      {
        "id": "ct-beast",
        "name": "Cyberbeast (Tri-Motor)",
        "range": "320 miles",
        "acceleration": "2.6s 0-60 mph",
        "topSpeed": "130 mph",
        "drivetrain": "Tri-Motor AWD",
        "basePrice": 68500
      },
      {
        "id": "ct-rwd",
        "name": "Rear-Wheel Drive (Future Production)",
        "range": "250 miles",
        "acceleration": "6.5s 0-60 mph",
        "topSpeed": "112 mph",
        "drivetrain": "Single Motor RWD",
        "basePrice": 44000
      }
    ],
    "originalPrice": 79990,
    "promotionalPrice": 42341,
    "promotionalLabel": "Management Promotional Price",
    "availability": "Limited Allocation",
    "isFeatured": true,
    "performanceHighlights": [
      "800V electrical architecture for ultra-high-rate charging",
      "True steer-by-wire variable steering ratio with active rear-wheel steering",
      "Adaptive air suspension with up to 17 inches of ground clearance"
    ],
    "interiorHighlights": [
      "18.5-inch infinity center touchscreen & 9.4-inch rear entertainment display",
      "Integrated 120V & 240V bed power outlets (up to 11.5 kW onboard power for job sites)",
      "Motorized lockable vault tonneau cover strong enough to stand on"
    ],
    "safetyHighlights": [
      "Ultra-hard 30X cold-rolled stainless-steel structural skin resists dents and scratches",
      "Armor Glass withstands class 4 hail and high-velocity road debris"
    ],
    "chargingHighlights": [
      "Powershare vehicle-to-home and vehicle-to-load bidirectional capability"
    ],
    "pricingNotes": "Management promotional pricing available on confirmed authorized allocations.",
    "effectiveDate": "2026-08-01",
    "expirationDate": "2026-12-31"
  },
  {
    "id": "model-s",
    "name": "Model S",
    "modelCode": "MS-2026",
    "tagline": "The Pinnacle of Electric Luxury & Acceleration",
    "description": "Unrivaled acceleration, ultra-long range, iconic liftback silhouette, tri-motor Plaid performance, and tri-zone climate luxury.",
    "category": "sedan",
    "imageUrl": "/uploads/model-s-img-1787823409678-655c31fd.webp",
    "galleryImages": [
      "/uploads/model-s-img-1787823409678-655c31fd.webp",
      "/uploads/model-s-img-1787823411499-f77af729.webp"
    ],
    "colors": [
      {
        "id": "ms-stealth-gray",
        "name": "Stealth Gray",
        "hex": "#3D4148",
        "images": [
          "/uploads/model-s-img-1787823409678-655c31fd.webp",
          "/uploads/model-s-img-1787823411499-f77af729.webp"
        ]
      },
      {
        "id": "ms-diamond-black",
        "name": "Diamond Black",
        "hex": "#111215",
        "images": [
          "/uploads/model-s-img-1787823409678-655c31fd.webp",
          "/uploads/model-s-img-1787823411499-f77af729.webp"
        ]
      },
      {
        "id": "ms-frost-blue",
        "name": "Frost Blue Metallic",
        "hex": "#546E7A",
        "images": [
          "/uploads/model-s-img-1787823409678-655c31fd.webp",
          "/uploads/model-s-img-1787823411499-f77af729.webp"
        ]
      },
      {
        "id": "ms-lunar-silver",
        "name": "Lunar Silver",
        "hex": "#9EADB8",
        "images": [
          "/uploads/model-s-img-1787823409678-655c31fd.webp",
          "/uploads/model-s-img-1787823411499-f77af729.webp"
        ]
      },
      {
        "id": "ms-pearl-white",
        "name": "Pearl White Multi-Coat",
        "hex": "#F4F5F7",
        "images": [
          "/uploads/model-s-img-1787823409678-655c31fd.webp",
          "/uploads/model-s-img-1787823411499-f77af729.webp"
        ]
      },
      {
        "id": "ms-ultra-red",
        "name": "Ultra Red",
        "hex": "#96151D",
        "images": [
          "/uploads/model-s-img-1787823409678-655c31fd.webp",
          "/uploads/model-s-img-1787823411499-f77af729.webp"
        ]
      }
    ],
    "specs": {
      "range": "402 miles (EPA est.)",
      "acceleration": "1.99s 0-60 mph (Plaid)",
      "topSpeed": "200 mph",
      "drivetrain": "Dual Motor AWD / Tri-Motor Plaid AWD",
      "seating": "5 Adults",
      "cargoCapacity": "28 cu ft trunk + frunk",
      "chargingRate": "Up to 200 miles in 15 min",
      "payloadOrTowing": "1,020 hp peak output"
    },
    "configurations": [
      {
        "id": "ms-awd",
        "name": "Model S Dual Motor AWD",
        "range": "402 miles",
        "acceleration": "3.1s 0-60 mph",
        "topSpeed": "130 mph",
        "drivetrain": "Dual Motor AWD",
        "basePrice": 53994
      },
      {
        "id": "ms-plaid",
        "name": "Model S Plaid (Tri-Motor)",
        "range": "359 miles",
        "acceleration": "1.99s 0-60 mph",
        "topSpeed": "200 mph",
        "drivetrain": "Tri-Motor Carbon-Sleeved AWD",
        "basePrice": 69900
      }
    ],
    "originalPrice": 74990,
    "promotionalPrice": 39994,
    "promotionalLabel": "Management Promotional Price",
    "availability": "Available for Order",
    "isFeatured": true,
    "performanceHighlights": [
      "1,020 horsepower with torque vectoring across three independent carbon-sleeved rotors",
      "World-record 0.208 drag coefficient for effortless highway cruising",
      "Adaptive air suspension with automatic GPS-based height memory"
    ],
    "interiorHighlights": [
      "17-inch cinematic tilting center display with 2200x1300 resolution",
      "22-speaker, 960-watt audio system with active road noise reduction",
      "Wireless gaming computer with 10 teraflops of processing capability"
    ],
    "safetyHighlights": [
      "Reinforced battery architecture shielding passenger compartment",
      "Standard Autopilot and full suite of 360-degree neural network optical cameras"
    ],
    "chargingHighlights": [
      "250 kW high-speed Supercharging with automatic battery temperature optimization"
    ],
    "pricingNotes": "Authorized promotional rate valid for selected corporate and private client requests.",
    "effectiveDate": "2026-08-01",
    "expirationDate": "2026-12-31"
  },
  {
    "id": "model-x",
    "name": "Model X",
    "modelCode": "MX-2026",
    "tagline": "Falcon Wing Flagship Luxury SUV",
    "description": "Signature Falcon Wing rear doors, panoramic windshield, unmatched acceleration, three-row luxury seating, and 5,000 lbs towing capacity.",
    "category": "suv",
    "imageUrl": "/uploads/model-x-img-1787823435675-d840c478.webp",
    "galleryImages": [
      "/uploads/model-x-img-1787823435675-d840c478.webp",
      "/uploads/model-x-img-1787823437292-778d50cf.webp"
    ],
    "colors": [
      {
        "id": "mx-stealth-gray",
        "name": "Stealth Gray",
        "hex": "#3D4148",
        "images": [
          "/uploads/model-x-img-1787823435675-d840c478.webp",
          "/uploads/model-x-img-1787823437292-778d50cf.webp"
        ]
      },
      {
        "id": "mx-diamond-black",
        "name": "Diamond Black",
        "hex": "#111215",
        "images": [
          "/uploads/model-x-img-1787823435675-d840c478.webp",
          "/uploads/model-x-img-1787823437292-778d50cf.webp"
        ]
      },
      {
        "id": "mx-frost-blue",
        "name": "Frost Blue Metallic",
        "hex": "#546E7A",
        "images": [
          "/uploads/model-x-img-1787823435675-d840c478.webp",
          "/uploads/model-x-img-1787823437292-778d50cf.webp"
        ]
      },
      {
        "id": "mx-lunar-silver",
        "name": "Lunar Silver",
        "hex": "#9EADB8",
        "images": [
          "/uploads/model-x-img-1787823435675-d840c478.webp",
          "/uploads/model-x-img-1787823437292-778d50cf.webp"
        ]
      },
      {
        "id": "mx-pearl-white",
        "name": "Pearl White Multi-Coat",
        "hex": "#F4F5F7",
        "images": [
          "/uploads/model-x-img-1787823435675-d840c478.webp",
          "/uploads/model-x-img-1787823437292-778d50cf.webp"
        ]
      },
      {
        "id": "mx-ultra-red",
        "name": "Ultra Red",
        "hex": "#96151D",
        "images": [
          "/uploads/model-x-img-1787823435675-d840c478.webp",
          "/uploads/model-x-img-1787823437292-778d50cf.webp"
        ]
      }
    ],
    "specs": {
      "range": "335 miles (EPA est.)",
      "acceleration": "2.5s 0-60 mph (Plaid)",
      "topSpeed": "163 mph",
      "drivetrain": "Dual Motor AWD / Tri-Motor Plaid AWD",
      "seating": "5, 6 or 7 Adults",
      "cargoCapacity": "88 cu ft maximum storage",
      "chargingRate": "Up to 175 miles in 15 min",
      "payloadOrTowing": "5,000 lbs towing capacity"
    },
    "configurations": [
      {
        "id": "mx-awd",
        "name": "Model X Dual Motor AWD",
        "range": "335 miles",
        "acceleration": "3.8s 0-60 mph",
        "topSpeed": "149 mph",
        "drivetrain": "Dual Motor AWD",
        "basePrice": 59994
      },
      {
        "id": "mx-plaid",
        "name": "Model X Plaid (Tri-Motor)",
        "range": "326 miles",
        "acceleration": "2.5s 0-60 mph",
        "topSpeed": "163 mph",
        "drivetrain": "Tri-Motor Plaid AWD",
        "basePrice": 76000
      }
    ],
    "originalPrice": 79990,
    "promotionalPrice": 40024,
    "promotionalLabel": "Management Promotional Price",
    "availability": "Available for Order",
    "isFeatured": true,
    "performanceHighlights": [
      "Fastest accelerating production SUV in history (0-60 mph in 2.5s)",
      "Intelligent all-wheel drive with instant torque modulation"
    ],
    "interiorHighlights": [
      "Motorized Falcon Wing doors with ultrasonic distance clearance sensors",
      "Largest all-glass panoramic windshield in production",
      "Six-passenger captain chair configuration with power tilt and slide"
    ],
    "safetyHighlights": [
      "Lowest rollover risk of any SUV tested by NHTSA",
      "HEPA air filtration system with Bioweapon Defense Mode"
    ],
    "chargingHighlights": [
      "Supercharging network integration with pre-conditioning"
    ],
    "pricingNotes": "Authorized management promotional pricing subject to inventory matching.",
    "effectiveDate": "2026-08-01",
    "expirationDate": "2026-12-31"
  },
  {
    "id": "roadster",
    "name": "Roadster",
    "modelCode": "RD-2026",
    "tagline": "Supercar Performance & Record-Setting Aerodynamics",
    "description": "An all-electric supercar designed to maximize the potential of aerodynamic engineering into record-setting performance and efficiency.",
    "category": "specialty",
    "imageUrl": "/uploads/roadster-img-1787823468050-f328c50f.webp",
    "galleryImages": [
      "/uploads/roadster-img-1787823468050-f328c50f.webp",
      "/uploads/roadster-img-1787823470727-0d61c75a.webp"
    ],
    "specs": {
      "range": "620 miles",
      "acceleration": "1.9s 0-60 mph (sub-1s with thruster package)",
      "topSpeed": "250+ mph",
      "drivetrain": "All-Wheel Drive Tri-Motor",
      "seating": "4 Passengers (2+2)",
      "cargoCapacity": "Removable lightweight glass roof trunk",
      "chargingRate": "High-Density 350 kW Support",
      "payloadOrTowing": "10,000 Nm wheel torque"
    },
    "configurations": [
      {
        "id": "rd-base",
        "name": "Roadster Founders Series Reservation",
        "range": "620 miles",
        "acceleration": "1.9s 0-60 mph",
        "topSpeed": "250+ mph",
        "drivetrain": "Tri-Motor All-Wheel Drive",
        "basePrice": 120000
      }
    ],
    "originalPrice": 200000,
    "promotionalPrice": 98950,
    "promotionalLabel": "Management Promotional Price",
    "availability": "Reservation Inquiry",
    "isFeatured": false,
    "performanceHighlights": [
      "10,000 Nm wheel torque delivering breathtaking launches",
      "Sub-8.8 second quarter-mile run capability",
      "Active aero rear wing and ground effect diffuser"
    ],
    "interiorHighlights": [
      "Lightweight removable glass roof storing neatly in trunk",
      "Minimalist driver-centric cockpit with curved OLED interface"
    ],
    "safetyHighlights": [
      "Carbon-composite passenger safety cell with energy-absorbing crash structures"
    ],
    "chargingHighlights": [
      "200 kWh battery pack with dual-phase thermal management"
    ],
    "pricingNotes": "Reservation inquiry via authorized management allocation protocol only.",
    "effectiveDate": "2026-08-01",
    "expirationDate": "2026-12-31"
  },
  {
    "id": "cybercab",
    "name": "Cybercab",
    "modelCode": "CC-2026",
    "tagline": "Dedicated Autonomous Point-to-Point Mobility",
    "description": "Designed exclusively for autonomous, driverless transportation with butterfly doors, inductive wireless charging, and zero steering wheel or pedal clutter.",
    "category": "specialty",
    "imageUrl": "/uploads/cybercab-img-1787823516325-2cd8a297.webp",
    "galleryImages": [
      "/uploads/cybercab-img-1787823516325-2cd8a297.webp",
      "/uploads/cybercab-img-1787823517557-abadf8e2.webp"
    ],
    "specs": {
      "range": "200+ miles per charge",
      "acceleration": "Autonomous speed control",
      "topSpeed": "110 mph",
      "drivetrain": "High-Efficiency Single Motor Rear Drive",
      "seating": "2 Passengers with generous luggage space",
      "cargoCapacity": "Spacious rear luggage trunk for two full suitcases",
      "chargingRate": "100% Inductive Wireless Pad Charging",
      "payloadOrTowing": "Dedicated fleet autonomy architecture"
    },
    "configurations": [
      {
        "id": "cc-autonomous",
        "name": "Cybercab Fleet Edition",
        "range": "200+ miles",
        "acceleration": "Autonomous Speed Regulation",
        "topSpeed": "110 mph",
        "drivetrain": "Rear-Wheel Drive Autonomous",
        "basePrice": 180000
      }
    ],
    "originalPrice": 90000,
    "promotionalPrice": 42050,
    "promotionalLabel": "Management Promotional Price",
    "availability": "Production Preview",
    "isFeatured": false,
    "performanceHighlights": [
      "Next-generation AI 4 Full Self-Driving hardware platform",
      "No mechanical steering column or pedal assemblies"
    ],
    "interiorHighlights": [
      "Large 21-inch passenger media and route display",
      "Dual ergonomic reclining lounge chairs with easy-clean sustainable fabrics",
      "Upward-opening motorized butterfly doors for effortless curbside ingress"
    ],
    "safetyHighlights": [
      "Complete sensor redundancy and fail-operational compute architecture"
    ],
    "chargingHighlights": [
      "Hands-free wireless inductive charging - no cables or plugs needed"
    ],
    "pricingNotes": "Commercial and fleet interest inquiry. Subject to regulatory approvals.",
    "effectiveDate": "2026-08-01",
    "expirationDate": "2026-12-31"
  },
  {
    "id": "tesla-semi",
    "name": "Tesla Semi",
    "modelCode": "SEMI-2026",
    "tagline": "Heavy-Duty Class 8 Electric Freight Hauler",
    "description": "Revolutionary heavy-duty commercial freight semi with center-driver cockpit, 3 independent electric motors, and massive operating cost savings.",
    "category": "commercial",
    "imageUrl": "/uploads/tesla-semi-img-1787823564730-12700a8c.webp",
    "galleryImages": [
      "/uploads/tesla-semi-img-1787823564730-12700a8c.webp",
      "/uploads/tesla-semi-img-1787823565584-ade2c135.webp"
    ],
    "specs": {
      "range": "500 miles at 82,000 lbs gross combination weight",
      "acceleration": "0-60 mph in 20s with full 82,000 lbs load",
      "topSpeed": "65 mph highway cruising on a 5% grade",
      "drivetrain": "Tri-Motor Rear Axle Electric Drive",
      "seating": "Center Captain Seat + Passenger Jump Seat",
      "cargoCapacity": "Class 8 semi-truck trailer connection",
      "chargingRate": "Megawatt Charging (Up to 70% in 30 minutes)",
      "payloadOrTowing": "82,000 lbs GCW Rating"
    },
    "configurations": [
      {
        "id": "semi-300",
        "name": "Tesla Semi 300-Mile Range",
        "range": "300 miles fully loaded",
        "acceleration": "20s 0-60 mph (loaded)",
        "topSpeed": "65 mph",
        "drivetrain": "Tri-Motor Rear Axles",
        "basePrice": 90000
      },
      {
        "id": "semi-500",
        "name": "Tesla Semi 500-Mile Range",
        "range": "500 miles fully loaded",
        "acceleration": "20s 0-60 mph (loaded)",
        "topSpeed": "65 mph",
        "drivetrain": "Tri-Motor Rear Axles",
        "basePrice": 110000
      }
    ],
    "originalPrice": 150000,
    "promotionalPrice": 90000,
    "promotionalLabel": "Management Promotional Price",
    "availability": "Limited Allocation",
    "isFeatured": false,
    "performanceHighlights": [
      "Maintains 65 mph highway speeds uphill on a 5% continuous highway grade",
      "Regenerative braking recuperates majority of kinetic energy on descents"
    ],
    "interiorHighlights": [
      "Centered driver seating position providing unparalleled road visibility",
      "Dual 15-inch touchscreens flanking the steering wheel for navigation and blind-spot monitoring"
    ],
    "safetyHighlights": [
      "Active traction and torque control preventing jackknifing under extreme road conditions",
      "Low center of gravity with battery pack mounted low within frame rails"
    ],
    "chargingHighlights": [
      "Compatible with high-power Megawatt Charging System (MCS)"
    ],
    "pricingNotes": "Commercial fleet inquiry pricing subject to fleet contract terms and delivery region.",
    "effectiveDate": "2026-08-01",
    "expirationDate": "2026-12-31"
  }
];
