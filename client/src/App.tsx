import { Box } from "@mui/material";
import LedControl from "./components/LedControl";
function App() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100vw",
        padding: 2,
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <LedControl />
    </Box>
  );
}

export default App;
