import type { FC } from 'react';

export const FlashIcon: FC<any> = ({ ...props }) => {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6 0L10.2426 1.75736L12 6L10.2426 10.2426L6 12L1.75736 10.2426L0 6L1.75736 1.75736L6 0Z"
        fill="#2E71FF"
      />
      <path
        d="M5.39785 6.51153H4.21977C4.06594 6.51153 3.95987 6.35762 4.01457 6.2139L5.1852 3.1414C5.21761 3.05625 5.29924 3 5.39031 3H7.36559C7.52148 3 7.62772 3.15786 7.5689 3.30226L6.88729 4.97528H8.17042C8.35915 4.97528 8.45981 5.19771 8.33531 5.33954L5.1894 8.92413C5.03651 9.09845 4.75295 8.94745 4.81228 8.72331L5.39785 6.51153Z"
        fill="white"
      />
    </svg>
  );
};

export const ArrowIcon: FC<any> = ({ ...props }) => {
  return (
    <svg
      width="44"
      height="7"
      viewBox="0 0 44 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <line x1="40.5" y1="3.5" x2="0.5" y2="3.5" stroke="#9699A3" />
      <path d="M44 3.5L40.25 6.09808L40.25 0.901924L44 3.5Z" fill="#9699A3" />
    </svg>
  );
};
