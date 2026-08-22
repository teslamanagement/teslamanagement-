import React from 'react';

interface TeslaWordmarkProps {
  className?: string;
  color?: string;
  id?: string;
}

/**
 * Custom Tesla-inspired geometric vector wordmark
 * Precision-crafted vector geometry matching the official automotive wordmark:
 * - Bold uniform strokes with sharp angular corners
 * - Characteristic chamfered finials on T, E, S, L, and A
 * - Distinctive 3-bar aerodynamic E and floating-roof A
 * - Wide futuristic character spacing
 */
export const TeslaWordmark: React.FC<TeslaWordmarkProps> = ({
  className = 'h-4 w-auto',
  color = 'currentColor',
  id,
}) => {
  return (
    <svg
      id={id}
      viewBox="0 0 342 35"
      className={className}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="TESLA"
      role="img"
      style={{ shapeRendering: 'geometricPrecision' }}
    >
      {/* T: Top horizontal bar with tapered outer cuts, vertical center stem */}
      <path d="M0.2 0.5h48.3l-2.5 5.9H27.1v28.1H21.2V6.4H2.7L0.2 0.5z" />

      {/* E: Three distinct floating aerodynamic horizontal bars */}
      {/* Top bar: sharp top-left point with angled under-bevel */}
      <path d="M72.5 0.5h44.8v5.9H75.0L72.5 0.5z" />
      {/* Middle bar: centered floating bar with aerodynamic leading edge */}
      <path d="M75.0 14.6h42.3v5.9H75.0l-2.5-2.95 2.5-2.95z" />
      {/* Bottom bar: sharp bottom-left point with angled upper-bevel */}
      <path d="M75.0 28.7h42.3v5.9H72.5l2.5-5.9z" />

      {/* S: Stylized geometric S with sharp angular finials and crisp rectangular corners */}
      <path d="M144.5 0.5h45.2l-2.5 5.9h-36.8v8.0h39.3v20.2h-45.2l2.5-5.9h36.8v-8.3h-39.3V0.5z" />

      {/* L: Straight vertical stem with bottom leg terminating in a sharp angular facet */}
      <path d="M216.2 0.5h5.9v28.2h36.8l2.5 5.9h-45.2V0.5z" />

      {/* A: Characteristic two-piece architecture */}
      {/* Floating roof bar with dual angled finials */}
      <path d="M288.0 0.5h45.2l-2.5 5.9h-40.2L288.0 0.5z" />
      {/* Lower goalpost bridge with crisp rectangular inner negative space */}
      <path d="M288.0 14.6h45.2v20.0h-5.9V20.5h-33.4v14.1h-5.9V14.6z" />
    </svg>
  );
};

