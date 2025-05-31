import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css"; // Estilos globales
import { ThemeProvider, createTheme, alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Paleta de colores suaves
const softPalette = {
  primary: {
    main: "#79A7D3", // Azul suave
    light: alpha("#79A7D3", 0.8),
    dark: alpha("#79A7D3", 0.6),
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#A0D2DB", // Turquesa muy suave
    light: alpha("#A0D2DB", 0.8), // Añadido para evitar el error
    contrastText: "#263238",
  },
  background: {
    default: "#F0F4F8", // Fondo general muy claro, casi blanco azulado
    paper: "#FFFFFF", // Fondo de los 'Paper' componentes
  },
  text: {
    primary: "#333B4F", // Gris oscuro azulado para texto principal
    secondary: "#6B7A90", // Gris más claro para texto secundario
  },
  error: {
    main: "#E57373", // Rojo suave para errores
  },
  success: {
    main: "#81C784", // Verde suave para éxito
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
          // Estilos para el switch cuando está desactivado
          color: softPalette.secondary.main, // Color del thumb cuando está apagado
          "&.Mui-checked": {
            color: softPalette.primary.main, // Color del thumb cuando está encendido
            "& + .MuiSwitch-track": {
              backgroundColor: softPalette.primary.light, // Color del track cuando está encendido
            },
          },
        },
        track: {
          backgroundColor: softPalette.secondary.light, // Color del track cuando está apagado
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
