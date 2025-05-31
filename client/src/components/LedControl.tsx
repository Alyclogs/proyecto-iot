import React, { useState, useCallback } from "react";
import {
  Switch,
  Typography,
  Paper,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LedIndicator from "./LedIndicator";

const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const AnimatedErrorIcon = styled(ErrorOutlineIcon)(({ theme }) => ({
  fontSize: "4.5rem",
  color: theme.palette.error.main,
  animation: `${pulseAnimation} 1.5s infinite ease-in-out`,
  display: "block",
  margin: "0 auto 16px auto",
}));

interface CommandResponse {
  success: boolean;
  message?: string;
}
const sendLedCommand = async (state: boolean): Promise<CommandResponse> => {
  try {
    const response = await fetch("/api/light.ts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ state }),
    });

    if (!response.ok) {
      let errorMessage = `Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        try {
          const textError = await response.text();
          if (textError) errorMessage = textError;
        } catch (textE) {
          console.error("Could not retrieve error text from response.");
        }
      }
      console.error("Error en la solicitud:", errorMessage);
      return {
        success: false,
        message: `Fallo al enviar comando: ${errorMessage}`,
      };
    }
    return { success: true };
  } catch (error) {
    let message = "Error de red o servidor no disponible.";
    if (error instanceof Error) {
      message = error.message;
    }
    console.error("Error al enviar el comando LED:", error);
    return { success: false, message: `Error de conexión: ${message}` };
  }
};

const LedControl: React.FC = () => {
  const [isLedOn, setIsLedOn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");

  const handleToggleLed = useCallback(async () => {
    setIsLoading(true);
    const newState = !isLedOn;
    const result = await sendLedCommand(newState);
    if (result.success) {
      setIsLedOn(newState);
    } else {
      setDialogMessage(result.message || "Ocurrió un error desconocido.");
      setErrorDialogOpen(true);
    }
    setIsLoading(false);
  }, [isLedOn]);

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          padding: { xs: 2, sm: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          borderRadius: 3,
          minWidth: { xs: "90%", sm: 360 },
          maxWidth: 420,
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ textAlign: "center" }}
        >
          Control de Luz LED
        </Typography>

        <LedIndicator isOn={isLedOn} />

        <FormControlLabel
          control={
            <Switch
              checked={isLedOn}
              onChange={handleToggleLed}
              disabled={isLoading}
              sx={{ transform: "scale(1.3)" }}
            />
          }
          label={
            isLoading
              ? "Procesando..."
              : isLedOn
              ? "LED Encendido"
              : "LED Apagado"
          }
          labelPlacement="bottom"
          sx={{
            marginTop: 1,
            "& .MuiTypography-root": {
              fontWeight: 600,
            },
          }}
        />

        {isLoading && (
          <Typography variant="caption">Enviando comando...</Typography>
        )}
      </Paper>

      <Dialog
        open={errorDialogOpen}
        onClose={handleCloseErrorDialog}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <DialogTitle
          id="error-dialog-title"
          sx={{ textAlign: "center", pt: 3 }}
        >
          Error en la Operación
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <AnimatedErrorIcon />
          <DialogContentText id="error-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={handleCloseErrorDialog}
            variant="contained"
            color="primary"
            autoFocus
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LedControl;
