import {useContext, useEffect, useState} from "react";
import Game from "./pages/Game";
import Header from "./components/Header";
import Help from "./pages/Help";
import Settings from "./pages/Settings";
import Statistics from "./components/Statistics";
import Fade from "./transitions/Fade";
import {ThemeContext} from "./context/ThemeContext";

function App() {
    const [params, setParams] = useState((new URL(document.location as unknown as string)).searchParams);

    window.onpopstate = window.history.pushState = function (e) {
        if (params !== (new URL(document.location as unknown as string)).searchParams) {
            setParams((new URL(document.location as unknown as string)).searchParams)
        }
    };

    // State
    const [showLoader, setShowLoader] = useState(false);
    const [miles, setMiles] = useState(false);

    const [showPopup, setShowPopup] = useState('');
    const [practiceMode, setPracticeMode] = useState(!!params.get("practice_mode"));

    // Context
    const themeContext = useContext(ThemeContext);

    // Re-render globe
    useEffect(() => {
        if (showLoader) setTimeout(() => setShowLoader(false), 1);
    }, [showLoader]);

    // Re-render globe
    useEffect(() => {
        console.log('history', params);
    }, [params]);

    // change theme
    useEffect(() => {
        document.documentElement.classList.toggle("dark", themeContext.theme.nightMode);
    }, [themeContext.theme.nightMode]);

    return (
        <div className={`page`}>
            <Header practiceMode={practiceMode}
                    setPracticeMode={setPracticeMode}
                    setShowLoader={setShowLoader}
                    setShowPopup={setShowPopup}/>

            <Fade show={showPopup === 'stats'} background={"popup-holder"} closeCallback={setShowPopup}>
                <div className="popup container">
                    <Statistics closeCallback={setShowPopup}/>
                </div>
            </Fade>

            <Fade show={showPopup === 'help'} background={"popup-holder"} closeCallback={setShowPopup}>
                <div className="popup container">
                    <Help closeCallback={setShowPopup}/>
                </div>
            </Fade>

            <Fade show={showPopup === 'settings'} background={"popup-holder"} closeCallback={setShowPopup}>
                <div className="popup container">
                    <Settings
                        setPracticeMode={setPracticeMode}
                        practiceMode={practiceMode}
                        setMiles={setMiles}
                        miles={miles}
                        closeCallback={setShowPopup}/>
                </div>
            </Fade>

            <Game setMiles={setMiles}
                  miles={miles}
                  practiceMode={practiceMode}
                  showLoader={showLoader}
                  setShowLoader={setShowLoader}
                  setShowStats={setShowPopup}/>
        </div>
    );
}

export default App;
