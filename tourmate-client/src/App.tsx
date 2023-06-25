import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Header from "./pages/Layout/Header/index";
import { themeSettings } from "../theme";
import { useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, PaletteMode } from "@mui/material";
import Home from "./pages/Home";
import Footer from "./pages/Layout/Footer";


const ColorModeContext = React.createContext({ toggleColorMode: () => {
  // do nothing
} });

function App() {
  const [count, setCount] = useState(0);

  const [mode, setMode] = React.useState<PaletteMode>("light");
  const colorMode = React.useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === "light" ? "dark" : "light"
        );
      },
    }),
    []
  );
  // Update the theme only if the mode changes
  const theme = React.useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header colorMode={colorMode}/>
        <Home/>
        <Footer/>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
