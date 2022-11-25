import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import {ThemeProvider} from "./context/ThemeContext";

if (process.env.PUBLIC_URL) {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.innerHTML = 'window.globeImageUrl="https://morsetranslator.org/images";';
    document.getElementsByTagName('head')[0].appendChild(script);
}

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider>
            <App/>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
