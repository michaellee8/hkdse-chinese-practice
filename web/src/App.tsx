import React from "react";
import "./App.css";
import { Box, CssBaseline, ThemeProvider, Toolbar } from "@mui/material";
import { appTheme } from "./config/appTheme";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppNav, drawerWidth } from "./components/AppNav";
import { OriginalTextRecitePage } from "./pages/OriginalTextRecitePage";

function App() {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={appTheme}>
        <BrowserRouter>
          <Box sx={{ display: "flex" }}>
            <AppNav />
            <Box
              component={"main"}
              sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
              <Toolbar />
              <Routes>
                <Route path={"/original-text-recite"} element={<OriginalTextRecitePage />} />
                <Route path={"*"} element={<OriginalTextRecitePage />} />
              </Routes>
            </Box>
          </Box>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
