import React from "react";

const CircleDeleteSVG = ({ width = "28px", height = "28px" }) => {
  return (
    <svg
      style={{ cursor: "pointer" }}
      width={width}
      height={height}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.0002 20.1668C16.0628 20.1668 20.1668 16.0628 20.1668 11.0002C20.1668 5.93755 16.0628 1.8335 11.0002 1.8335C5.93755 1.8335 1.8335 5.93755 1.8335 11.0002C1.8335 16.0628 5.93755 20.1668 11.0002 20.1668Z"
        fill="#DC3545"
      />
      <path
        d="M7.3335 11H14.6668"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CircleDeleteSVG;
