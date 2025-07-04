import React from "react";
import "../App.css";

interface DiaButtonProps {
  dia: string;
  label: string;
  isSelected: boolean;
  onClick: (dia: string) => void;
}

const DiaButton: React.FC<DiaButtonProps> = ({
  dia,
  label,
  isSelected,
  onClick,
}) => {
  return (
    <button
      className={`circle-dia ${isSelected ? "selected" : ""}`}
      onClick={() => onClick(dia)}
    >
      {label}
    </button>
  );
};

export default DiaButton;
