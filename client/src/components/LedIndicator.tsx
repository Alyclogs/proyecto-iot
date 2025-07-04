import React from "react";
import lightbulb from "../assets/lightbulb.png";

interface LedIndicatorProps {
  isOn: boolean;
}

const LedIndicator: React.FC<LedIndicatorProps> = ({ isOn }) => {
  return (
    <img
      src={lightbulb}
      alt="Indicador LED"
      style={{
        width: "280px",
        height: "280px",
        //borderRadius: "50%",
        //backgroundColor: isOn ? "#fbbf24" : "#64748b",
        transition: "all 0.3s ease",
        boxShadow: isOn ? "0 0 10px rgba(251, 191, 36, 0.8)" : "none",
      }}
    />
  );
};

export default LedIndicator;
