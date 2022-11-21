import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import {ThemeProvider} from "./context/ThemeContext";

import {BrowserRouter} from "react-router-dom";

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
