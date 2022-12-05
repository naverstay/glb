import React, {lazy, Suspense, useEffect, useMemo, useState} from "react";
import {Country} from "../lib/country";
import {answerCountry, answerName} from "../util/answer";
import {setQueryStringParameter, useLocalStorage} from "../hooks/useLocalStorage";
import {Guesses, Stats} from "../lib/localStorage";
import {dateDiffInDays, today} from "../util/dates";
import {polygonDirection, polygonDistance} from "../util/distance";
import {getColourEmoji} from "../util/colour";
import {FormattedMessage} from "../context/FormattedMessage";

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
};

export default function Game({showLoader, setShowLoader, setShowStats, practiceMode, directions, miles}: Props) {
    // Get data from local storage
    const [storedGuesses, storeGuesses] = useLocalStorage<Guesses>("worldleGuesses", {
        day: today,
        countries: [],
    });

    const [practiceStoredGuesses, practiceStoreGuesses] = useLocalStorage<Guesses>("worldlePracticeGuesses", {
        day: '',
        countries: [],
    });

    const firstStats = {
        worldleGamesPlayed: 0,
        worldleGamesWon: 0,
        worldleLastWin: new Date(0).toLocaleDateString("en-CA"),
        worldleCurrentStreak: 0,
        worldleMaxStreak: 0,
        worldleUsedGuesses: [],
        worldleEmojiGuesses: "",
    };

    const [storedStats, storeStats] = useLocalStorage<Stats>("worldleStatistics", firstStats);

    function enterPracticeMode(force?: boolean) {
        const loadCountries: Country[] = countryData.filter(m => practiceStoredGuesses.countries.indexOf(m.properties.NAME) > -1)
        if (!force && practiceStoredGuesses?.day === '' && practiceStoredGuesses?.countries?.length) {
            setGuesses(loadCountries);
            setWin(false);
        } else {
            let country = JSON.parse(
                localStorage.getItem("worldlePractice") as string
            );

            if (!force && country && practiceStoredGuesses && practiceStoredGuesses.day !== 'win') {
                setCurrentImg(country.properties.FLAG.toLowerCase());
                setGuesses(loadCountries);
            } else {
                const practiceAnswer = //countryData.find(f => f.properties.NAME === 'Armenia')
                    countryData[Math.floor(Math.random() * countryData.length)];

                localStorage.setItem("worldlePractice", JSON.stringify(practiceAnswer));

                setCurrentImg(practiceAnswer?.properties.FLAG.toLowerCase() ?? '');
                setGuesses([]);
            }

            setWin(false);
        }
    }

    // goto practiceMode
    useEffect(() => {
        if (practiceMode) {
            enterPracticeMode();
            setQueryStringParameter('practice_mode', "true");
        } else {
            setQueryStringParameter('practice_mode', "");
        }

        if (showLoader) setTimeout(() => {
            setShowLoader(false);
        }, 1);
        // eslint-disable-next-line
    }, [practiceMode, showLoader, setShowLoader]);

    const storedCountries = useMemo(() => {
        const list = practiceMode ? practiceStoredGuesses : (today === storedGuesses.day ? storedGuesses : null);
        const targetCountry = practiceMode ? JSON.parse(localStorage.getItem("worldlePractice") as string) as Country : answerCountry;

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
    const [currentImg, setCurrentImg] = useState('');

    useEffect(() => {
        let country = answerCountry;

        if (practiceMode) {
            country = JSON.parse(
                localStorage.getItem("worldlePractice") as string
            );
        }

        setCurrentImg(country.properties.FLAG.toLowerCase());

    }, [practiceMode]);

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
        if (win && (!storedStats?.worldleLastWin || storedStats.worldleLastWin !== today) && !practiceMode) {
            // Store new stats in local storage
            const worldleGamesPlayed = (storedStats.worldleGamesPlayed || 0) + 1;
            const worldleLastWin = today;
            const worldleGamesWon = storedStats.worldleGamesWon + 1;
            const streakBroken = dateDiffInDays(storedStats.worldleLastWin, worldleLastWin) > 1;
            const worldleCurrentStreak = streakBroken ? 1 : storedStats.worldleCurrentStreak + 1;
            const worldleMaxStreak =
                worldleCurrentStreak > storedStats.worldleMaxStreak
                    ? worldleCurrentStreak
                    : storedStats.worldleMaxStreak;
            const worldleUsedGuesses = [...storedStats.worldleUsedGuesses, guesses.length];
            const chunks = [];
            for (let i = 0; i < guesses.length; i += 8) {
                chunks.push(guesses.slice(i, i + 8));
            }
            const worldleEmojiGuesses = chunks
                .map((each) => each.map((guess) => getColourEmoji(guess, guesses[guesses.length - 1])).join(""))
                .join("\n");
            const newStats = {
                worldleGamesPlayed,
                worldleLastWin,
                worldleGamesWon,
                worldleCurrentStreak,
                worldleMaxStreak,
                worldleUsedGuesses,
                worldleEmojiGuesses,
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
                <Guesser
                    guesses={guesses}
                    setGuesses={setGuesses}
                    win={win}
                    setWin={setWin}
                    practiceMode={practiceMode}
                />

                {!showLoader && (
                    <div className="globe-holder">
                        <div className="globe-holder__image">
                            {currentImg ? <img alt="country to guess" className={win ? '__win' : ''}
                                               src={`images/countries/${currentImg}/vector.svg`}/> : null}
                        </div>

                        <List
                            answerName={answerName}
                            miles={miles}
                            directions={directions}
                            guesses={guesses}
                            win={win}
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
