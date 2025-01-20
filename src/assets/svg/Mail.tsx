import * as React from "react";
import type { SVGProps } from "react";
const Mail = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#000"
      fillRule="evenodd"
      d="M4 5c-.548 0-1 .452-1 1v12c0 .548.452 1 1 1h16c.548 0 1-.452 1-1V6c0-.548-.452-1-1-1zM1 6c0-1.652 1.348-3 3-3h16c1.652 0 3 1.348 3 3v12c0 1.652-1.348 3-3 3H4c-1.652 0-3-1.348-3-3z"
      clipRule="evenodd"
    />
    <path
      fill="#000"
      fillRule="evenodd"
      d="M1.18 5.427a1 1 0 0 1 1.393-.246L12 11.779l9.427-6.598a1 1 0 0 1 1.146 1.638l-10 7a1 1 0 0 1-1.146 0l-10-7a1 1 0 0 1-.246-1.392"
      clipRule="evenodd"
    />
  </svg>
);
export default Mail;
