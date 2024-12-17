import {getPath} from "../util/svg";
import {setQueryStringParameter} from "../hooks/useLocalStorage";

type Props = {
    practiceMode: boolean;
    setShowHome: React.Dispatch<React.SetStateAction<boolean>>;
    setShowPopup: React.Dispatch<React.SetStateAction<string>>;
    setPracticeMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header({setShowHome, setShowPopup, practiceMode}: Props) {
    // Set up practice mode

    console.log('###RENDER### header');

    return (
        <header className="header">
            <div className="container">
                <div className="header-cell">
                    <button className="btn btn-blue" onClick={() => setShowHome(true)} aria-label="Statistics">
                        <span dangerouslySetInnerHTML={{__html: getPath("home")}}/>
                    </button>
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
