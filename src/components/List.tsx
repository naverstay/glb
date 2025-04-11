import React, {SyntheticEvent, useEffect, useMemo, useState} from "react";
import {GlobeMethods} from "react-globe.gl";
import {FormattedMessage} from "../context/FormattedMessage";
import {Country} from "../lib/country";
import {answerName} from "../util/answer";
import {findCentre, turnGlobe} from "../util/globe";
import {DIRECTION_ARROWS} from "../util/distance";

type Props = {
    guesses: Country[];
    answerName: string;
    win: boolean;
    directions: boolean;
    globeRef: React.MutableRefObject<GlobeMethods>;
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
                    console.log('answerCountry', answerName, a.properties.NAME, b.properties.NAME);
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

export default function List({guesses, answerName, win, globeRef, practiceMode, directions, miles}: Props) {
    const [orderedGuesses, setOrderedGuesses] = useState(
        reorderGuesses(guesses, practiceMode)
    );

    useEffect(() => {
        setOrderedGuesses(reorderGuesses(guesses, practiceMode));
    }, [guesses, practiceMode]);

    function formatProximity(m: number, miles: boolean) {
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

                    return (
                        <li key={idx}
                            className={"suggestion-list__row"
                            + (win && idx === 0 ? ' __bingo' : '')
                            + (directions ? ' __directions' : '')}>
                            <div className="suggestion-list__name"
                                 onClick={(e) => turnToCountry(e, idx)}>
                                <div className="suggestion-list__flag">
                                    <img src={`${process.env.PUBLIC_URL}/images/flags/${flag.toLowerCase()}.svg`} alt={name}/>
                                </div>
                                <span>{name}</span>
                            </div>
                            <div className="suggestion-list__data">{isSortedByDistance ?
                                win && idx === 0 ?
                                    <FormattedMessage id={"Settings14"}/>
                                    :
                                    <>
                                        {formatProximity(guess?.proximity, miles)}
                                        <FormattedMessage id={miles ? "Settings13" : "Settings12"}/>
                                    </>

                                : (win && idx === 0) ?
                                    <FormattedMessage id={"Settings14"}/>
                                    : (guessesToDisplay.length - idx)}
                            </div>
                            {directions ? <div
                                className="suggestion-list__direction">{win && idx === 0 ? <>🏆</> : DIRECTION_ARROWS[direction]}</div> : null}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
