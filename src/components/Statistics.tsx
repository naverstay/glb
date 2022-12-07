import React, {useRef} from "react";
import {useLocalStorage} from "../hooks/useLocalStorage";
import {Guesses, Stats} from "../lib/localStorage";
import {isMobile} from "react-device-detect";
import {getPath} from "../util/svg";
import {today} from "../util/dates";
import {FormattedMessage} from "../context/FormattedMessage";
import localeList from "../i18n/messages";
import Share from "./Share";
import Game from "../pages/Game";

type Props = {
    practiceMode: boolean;
    closeCallback: React.Dispatch<React.SetStateAction<string>>;
    storeStats: React.Dispatch<React.SetStateAction<Stats>>;
    storedStats: Stats;
    firstStats: Stats;
    storeGuesses: React.Dispatch<React.SetStateAction<Guesses>>;
    storedGuesses: Guesses;
};

export default function Statistics({
                                       closeCallback,
                                       storeGuesses,
                                       storedGuesses,
                                       practiceMode,
                                       storedStats,
                                       firstStats,
                                       storeStats,
                                   }: Props) {
    const locale = 'en-CA';

    const {
        worldleGamesWon,
        worldleLastWin,
        worldleCurrentStreak,
        worldleMaxStreak,
        worldleUsedGuesses,
    } = storedStats;

    const sumGuesses = worldleUsedGuesses.reduce((a, b) => a + b, 0);
    const avgGuesses = Math.round((sumGuesses / worldleUsedGuesses.length) * 100) / 100;
    const showAvgGuesses = worldleUsedGuesses.length === 0 ? "--" : avgGuesses;
    const todaysGuesses =
        worldleLastWin === today ? worldleUsedGuesses[worldleUsedGuesses.length - 1] : "--";

    const showWorldleLastWin = worldleLastWin >= "2022-01-01" ? worldleLastWin : "--";

    const avgShorthand = isMobile
        ? localeList[locale]["Stats7"]
        : localeList[locale]["Stats6"];

    const statsTable = [
        {label: localeList[locale]["Stats1"], value: showWorldleLastWin},
        {label: localeList[locale]["Stats2"], value: todaysGuesses},
        {label: localeList[locale]["Stats3"], value: worldleGamesWon},
        {label: localeList[locale]["Stats4"], value: worldleCurrentStreak},
        {label: localeList[locale]["Stats5"], value: worldleMaxStreak},
        {label: avgShorthand, value: showAvgGuesses},
    ];

    // Closing the modal
    const modalRef = useRef<HTMLDivElement>(null!);

    return (
        <div ref={modalRef} className="popup-content">
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
                    <FormattedMessage id="StatsTitle"/>
                </h2>
            </div>

            <div className="popup-body">
                <div className="stat-holder">
                    {statsTable.map((row, idx) => {
                        return (
                            <div key={idx} className="stat-cell">
                                <div className="stat-cell__val">{row.value}</div>
                                <div className="stat-cell__name">{row.label}</div>
                            </div>
                        );
                    })}
                </div>

                <Share storedGuesses={storedGuesses}
                       storeGuesses={storeGuesses}
                       firstStats={firstStats}
                       storedStats={storedStats}
                       storeStats={storeStats}
                       practiceMode={practiceMode}
                       showResetBtn={true}
                       fullStat={true}/>
            </div>
        </div>
    );
}
