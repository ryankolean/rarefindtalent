import React from "react";

export default function Logo({ className = "h-8 w-auto" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="20" cy="20" r="6" fill="currentColor" />
      <path
        d="M15 12L25 20L15 28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <text
        x="45"
        y="28"
        fontFamily="Arial, sans-serif"
        fontSize="18"
        fontWeight="700"
        fill="currentColor"
        letterSpacing="0.5"
      >
        RARE FIND TALENT
      </text>
    </svg>
  );
}
