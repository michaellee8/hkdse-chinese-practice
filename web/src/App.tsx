import React from "react";
import "./App.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from "./config/appTheme";
import { BrowserRouter, Routes } from "react-router-dom";
import { AppNav } from "./components/AppNav";

function App() {
  return (
    <>
      <CssBaseline />
      <AppNav />
      <ThemeProvider theme={appTheme}>
        <BrowserRouter>
          <Routes></Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
