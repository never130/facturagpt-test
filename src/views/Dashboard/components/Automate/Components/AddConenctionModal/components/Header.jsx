import React from "react";
import CloseSVG from "../../../svgs/CloseSVG";

const Header = ({ icon, type, close, headerColor }) => {
  const background = headerColor
    ? `linear-gradient(to right, ${headerColor[0]}, ${headerColor[1]})`
    : "#F5F5F5"; 
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: background,
        padding: "10px",
        height: 44,
      }}
    >
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {icon}
        <p
          style={{ fontWeight: "bold", color: headerColor ? "white" : "black" }}
        >
          {type}
        </p>
      </div>
      <div>
        <CloseSVG color={headerColor ? "white" : ""} action={close} />
      </div>
    </div>
  );
};

export default Header;
