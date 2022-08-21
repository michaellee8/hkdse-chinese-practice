import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from "./config/appTheme";
import { BrowserRouter, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={appTheme}>
        <BrowserRouter>
          <Routes></Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
