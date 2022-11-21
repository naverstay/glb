import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import LocaleProvider from "./i18n";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <LocaleProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LocaleProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
