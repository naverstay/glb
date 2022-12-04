import {useContext} from "react";
import {ThemeContext} from "../context/ThemeContext";
// import {FormattedMessage} from "react-intl";
import {FormattedMessage} from "../context/FormattedMessage";
import {getPath} from "../util/svg";

type Props = {
    closeCallback: React.Dispatch<React.SetStateAction<string>>;
};

export default function Help({closeCallback}: Props) {
    // Theme
    const {nightMode} = useContext(ThemeContext).theme;

    return (
        <div className="popup-content">
            <div className="popup-header">
                <button
                    className="popup-close"
                    onClick={() => closeCallback('')}
                >
                    <svg
                        x="0px"
                        y="0px"
                        viewBox="0 0 460.775 460.775"
                        width="12px"
                        className=" dark:fill-gray-300"
                    >
                        <path d={getPath("x")}/>
                    </svg>
                </button>
                <h2 className="popup-title">
                    <FormattedMessage id="helpTitle"/>
                </h2>
            </div>

            <div className="popup-body">
                <p>
                    <FormattedMessage
                        id="help1"
                        values={{
                            // @ts-ignore
                            b: (chunks: string) => (
                                <b className={nightMode ? "text-purple-400" : "text-red-800"}>
                                    {chunks}
                                </b>
                            ),
                        }}
                    />
                </p>
                <p>
                    <FormattedMessage id="help2" values={{
                        // @ts-ignore
                        b: (chunks: string) => <b>{chunks}</b>
                    }}
                    />
                </p>

                <ul style={{margin: 0}} className="suggestion-list">
                    <li className="suggestion-list__row">
                        <div className="suggestion-list__name">
                            <div className="suggestion-list__flag"><img src="https://flagcdn.com/w40/de.png"
                                                                        alt="Germany"/></div>
                            <span>Germany</span></div>
                        <div className="suggestion-list__data">~ 2,440<span>km</span></div>
                        <div className="suggestion-list__direction">↘️</div>
                    </li>
                    <li className="suggestion-list__row">
                        <div className="suggestion-list__name">
                            <div className="suggestion-list__flag"><img src="https://flagcdn.com/w40/ua.png"
                                                                        alt="Ukraine"/></div>
                            <span>Ukraine</span></div>
                        <div className="suggestion-list__data">~ 730<span>km</span></div>
                        <div className="suggestion-list__direction">↘️</div>
                    </li>
                    <li className="suggestion-list__row">
                        <div className="suggestion-list__name">
                            <div className="suggestion-list__flag"><img src="https://flagcdn.com/w40/ge.png"
                                                                        alt="Georgia"/></div>
                            <span>Georgia</span></div>
                        <div className="suggestion-list__data">&lt; 10<span>km</span></div>
                        <div className="suggestion-list__direction">↘️</div>
                    </li>
                    <li className="suggestion-list__row __bingo">
                        <div className="suggestion-list__name">
                            <div className="suggestion-list__flag"><img src="https://flagcdn.com/w40/am.png"
                                                                        alt="Armenia"/></div>
                            <span>Armenia</span></div>
                        <div className="suggestion-list__data"><span>Bingo!</span></div>
                        <div className="suggestion-list__direction">🏆</div>
                    </li>
                </ul>

                <p className="text-center fw-b">
                    <FormattedMessage id="help3"/>
                </p>
            </div>
        </div>
    );
}
