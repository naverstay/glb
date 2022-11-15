import {useContext} from "react";
import {useNavigate} from "react-router-dom";
import {ThemeContext} from "../context/ThemeContext";
import {getPath} from "../util/svg";
import Toggle from "./Toggle";

type Props = {
    practiceMode: boolean;
    setReSpin: React.Dispatch<React.SetStateAction<boolean>>;
    setShowPopup: React.Dispatch<React.SetStateAction<string>>;
    setPracticeMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header({setReSpin, setShowPopup, practiceMode, setPracticeMode}: Props) {
    const {theme} = useContext(ThemeContext);
    const navigate = useNavigate();

    // Set up practice mode

    function reRenderGlobe() {
        setReSpin(true);
        if (practiceMode) {
            return navigate("/");
        }
        navigate("/game");
    }

    const svgColour = theme.nightMode ? "rgb(209 213 219)" : "black";

    console.log('###RENDER### header');

    return (
        <header className="header">
            <div className="container">
                <div className="header-cell">
                    <Toggle
                        customClass=" toggle-blue"
                        name="practiceMode"
                        setToggle={setPracticeMode}
                        toggle={practiceMode}
                        on="24"
                        off="&nbsp;&nbsp;∞"
                        top="Daily"
                        bottom="Practice"
                    />
                </div>
                <div className="header-cell">
                     <span className="logo" onClick={reRenderGlobe}
                     >GLOBLE</span>
                </div>

                <div className="header-cell">

                    <button className="btn btn-blue" onClick={() => setShowPopup('stats')} aria-label="Statistics">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            viewBox="0 0 24 24"
                            width="24"
                        >
                            <path fill={svgColour} d={getPath("stats")}/>
                        </svg>
                    </button>

                    <button className="btn btn-blue" onClick={() => setShowPopup('settings')} aria-label="Settings">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            viewBox="0 0 24 24"
                            width="24"
                        >
                            <path fill={svgColour} d={getPath("settings")}/>
                        </svg>
                    </button>

                    <button className="btn btn-blue" onClick={() => setShowPopup('help')} aria-label="Help">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            viewBox="0 0 24 24"
                            width="24"
                        >
                            <path fill={svgColour} d={getPath("help")}/>
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}
