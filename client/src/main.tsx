import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider, createTheme, alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const softPalette = {
  primary: {
    main: "#79A7D3",
    light: alpha("#79A7D3", 0.8),
    dark: alpha("#79A7D3", 0.6),
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#A0D2DB",
    light: alpha("#A0D2DB", 0.8),
    contrastText: "#263238",
  },
  background: {
    default: "#F0F4F8",
    paper: "#FFFFFF",
  },
  text: {
    primary: "#333B4F",
    secondary: "#6B7A90",
  },
  error: {
    main: "#E57373",
  },
  success: {
    main: "#81C784",
  },
};

const theme = createTheme({
  palette: softPalette,
  typography: {
    fontFamily: ["Nunito", "sans-serif"].join(","),
    h5: {
      fontWeight: 600,
      color: softPalette.text.primary,
    },
    body1: {
      color: softPalette.text.primary,
    },
    caption: {
      color: softPalette.text.secondary,
    },
  },
  components: {
    MuiSwitch: {
      styleOverrides: {
        root: {
          // Aumentar un poco el tamaño si es necesario
          // width: 62,
          // height: 34,
          // padding: 7,
        },
        switchBase: {
          color: softPalette.secondary.main,
          "&.Mui-checked": {
            color: softPalette.primary.main,
            "& + .MuiSwitch-track": {
              backgroundColor: softPalette.primary.light,
            },
          },
        },
        track: {
          backgroundColor: softPalette.secondary.light,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: softPalette.background.paper,
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />{" "}
      {/* Aplica un baseline de CSS consistente y el color de fondo */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
