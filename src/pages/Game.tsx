import React, {lazy, Suspense, useEffect, useMemo, useRef, useState} from "react";
import {GlobeMethods} from "react-globe.gl";
import {Country} from "../lib/country";
import {answerCountry, answerName} from "../util/answer";
import {Guesses, Stats} from "../lib/localStorage";
import {dateDiffInDays, today} from "../util/dates";
import {polygonDirection, polygonDistance} from "../util/distance";
import {getColourEmoji} from "../util/colour";
import {FormattedMessage} from "../context/FormattedMessage";
import {Message} from "../components/Message";
import Share from "../components/Share";

const Globe = lazy(() => import("../components/Globe"));
const Guesser = lazy(() => import("../components/Guesser"));
const List = lazy(() => import("../components/List"));
const countryData: Country[] = require("../data/country_data.json").features;

type Props = {
    showLoader: boolean;
    practiceMode: boolean;
    setShowLoader: React.Dispatch<React.SetStateAction<boolean>>;
    setShowStats: React.Dispatch<React.SetStateAction<string>>;
    miles: boolean;
    directions: boolean;
    storeStats: React.Dispatch<React.SetStateAction<Stats>>;
    storedStats: Stats;
    firstStats: Stats;
    storeGuesses: React.Dispatch<React.SetStateAction<Guesses>>;
    storedGuesses: Guesses;
    practiceStoreGuesses: React.Dispatch<React.SetStateAction<Guesses>>;
    practiceStoredGuesses: Guesses;
};

export default function Game({
                                 practiceStoreGuesses,
                                 practiceStoredGuesses,
                                 storeGuesses,
                                 storedGuesses,
                                 showLoader,
                                 setShowLoader,
                                 setShowStats,
                                 firstStats,
                                 practiceMode,
                                 directions,
                                 miles,
                                 storedStats,
                                 storeStats
                             }: Props) {
    const [error, setError] = useState("");

    function enterPracticeMode(force?: boolean) {
        if (!force && practiceStoredGuesses?.day === '' && practiceStoredGuesses?.countries?.length) {
            const loadCountries: Country[] = countryData.filter(m => practiceStoredGuesses.countries.indexOf(m.properties.NAME) > -1)

            setGuesses(loadCountries);
            setWin(false);
        } else {
            const practiceAnswer =
                countryData[Math.floor(Math.random() * countryData.length)];

            localStorage.setItem("practice", JSON.stringify(practiceAnswer));

            setGuesses([]);
            setWin(false);
        }
    }

    // goto practiceMode
    useEffect(() => {
        if (practiceMode) {
            enterPracticeMode();
        }

        if (showLoader) setTimeout(() => {
            setShowLoader(false);
        }, 1);
        // eslint-disable-next-line
    }, [practiceMode, showLoader, setShowLoader]);

    const storedCountries = useMemo(() => {
        const list = practiceMode ? practiceStoredGuesses : (today === storedGuesses.day ? storedGuesses : null);
        const targetCountry = practiceMode ? JSON.parse(localStorage.getItem("practice") as string) as Country : answerCountry;

        if (list === null) {
            return []
        }

        const names = list.countries;
        return names.map((guess) => {
            const foundCountry = countryData.find((country) => {
                return country.properties.NAME === guess;
            });
            if (!foundCountry) {
                throw new Error("Country mapping broken");
            }
            foundCountry["proximity"] = polygonDistance(foundCountry, targetCountry);
            foundCountry["direction"] = polygonDirection(foundCountry, targetCountry);
            return foundCountry;
        });

        // eslint-disable-next-line
    }, [practiceMode]);

    // Check if win condition already met
    const alreadyWon = useMemo(() => {
        return practiceMode
            ? practiceStoredGuesses.day === 'win'
            : storedCountries?.map((c) => c.properties.NAME).includes(answerName)
    }, [practiceMode, practiceStoredGuesses, storedCountries]);

    // Now we're ready to start the game! Set up the game states with the data we
    // already know from the stored info.
    const [guesses, setGuesses] = useState<Country[]>(storedCountries);
    const [win, setWin] = useState(alreadyWon);
    const globeRef = useRef<GlobeMethods>(null!);

    // Whenever there's a new guess
    useEffect(() => {
        if (!practiceMode) {
            setGuesses(storedCountries);
        }
    }, [practiceMode, storedCountries]);


    useEffect(() => {
        if (!practiceMode) {
            setWin(alreadyWon || guesses.map((c) => c.properties.NAME).includes(answerName));
        }
    }, [alreadyWon, practiceMode, guesses]);

    // Whenever there's a new guess
    useEffect(() => {
        if (practiceMode) {
            const guessNames = guesses.map((country) => country.properties.NAME);

            practiceStoreGuesses({
                day: '',
                countries: guessNames,
            });
        }
    }, [guesses, practiceStoreGuesses, practiceMode]);

    useEffect(() => {
        if (!practiceMode) {
            const guessNames = guesses.map((country) => country.properties.NAME);

            storeGuesses({
                day: today,
                countries: guessNames,
            });
        }
    }, [guesses, storeGuesses, practiceMode]);

    // When the player wins!
    useEffect(() => {
        if (win && (!storedStats?.lastWin || storedStats.lastWin !== today) && !practiceMode) {
            // Store new stats in local storage
            const gamesPlayed = (storedStats.gamesPlayed || 0) + 1;
            const lastWin = today;
            const gamesWon = storedStats.gamesWon + 1;
            const streakBroken = dateDiffInDays(storedStats.lastWin, lastWin) > 1;
            const currentStreak = streakBroken ? 1 : storedStats.currentStreak + 1;
            const maxStreak =
                currentStreak > storedStats.maxStreak
                    ? currentStreak
                    : storedStats.maxStreak;
            const usedGuesses = [...storedStats.usedGuesses, guesses.length];
            const chunks = [];
            for (let i = 0; i < guesses.length; i += 8) {
                chunks.push(guesses.slice(i, i + 8));
            }
            const emojiGuesses = chunks
                .map((each) => each.map((guess) => getColourEmoji(guess, guesses[guesses.length - 1])).join(""))
                .join("\n");
            const newStats = {
                gamesPlayed,
                lastWin,
                gamesWon,
                currentStreak,
                maxStreak,
                usedGuesses,
                emojiGuesses,
            };
            storeStats(newStats);

            // Show stats
            setTimeout(() => setShowStats(''), 3000);
        } else if (practiceMode) {
            const guessNames = guesses.map((country) => country.properties.NAME);

            practiceStoreGuesses({
                day: win ? 'win' : '',
                countries: guessNames,
            });
        }

    }, [win, guesses, setShowStats, storeStats, storedStats, practiceMode, practiceStoreGuesses]);

    // Practice mode

    // Fallback while loading
    const renderLoader = () => (
        <div className="container">
            <span className="loader">
                 <FormattedMessage id="Loading"/>
            </span>
        </div>
    );

    return (
        <Suspense fallback={renderLoader()}>
            <div className="container">
                {win && !practiceMode ? <Share storedGuesses={storedGuesses}
                                               storeGuesses={storeGuesses}
                                               firstStats={firstStats}
                                               storedStats={storedStats}
                                               storeStats={storeStats}
                                               practiceMode={practiceMode}/> : null}

                {!showLoader && (
                    <div className="globe-holder">
                        <Globe
                            guesses={guesses}
                            globeRef={globeRef}
                            practiceMode={practiceMode}

                        />

                        <div className="globe-message">
                            <Message
                                win={win}
                                error={error}
                                guesses={guesses.length}
                                practiceMode={practiceMode}
                            />
                        </div>

                        <Guesser
                            setError={setError}
                            guesses={guesses}
                            setGuesses={setGuesses}
                            win={win}
                            setWin={setWin}
                            practiceMode={practiceMode}
                        />

                        <List
                            answerName={answerName}
                            miles={miles}
                            directions={directions}
                            guesses={guesses}
                            win={win}
                            globeRef={globeRef}
                            practiceMode={practiceMode}
                        />

                        {practiceMode ?
                            <div className="suggestion-control">
                                <button className="btn btn-darkblue" onClick={() => {
                                    enterPracticeMode(true)
                                }}>
                                    <FormattedMessage id={"PracticeNew"}/>
                                </button>
                            </div>
                            : null
                        }
                    </div>
                )}
            </div>
        </Suspense>
    );
}
