import * as React from "react";
import type { SVGProps } from "react";
const SvgDottedLine = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 358 7"
    {...props}
  >
    <path
      stroke="#006D24"
      strokeDasharray="6 8"
      strokeWidth={6}
      d="M.748 3.037h357.177"
    />
  </svg>
);
export default SvgDottedLine;
