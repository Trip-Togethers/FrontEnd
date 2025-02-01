import type { SVGProps } from "react";
const Bookmark = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="mask0_1102_6195"
			style={{
        maskType: "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="24"
      height="24"
    >
      <path d="M0 0H24V24H0V0Z" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_1102_6195)">
      <path
        d="M5 21V5C5 4.45 5.19583 3.97917 5.5875 3.5875C5.97917 3.19583 6.45 3 7 3H17C17.55 3 18.0208 3.19583 18.4125 3.5875C18.8042 3.97917 19 4.45 19 5V21L12 18L5 21ZM7 17.95L12 15.8L17 17.95V5H7V17.95Z"
        fill="#1C1B1F"
      />
    </g>
  </svg>
);
export default Bookmark;
