import React, {useContext, useEffect, useState} from "react";
import {ThemeContext} from "../context/ThemeContext";
import {LocaleContext} from "../i18n/LocaleContext";
import localeList from "../i18n/messages";
import {FormattedMessage} from "react-intl";
import Toggle from "../components/Toggle";
import {getPath} from "../util/svg";

type Props = {
    closeCallback: React.Dispatch<React.SetStateAction<string>>;
    setMiles: React.Dispatch<React.SetStateAction<boolean>>;
    miles: boolean;
};

export default function Settings({closeCallback, setMiles, miles}: Props) {
    const themeContext = useContext(ThemeContext);
    const [toggleTheme, setToggleTheme] = useState(!themeContext.theme.nightMode);
    // const [togglePride, setTogglePride] = useState(!themeContext.theme.prideMode);
    const [toggleHighContrast, setToggleHighContrast] = useState(
        !themeContext.theme.highContrast
    );
    const {locale} = useContext(LocaleContext);

    // const [toggleScope, setToggleScope] = useState(true);

    const {setTheme} = themeContext;

    useEffect(() => {
        if (setTheme) {
            setTheme({
                nightMode: !toggleTheme,
                highContrast: !toggleHighContrast,
                // prideMode: !togglePride,
            });
        }
    }, [toggleTheme, toggleHighContrast, setTheme
        // , togglePride
    ]);

    const options = [
        {
            name: localeList[locale]["Settings2"],
            setToggle: setToggleTheme,
            toggle: toggleTheme,
            on: "", // localeList[locale]["Settings2"],
            off: "", // localeList[locale]["Settings1"],
            // top: localeList[locale]["Settings2"],
            // bottom: localeList[locale]["Settings1"],
        },
        // {
        //     name: "pride",
        //     setToggle: setTogglePride,
        //     toggle: togglePride,
        //     on: "", // localeList[locale]["Settings10"],
        //     off: "", // localeList[locale]["Settings11"],
        //     // top: localeList[locale]["Settings10"],
        //     // bottom: localeList[locale]["Settings11"],
        // },
        {
            name: localeList[locale]["Settings3"],
            setToggle: setToggleHighContrast,
            toggle: toggleHighContrast,
            on: "", // localeList[locale]["Settings3"],
            off: "", // localeList[locale]["Settings4"],
            // top: localeList[locale]["Settings3"],
            // bottom: localeList[locale]["Settings4"],
        },
        {
            name: localeList[locale]["Settings5"],
            setToggle: setMiles,
            toggle: miles,
            on: "", // localeList[locale]["Settings3"],
            off: "", // localeList[locale]["Settings4"],
            // top: localeList[locale]["Settings3"],
            // bottom: localeList[locale]["Settings4"],
        },
        // {
        //     name: "scope",
        //     setToggle: setToggleScope,
        //     toggle: toggleScope,
        //     on: localeList[locale]["Settings5"],
        //     off: localeList[locale]["Settings6"],
        // },
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
