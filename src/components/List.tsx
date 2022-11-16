import React, {SyntheticEvent, useContext, useEffect, useMemo, useState} from "react";
import {GlobeMethods} from "react-globe.gl";
import {FormattedMessage} from "react-intl";
import {LocaleContext} from "../i18n/LocaleContext";
import {Country, LanguageName} from "../lib/country";
import {Locale} from "../lib/locale";
import {answerName} from "../util/answer";
import {findCentre, turnGlobe} from "../util/globe";
import {DIRECTION_ARROWS} from "../util/distance";

type Props = {
    guesses: Country[];
    win: boolean;
    globeRef: React.MutableRefObject<GlobeMethods>;
    setMiles: React.Dispatch<React.SetStateAction<boolean>>;
    miles: boolean;
    practiceMode: boolean;
};

function reorderGuesses(guessList: Country[], practiceMode: boolean) {
    return [...guessList].sort((a, b) => {
        // practice
        if (practiceMode) {
            const answerCountry = JSON.parse(
                localStorage.getItem("practice") as string
            ) as Country;

            if (answerCountry) {
                const answerName = answerCountry.properties.NAME;
                if (a.properties.NAME === answerName) {
                    return -1;
                } else if (b.properties.NAME === answerName) {
                    return 1;
                } else {
                    return a.proximity - b.proximity;
                }
            }
        }

        // daily
        if (a.properties.NAME === answerName) {
            return -1;
        } else if (b.properties.NAME === answerName) {
            return 1;
        } else {
            return a.proximity - b.proximity;
        }
    });
}

export default function List({guesses, win, globeRef, practiceMode, setMiles, miles}: Props) {
    const [orderedGuesses, setOrderedGuesses] = useState(
        reorderGuesses(guesses, practiceMode)
    );
    const {locale} = useContext(LocaleContext);
    const langNameMap: Record<Locale, LanguageName> = {"en-CA": "NAME_EN"};
    const langName = langNameMap[locale];

    useEffect(() => {
        setOrderedGuesses(reorderGuesses(guesses, practiceMode));
    }, [guesses, practiceMode]);

    function formatKm(m: number, miles: boolean) {
        const METERS_PER_MILE = 1609.34;
        const BIN = 10;
        const value = miles ? m / METERS_PER_MILE : m / 1000;
        if (value < BIN) return "< " + BIN;

        const rounded = Math.round(value / BIN) * BIN;
        // const max = min + BIN;
        const format = (num: number) =>
            num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return `~ ${format(rounded)}`;
    }

    function turnToCountry(e: SyntheticEvent, idx: number) {
        const clickedCountry = isSortedByDistance
            ? orderedGuesses[idx]
            : guesses[idx];
        const {lat, lng, altitude} = findCentre(clickedCountry);
        turnGlobe({lat, lng, altitude}, globeRef, "zoom");
    }

    const closest = orderedGuesses[0];
    const farthest = orderedGuesses[orderedGuesses.length - 1];

    const [isSortedByDistance, setIsSortedByDistance] = useState(true);

    const guessesToDisplay = useMemo(() => {
        return isSortedByDistance ? orderedGuesses : guesses
    }, [isSortedByDistance, orderedGuesses, guesses]);

    return (
        <div className="suggestion-holder">
            {closest && farthest && (
                <div className="suggestion-block">
                    <button className={"btn btn-darkblue" + (isSortedByDistance ? ' __active' : '')}
                            onClick={() => setIsSortedByDistance(!isSortedByDistance)}
                    ><span>
                <FormattedMessage id={"SortByDistance"}/>
              </span></button>
                    <button className={"btn btn-darkblue" + (!isSortedByDistance ? ' __active' : '')}
                            onClick={() => setIsSortedByDistance(!isSortedByDistance)}
                    ><span>
                        <FormattedMessage id={"SortByGuesses"}/>
                      </span></button>
                </div>
            )}

            <ul className="suggestion-list">
                {guessesToDisplay.map((guess, idx) => {
                    const {direction} = guess;
                    const {NAME_LEN, ABBREV, NAME, FLAG} = guess.properties;
                    const flag = (FLAG || "").toLocaleLowerCase();
                    let name = NAME_LEN >= 10 ? ABBREV : NAME;
                    if (locale !== "en-CA") {
                        name = guess.properties[langName];
                    }

                    return (
                        <li key={idx} className={"suggestion-list__row" + (win && idx === 0 ? ' __bingo' : '')}>
                            <div className="suggestion-list__name"
                                 onClick={(e) => turnToCountry(e, idx)}>
                                <div className="suggestion-list__flag">
                                    <img
                                        src={`https://flagcdn.com/w40/${flag.toLowerCase()}.png`}
                                        alt={name}
                                        className=""
                                    />
                                </div>
                                <span>{name}</span>
                            </div>
                            <div className="suggestion-list__data">{isSortedByDistance ?
                                win && idx === 0 ?
                                    <FormattedMessage
                                        id={"Settings14"}
                                    />
                                    : <>{formatKm(guess?.proximity, miles)}
                                        <FormattedMessage id={miles ? "Settings13" : "Settings12"}/></>

                                : (win && idx === 0) ?
                                    <FormattedMessage id={"Settings14"}/>
                                    : (guessesToDisplay.length - idx)}</div>
                            <div
                                className="suggestion-list__direction">{win && idx === 0 ? <>🏆</> : DIRECTION_ARROWS[direction]}</div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}