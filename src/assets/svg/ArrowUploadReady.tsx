import type { SVGProps } from "react";
const SvgArrowUploadReady = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="arrow_upload_ready_svg__a"
      width={24}
      height={24}
      x={0}
      y={0}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "alpha",
      }}
    >
      <path fill="#D9D9D9" d="M0 0h24v24H0z" />
    </mask>
    <g mask="url(#arrow_upload_ready_svg__a)">
      <path
        fill="#1C1B1F"
        d="M4.25 18.3A9.7 9.7 0 0 1 2 13h2.05q.15 1.075.55 2.063.4.987 1.05 1.837zM2 11a11.6 11.6 0 0 1 .75-2.825q.55-1.35 1.5-2.475l1.4 1.4A7.9 7.9 0 0 0 4.6 8.937 8.7 8.7 0 0 0 4.05 11zm8.95 10.95a9.8 9.8 0 0 1-2.812-.712A10.4 10.4 0 0 1 5.65 19.75l1.4-1.45q.875.65 1.85 1.075t2.05.575zM7.1 5.7 5.65 4.25a10.8 10.8 0 0 1 2.525-1.488A10 10 0 0 1 11 2.05v2q-1.075.15-2.062.575A8.6 8.6 0 0 0 7.1 5.7m5.85 16.25v-2a8.3 8.3 0 0 0 2.088-.562A8.2 8.2 0 0 0 16.9 18.3l1.45 1.45a10 10 0 0 1-2.538 1.5q-1.362.55-2.862.7m4-16.25a9 9 0 0 0-1.875-1.075A8.2 8.2 0 0 0 13 4.05v-2q1.475.15 2.838.712 1.362.563 2.512 1.488zm2.8 12.6-1.4-1.4a8 8 0 0 0 1.05-1.837q.4-.988.55-2.063H22a11.6 11.6 0 0 1-.75 2.825 9.2 9.2 0 0 1-1.5 2.475m.2-7.3a8.7 8.7 0 0 0-.55-2.063A7.9 7.9 0 0 0 18.35 7.1l1.4-1.4A9.7 9.7 0 0 1 22 11z"
      />
    </g>
  </svg>
);
export default SvgArrowUploadReady;
