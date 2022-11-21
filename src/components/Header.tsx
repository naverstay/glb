import {useNavigate} from "react-router-dom";
import {getPath} from "../util/svg";

type Props = {
    practiceMode: boolean;
    setShowLoader: React.Dispatch<React.SetStateAction<boolean>>;
    setShowPopup: React.Dispatch<React.SetStateAction<string>>;
    setPracticeMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header({setShowLoader, setShowPopup, practiceMode, setPracticeMode}: Props) {
    const navigate = useNavigate();

    // Set up practice mode

    function reRenderGlobe() {
        setShowLoader(true);
        if (practiceMode) {
            return navigate("/?practice_mode=true");
        }
        navigate("/");
    }

    console.log('###RENDER### header');

    return (
        <header className="header">
            <div className="container">
                <div className="header-cell">
                     <span className="logo" onClick={reRenderGlobe}
                     >GLOBLE</span>
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
