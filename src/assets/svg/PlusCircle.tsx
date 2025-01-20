import * as React from "react";
import type { SVGProps } from "react";
const PlusCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#000"
      fillRule="evenodd"
      d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12"
      clipRule="evenodd"
    />
    <path
      fill="#000"
      fillRule="evenodd"
      d="M12 7a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1"
      clipRule="evenodd"
    />
    <path
      fill="#000"
      fillRule="evenodd"
      d="M7 12a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1"
      clipRule="evenodd"
    />
  </svg>
);
export default PlusCircle;
