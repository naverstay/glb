import React, {useContext, useEffect, useState} from "react";
import {ThemeContext} from "../context/ThemeContext";
import localeList from "../i18n/messages";
import {FormattedMessage} from "../context/FormattedMessage";
import Toggle from "../components/Toggle";
import {getPath} from "../util/svg";

type Props = {
    closeCallback: React.Dispatch<React.SetStateAction<string>>;
    setPracticeMode: React.Dispatch<React.SetStateAction<boolean>>;
    setMiles: React.Dispatch<React.SetStateAction<boolean>>;
    setDirections: React.Dispatch<React.SetStateAction<boolean>>;
    practiceMode: boolean;
    miles: boolean;
    directions: boolean;
};

export default function Settings({closeCallback, setMiles, miles, setDirections,
                                     directions, setPracticeMode, practiceMode}: Props) {
    const themeContext = useContext(ThemeContext);
    const [toggleTheme, setToggleTheme] = useState(themeContext.theme.nightMode);
    const [toggleHighContrast, setToggleHighContrast] = useState(themeContext.theme.highContrast);

    const locale = 'en-CA';

    const {setTheme} = themeContext;

    useEffect(() => {
        if (setTheme) {
            setTheme({
                nightMode: toggleTheme,
                highContrast: toggleHighContrast,
                milesMode: miles,
                directionsMode: directions,
            });
        }
    }, [toggleTheme, setTheme, miles, directions, toggleHighContrast]);

    const options = [
        {
            name: localeList[locale]["Settings2"],
            setToggle: setToggleTheme,
            toggle: toggleTheme,
            on: "",
            off: "",
        },
        {
            name: localeList[locale]["Settings3"],
            setToggle: setToggleHighContrast,
            toggle: toggleHighContrast,
            on: "",
            off: "",
        },
        {
            name: localeList[locale]["Settings5"],
            setToggle: setMiles,
            toggle: miles,
            on: "",
            off: "",
        },
        {
            name: localeList[locale]["Settings4"],
            setToggle: setPracticeMode,
            toggle: practiceMode,
            on: "",
            off: ""
        },
        {
            name: localeList[locale]["Settings15"],
            setToggle: setDirections,
            toggle: directions,
            on: "",
            off: ""
        },
    ];

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
                    <FormattedMessage id="SettingsTitle"/>
                </h2>
            </div>

            <div className="popup-body">
                {options.map((option, index) => {
                    return <div key={index} className="setting-row">
                        <div className="setting-row__name">
                            {option.name}
                        </div>
                        <div className="setting-row__toggle">
                            <Toggle {...option} key={option.name}/>
                        </div>
                    </div>;
                })}
            </div>
        </div>
    );
}
