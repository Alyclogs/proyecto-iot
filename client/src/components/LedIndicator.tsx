import React from "react";
import { Box, useTheme } from "@mui/material";

interface LedIndicatorProps {
  isOn: boolean;
}

const LedIndicator: React.FC<LedIndicatorProps> = ({ isOn }) => {
  const theme = useTheme();

  const onColor = theme.palette.success.main;
  const offColor = theme.palette.error.main;
  const shadowColor = isOn
    ? theme.palette.success.light
    : theme.palette.error.light;

  return (
    <Box
      sx={{
        width: 60,
        height: 60,
        borderRadius: "50%",
        backgroundColor: isOn ? onColor : offColor,
        border: `2px solid ${
          isOn ? theme.palette.success.dark : theme.palette.error.dark
        }`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: theme.palette.getContrastText(isOn ? onColor : offColor),
        fontWeight: "bold",
        fontSize: "0.9rem",
        boxShadow: `0 0 15px 5px ${shadowColor}`,
        transition:
          "background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
        margin: 2,
      }}
    >
      {isOn ? "ON" : "OFF"}
    </Box>
  );
};

export default LedIndicator;
