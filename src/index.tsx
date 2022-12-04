import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import {ThemeProvider} from "./context/ThemeContext";

(function () {
    let src = '//cdn.jsdelivr.net/npm/eruda';
    if (!/eruda=1/.test(window.location.search) && localStorage.getItem('active-eruda') != 'true') return;
    console.log('eruda');
    document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
    document.write('<scr' + 'ipt>eruda.init();</scr' + 'ipt>');
})();

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
