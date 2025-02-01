import type { SVGProps } from "react";
const Cafe = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="arrow_svg__a"
      width={24}
      height={24}
      x={0}
      y={0}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "alpha",
      }}
    >
      <path d="M0 0H24V24H0V0Z" fill="#D9D9D9" />
    </mask>
    <g mask="url(#arrow_svg__a)">
      <path
        d="M4 21V19H20V21H4ZM8 17C6.9 17 5.95833 16.6083 5.175 15.825C4.39167 15.0417 4 14.1 4 13V3H20C20.55 3 21.0208 3.19583 21.4125 3.5875C21.8042 3.97917 22 4.45 22 5V8C22 8.55 21.8042 9.02083 21.4125 9.4125C21.0208 9.80417 20.55 10 20 10H18V13C18 14.1 17.6083 15.0417 16.825 15.825C16.0417 16.6083 15.1 17 14 17H8ZM8 15H14C14.55 15 15.0208 14.8042 15.4125 14.4125C15.8042 14.0208 16 13.55 16 13V5H6V13C6 13.55 6.19583 14.0208 6.5875 14.4125C6.97917 14.8042 7.45 15 8 15ZM18 8H20V5H18V8ZM8 15H6H16H8Z"
        fill="#1C1B1F"
      />
    </g>
  </svg>
);
export default Cafe;
