import {useContext, useEffect, useState} from "react";
import {Route, Routes, useSearchParams} from "react-router-dom";
import Game from "./pages/Game";
import Header from "./components/Header";
import Help from "./pages/Help";
import Info from "./pages/Info";
import Settings from "./pages/Settings";
import Statistics from "./components/Statistics";
import {ThemeContext} from "./context/ThemeContext";
import Fade from "./transitions/Fade";

function App() {
    const [params] = useSearchParams();

    // State
    const [reSpin, setReSpin] = useState(false);
    const [miles, setMiles] = useState(false);

    const [showPopup, setShowPopup] = useState('');
    const [practiceMode, setPracticeMode] = useState(!!params.get("practice_mode"));

    // Context
    const themeContext = useContext(ThemeContext);

    // Re-render globe
    useEffect(() => {
        if (reSpin) setTimeout(() => setReSpin(false), 1);
    }, [reSpin]);

    // change theme
    useEffect(() => {
        document.documentElement.classList.toggle("dark", themeContext.theme.nightMode);
    }, [themeContext.theme.nightMode]);

    return (
        <div className={`page`}>
            <Header practiceMode={practiceMode}
                    setPracticeMode={setPracticeMode}
                    setReSpin={setReSpin}
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
                    <Settings setMiles={setMiles} miles={miles} closeCallback={setShowPopup}/>
                </div>
            </Fade>

            <Routes>
                <Route path="/"
                       element={<Game setMiles={setMiles}
                                      miles={miles}
                                      practiceMode={practiceMode}
                                      reSpin={reSpin}
                                      setReSpin={setReSpin}
                                      setShowStats={setShowPopup}/>}/>

                <Route path="/info" element={<Info/>}/>
            </Routes>
        </div>
    );
}

export default App;
