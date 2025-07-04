import React from "react";
import lightbulbOn from "../assets/dark-mode-on.png";
import lightbulbOff from "../assets/lightbulb.png";

interface LedIndicatorProps {
  isOn: boolean;
}

const LedIndicator: React.FC<LedIndicatorProps> = ({ isOn }) => {
  return (
    <div
      style={{
        position: "relative",
        width: "280px",
        height: "280px",
      }}
    >
      <img
        src={lightbulbOff}
        alt="LED apagado"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: isOn ? 0 : 1,
          transition: "opacity 0.8s ease",
        }}
      />
      <img
        src={lightbulbOn}
        alt="LED encendido"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: isOn ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      />
    </div>
  );
};

export default LedIndicator;
