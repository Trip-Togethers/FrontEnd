import * as React from "react";
import type { SVGProps } from "react";
const Bell = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#000"
      fillRule="evenodd"
      d="M7.05 3.05A7 7 0 0 1 19 8c0 3.353.717 5.435 1.378 6.646.332.608.655 1.007.88 1.244a3 3 0 0 0 .306.284l.002.002A1 1 0 0 1 21 18H3a1 1 0 0 1-.563-1.826l.052-.042c.053-.044.141-.123.254-.242.224-.237.547-.636.88-1.244C4.282 13.435 5 11.353 5 8a7 7 0 0 1 2.05-4.95M5.15 16h13.702a9 9 0 0 1-.229-.396C17.782 14.065 17 11.647 17 8A5 5 0 0 0 7 8c0 3.647-.783 6.065-1.622 7.604q-.114.21-.229.396M9.768 20.135a1 1 0 0 1 1.367.363 1 1 0 0 0 1.73 0 1 1 0 0 1 1.73 1.004 3 3 0 0 1-5.19 0 1 1 0 0 1 .363-1.367"
      clipRule="evenodd"
    />
  </svg>
);
export default Bell;
