import type { SVGProps } from "react";
const SvgAvatar = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect width={24} height={24} fill="#EADDFF" rx={12} />
    <path
      fill="#4F378A"
      fillRule="evenodd"
      d="M15.6 9.6a3.6 3.6 0 1 1-7.2 0 3.6 3.6 0 0 1 7.2 0m-1.2 0a2.4 2.4 0 1 1-4.8 0 2.4 2.4 0 0 1 4.8 0"
      clipRule="evenodd"
    />
    <path
      fill="#4F378A"
      d="M12 15c-3.884 0-7.194 2.297-8.455 5.515q.46.458.97.864C5.452 18.425 8.397 16.2 12 16.2s6.547 2.225 7.486 5.18q.508-.407.97-.865C19.194 17.297 15.884 15 12 15"
    />
  </svg>
);
export default SvgAvatar;
