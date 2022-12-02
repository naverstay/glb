import {getPath} from "../util/svg";
import {setQueryStringParameter} from "../hooks/useLocalStorage";

type Props = {
    practiceMode: boolean;
    setShowLoader: React.Dispatch<React.SetStateAction<boolean>>;
    setShowPopup: React.Dispatch<React.SetStateAction<string>>;
    setPracticeMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header({setShowLoader, setShowPopup, practiceMode, setPracticeMode}: Props) {
    // Set up practice mode

    function reRenderGlobe() {
        setShowLoader(true);
        setQueryStringParameter('practice_mode', practiceMode ? "true" : "");

        // window.location.search = practiceMode ? "/?practice_mode=true" : "/"
    }

    console.log('###RENDER### header');

    return (
        <header className="header">
            <div className="container">
                <div className="header-cell">
                     <span className="logo" onClick={reRenderGlobe}
                     >WORLDLE</span>
                </div>

                <div className="header-cell">

                    <button className="btn btn-blue" onClick={() => setShowPopup('stats')} aria-label="Statistics">
                        <span dangerouslySetInnerHTML={{__html: getPath("stats")}}/>
                    </button>

                    <button className="btn btn-blue" onClick={() => setShowPopup('settings')} aria-label="Settings">
                        <span dangerouslySetInnerHTML={{__html: getPath("settings")}}/>
                    </button>

                    <button className="btn btn-blue" onClick={() => setShowPopup('help')} aria-label="Help">
                        <span dangerouslySetInnerHTML={{__html: getPath("help")}}/>
                    </button>
                </div>
            </div>
        </header>
    );
}
