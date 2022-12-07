import React, {useState} from "react";
import {Guesses, Stats} from "../lib/localStorage";
import {isMobile} from "react-device-detect";
import {isFirefox} from "react-device-detect";
import {FormattedMessage} from "../context/FormattedMessage";
import localeList from "../i18n/messages";
import Fade from "../transitions/Fade";
import {today} from "../util/dates";

type Props = {
    practiceMode: boolean;
    showResetBtn?: boolean;
    fullStat?: boolean;
    storeStats: React.Dispatch<React.SetStateAction<Stats>>;
    storedStats: Stats;
    firstStats: Stats;
    storeGuesses: React.Dispatch<React.SetStateAction<Guesses>>;
    storedGuesses: Guesses;
};

const GAME_LINK = 'https://globle.org/';

export default function Share({
                                  storeGuesses,
                                  storedGuesses,
                                  practiceMode,
                                  firstStats,
                                  storedStats,
                                  storeStats,
                                  showResetBtn = false,
                                  fullStat = false
                              }: Props) {
    const locale = 'en-CA';

    const {
        gamesWon,
        lastWin,
        currentStreak,
        maxStreak,
        usedGuesses,
        emojiGuesses
    } = storedStats;

    const todaysGuesses = lastWin === today ? usedGuesses[usedGuesses.length - 1] : "--";

    const avgShorthand = isMobile
        ? localeList[locale]["Stats7"]
        : localeList[locale]["Stats6"];

    // Reset stats
    const [msg, setMsg] = useState("");
    const [showResetMsg, setShowResetMsg] = useState(false);
    const [resetComplete, setResetComplete] = useState(false);

    // const [question, setQuestion] = useState(false);
    function promptReset() {
        setMsg(localeList[locale]["Stats10"]);
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

    async function copyToClipboard() {
        const tries = storedGuesses.countries.length;

        let shareString = (!practiceMode && tries > 0 ? `I guessed today’s Globle in ${tries} ${tries > 1 ? 'tries' : 'try'}:
${emojiGuesses}🏆
` : `I'm playing Globle `) + GAME_LINK;

        if (fullStat) {
            shareString =
                `My Globle Stats:
${gamesWon} - ${localeList[locale]["Stats3"]}
${todaysGuesses} - ${localeList[locale]["Stats2"]}
${todaysGuesses} - ${avgShorthand}
${currentStreak} - ${localeList[locale]["Stats4"]}
${maxStreak} - ${localeList[locale]["Stats5"]}
${GAME_LINK}`;
        }

        setShowResetMsg(false);

        try {
            if ("canShare" in navigator && isMobile && !isFirefox) {
                await navigator.share({title: "Globle Stats", text: shareString});
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
            setShowCopyMsg(true);
            return setTimeout(() => setShowCopyMsg(false), 2000);
        }
    }

    return (
        <>
            <div className={"stat-controls"}>
                <button disabled={showResetMsg} className="btn btn-darkblue" onClick={copyToClipboard}>
                    <FormattedMessage id="Stats9"/>
                </button>
                {showResetBtn ? <button disabled={showResetMsg} className="btn btn-red__border" onClick={promptReset}>
                    <FormattedMessage id="Stats8"/>
                </button> : null}
            </div>
            {showResetBtn ? <Fade show={showResetMsg} background="">
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
            </Fade> : null}
            <Fade show={showCopyMsg && !showResetMsg} background="">
                <p className="text-center">{msg}</p>
            </Fade>
        </>
    );
}
