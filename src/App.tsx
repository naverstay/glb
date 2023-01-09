import React, {useContext, useEffect, useState} from "react";
import Game from "./pages/Game";
import Header from "./components/Header";
import Help from "./pages/Help";
import Settings from "./pages/Settings";
import Statistics from "./components/Statistics";
import Fade from "./transitions/Fade";
import {ThemeContext} from "./context/ThemeContext";
import {useLocalStorage} from "./hooks/useLocalStorage";
import {Guesses, Stats} from "./lib/localStorage";
import {today} from "./util/dates";

const SHOW_HELP = !localStorage.getItem('guesses');

function App() {
    const [params, setParams] = useState((new URL(document.location as unknown as string)).searchParams);

    // Context
    const themeContext = useContext(ThemeContext);

    window.onpopstate = window.history.pushState = function (e) {
        if (params !== (new URL(document.location as unknown as string)).searchParams) {
            setParams((new URL(document.location as unknown as string)).searchParams)
        }
    };

    // State
    const [directions, setDirections] = useState(themeContext.theme.directionsMode);
    const [miles, setMiles] = useState(themeContext.theme.milesMode);
    const [showLoader, setShowLoader] = useState(false);

    const [showPopup, setShowPopup] = useState('');
    const [practiceMode, setPracticeMode] = useState(!!params.get("practice_mode"));

    const firstStats: Stats = {
        gamesPlayed: 0,
        gamesWon: 0,
        lastWin: new Date(0).toLocaleDateString("en-CA"),
        currentStreak: 0,
        maxStreak: 0,
        usedGuesses: [],
        emojiGuesses: "",
    };

    const [storedStats, storeStats] = useLocalStorage<Stats>("statistics", firstStats);

    // Get data from local storage
    const [storedGuesses, storeGuesses] = useLocalStorage<Guesses>("guesses", {
        day: today,
        countries: [],
    });

    const [practiceStoredGuesses, practiceStoreGuesses] = useLocalStorage<Guesses>("practiceGuesses", {
        day: '',
        countries: [],
    });

    // Re-render globe
    useEffect(() => {
        if (showLoader) setTimeout(() => setShowLoader(false), 1);
    }, [showLoader]);

    // change theme
    useEffect(() => {
        document.documentElement.classList.toggle("dark", themeContext.theme.nightMode);
    }, [themeContext.theme.nightMode]);

    // show how to on first visit
    useEffect(() => {
        let helpTimer: ReturnType<typeof setTimeout>;

        if (SHOW_HELP) {
            helpTimer = setTimeout(() => {
                setShowPopup('help');
            }, 1000);
        }

        return () => {
            clearTimeout(helpTimer)
        }
    }, []);

    return (
        <div className={`page`}>
            <Header practiceMode={practiceMode}
                    setPracticeMode={setPracticeMode}
                    setShowLoader={setShowLoader}
                    setShowPopup={setShowPopup}/>

            <Fade show={showPopup === 'stats'} background={"popup-holder"} closeCallback={setShowPopup}>
                <div className="popup container">
                    <Statistics storedStats={storedStats}
                                storeStats={storeStats}
                                storedGuesses={storedGuesses}
                                storeGuesses={storeGuesses}
                                practiceMode={practiceMode}
                                firstStats={firstStats}
                                closeCallback={setShowPopup}/>
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
                        setDirections={setDirections}
                        directions={directions}
                        closeCallback={setShowPopup}/>
                </div>
            </Fade>

            <Game miles={miles}
                  directions={directions}
                  practiceMode={practiceMode}
                  showLoader={showLoader}
                  storedStats={storedStats}
                  storeStats={storeStats}
                  firstStats={firstStats}
                  storedGuesses={storedGuesses}
                  storeGuesses={storeGuesses}
                  practiceStoredGuesses={practiceStoredGuesses}
                  practiceStoreGuesses={practiceStoreGuesses}
                  setShowLoader={setShowLoader}
                  setShowStats={setShowPopup}/>
        </div>
    );
}

export default App;
