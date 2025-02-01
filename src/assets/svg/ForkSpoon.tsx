import type { SVGProps } from "react";
const ForkSpoon = (props: SVGProps<SVGSVGElement>) => (
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
        d="M6 22V12.85C5.1 12.6167 4.375 12.1417 3.825 11.425C3.275 10.7083 3 9.9 3 9V2H5V8H6V2H8V8H9V2H11V9C11 9.9 10.725 10.7083 10.175 11.425C9.625 12.1417 8.9 12.6167 8 12.85V22H6ZM16 22V12.475C15.1 12.175 14.375 11.5458 13.825 10.5875C13.275 9.62917 13 8.54167 13 7.325C13 5.84167 13.3917 4.58333 14.175 3.55C14.9583 2.51667 15.9 2 17 2C18.1 2 19.0417 2.52083 19.825 3.5625C20.6083 4.60417 21 5.86667 21 7.35C21 8.56667 20.725 9.65 20.175 10.6C19.625 11.55 18.9 12.175 18 12.475V22H16Z"
        fill="#1C1B1F"
      />
    </g>
  </svg>
);
export default ForkSpoon;
