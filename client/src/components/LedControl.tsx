import React from "react";

interface LedControlProps {
  isOn: boolean;
  onToggle: () => void;
}

const LedControl: React.FC<LedControlProps> = ({ isOn, onToggle }) => {
  return (
    <button
      className={`control-button ${isOn ? "" : "off"}`}
      onClick={onToggle}
    >
      {isOn ? "APAGAR" : "ENCENDER"}
    </button>
  );
};

export default LedControl;
