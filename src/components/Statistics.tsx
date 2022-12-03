import {useRef, useState} from "react";
import {useLocalStorage} from "../hooks/useLocalStorage";
import {Stats} from "../lib/localStorage";
import {isMobile} from "react-device-detect";
import {getPath} from "../util/svg";
import {today} from "../util/dates";
import {isFirefox} from "react-device-detect";
import {FormattedMessage} from "../context/FormattedMessage";
import localeList from "../i18n/messages";
import Fade from "../transitions/Fade";

type Props = {
    closeCallback: React.Dispatch<React.SetStateAction<string>>;
};

export default function Statistics({closeCallback}: Props) {
    const locale = 'en-CA';

    // Stats data
    const firstStats = {
        worldleGamesPlayed: 0,
        worldleGamesWon: 0,
        worldleLastWin: new Date(0).toLocaleDateString("en-CA"),
        worldleCurrentStreak: 0,
        worldleMaxStreak: 0,
        worldleUsedGuesses: [],
        worldleEmojiGuesses: "",
    };

    const [storedStats, storeStats] = useLocalStorage<Stats>(
        "worldleStatistics",
        firstStats
    );
    const {
        // worldleGamesPlayed,
        worldleGamesWon,
        worldleLastWin,
        worldleCurrentStreak,
        worldleMaxStreak,
        worldleUsedGuesses,
        worldleEmojiGuesses,
    } = storedStats;

    const sumGuesses = worldleUsedGuesses.reduce((a, b) => a + b, 0);
    const avgGuesses = Math.round((sumGuesses / worldleUsedGuesses.length) * 100) / 100;
    const showAvgGuesses = worldleUsedGuesses.length === 0 ? "--" : avgGuesses;
    const todaysGuesses =
        worldleLastWin === today ? worldleUsedGuesses[worldleUsedGuesses.length - 1] : "--";

    const showworldleLastWin = worldleLastWin >= "2022-01-01" ? worldleLastWin : "--";
    // const winPercent = worldleGamesWon && worldleGamesPlayed ? Math.ceil(100 * (worldleGamesWon / worldleGamesPlayed)) : "--";

    const avgShorthand = isMobile
        ? localeList[locale]["Stats7"]
        : localeList[locale]["Stats6"];

    const statsTable = [
        {label: localeList[locale]["Stats1"], value: showworldleLastWin},
        {label: localeList[locale]["Stats2"], value: todaysGuesses},
        {label: localeList[locale]["Stats3"], value: worldleGamesWon},
        {label: localeList[locale]["Stats4"], value: worldleCurrentStreak},
        {label: localeList[locale]["Stats5"], value: worldleMaxStreak},
        {label: avgShorthand, value: showAvgGuesses},
    ];

    // Closing the modal
    const modalRef = useRef<HTMLDivElement>(null!);

    // Reset stats
    const [msg, setMsg] = useState("");
    const [showResetMsg, setShowResetMsg] = useState(false);
    const [resetComplete, setResetComplete] = useState(false);

    // const [question, setQuestion] = useState(false);
    function promptReset() {
        setMsg(localeList[locale]["Stats10"]);
        // setQuestion(true);
        setResetComplete(false);
        setShowResetMsg(true);
    }

    function resetStats() {
        storeStats(firstStats);
        setShowResetMsg(false);
        setTimeout(() => {
            setMsg(localeList[locale]["Stats11"]);
            setShowCopyMsg(true);
        }, 200);
        setTimeout(() => setShowCopyMsg(false), 2200);
    }

    // Clipboard
    const [showCopyMsg, setShowCopyMsg] = useState(false);
    // const options = {year: "numeric", month: "short", day: "numeric"};
    // const event = new Date();
    // // @ts-ignore
    // const unambiguousDate = event.toLocaleDateString(locale, options);
    // const date = unambiguousDate === "Invalid Date" ? today : unambiguousDate;

    async function copyToClipboard() {
        const tries = worldleEmojiGuesses.length / 2;
        const shareString = (tries > 0 ? `I guessed today’s Worldle in ${tries} ${tries > 1 ? 'tries' : 'try'}:
${worldleEmojiGuesses}🏆
` : `I'm playing Worldle `) + 'https://globle.org/worldle';

        setShowResetMsg(false);

        try {
            if ("canShare" in navigator && isMobile && !isFirefox) {
                await navigator.share({title: "Plurality Stats", text: shareString});
                setMsg("Shared!");
                setShowCopyMsg(true);
                return setTimeout(() => setShowCopyMsg(false), 2000);
            } else if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(shareString);
                setMsg("Copied!");
                setShowCopyMsg(true);
                return setTimeout(() => setShowCopyMsg(false), 2000);
            } else {
                document.execCommand("copy", true, shareString);
                setMsg("Copied!");
                setShowCopyMsg(true);
                return setTimeout(() => setShowCopyMsg(false), 2000);
            }
        } catch (e) {
            setMsg("This browser cannot share");
            setShowCopyMsg(true);
            return setTimeout(() => setShowCopyMsg(false), 2000);
        }
    }

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

                <div className={"stat-controls"}>
                    <button disabled={showResetMsg} className="btn btn-darkblue" onClick={copyToClipboard}>
                        <FormattedMessage id="Stats9"/>
                    </button>
                    <button disabled={showResetMsg} className="btn btn-red__border" onClick={promptReset}>
                        <FormattedMessage id="Stats8"/>
                    </button>
                </div>
                <Fade show={showResetMsg} background="">
                    <p className="text-center">{msg}</p>
                    <div className="stat-controls">
                        <button className="btn btn-red__border"
                                onClick={resetStats} disabled={resetComplete}
                        >Yes
                        </button>
                        <button className="btn btn-darkblue"
                                onClick={() => setShowResetMsg(false)}
                                disabled={resetComplete}
                        >No
                        </button>
                    </div>
                </Fade>
                <Fade show={showCopyMsg && !showResetMsg} background="">
                    <p className="text-center">{msg}</p>
                </Fade>
            </div>
        </div>
    );
}
