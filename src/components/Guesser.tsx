import React, {FormEvent, useState, useRef, useEffect, useMemo} from "react";
import {Country} from "../lib/country";
import {answerCountry, answerName} from "../util/answer";
import {Message} from "./Message";
import {polygonDirection, polygonDistance} from "../util/distance";
import {ReactSearchAutocomplete} from 'react-search-autocomplete';
import localeList from "../i18n/messages";
import {FormattedMessage} from "../context/FormattedMessage";
import {AltNames} from "../lib/alternateNames";

const countryData: Country[] = require("../data/country_data.json").features;
const alternateNames: AltNames = require("../data/alternate_names.json");

type AutocompleteItem = {
    id: number;
    name: string;
    flag: string;
    name_long?: string;
    admin?: string;
    abbrev?: string;
    abbrev_rx?: string;
    name_rx?: string;
    brk_name?: string;
    name_sort?: string;
    country?: string;
}

type Props = {
    guesses: Country[];
    setGuesses: React.Dispatch<React.SetStateAction<Country[]>>;
    win: boolean;
    setWin: React.Dispatch<React.SetStateAction<boolean>>;
    practiceMode: boolean;
};

const getScrollTop = () => {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

export default function Guesser({
                                    guesses,
                                    setGuesses,
                                    win,
                                    setWin,
                                    practiceMode,
                                }: Props) {
    const [guessName, setGuessName] = useState("");
    const [guessFlag, setGuessFlag] = useState("");
    const [error, setError] = useState("");
    const [autoCompleteIndex, setAutoCompleteIndex] = useState(1);
    const locale = 'en-CA';
    const langName = 'NAME_EN';

    const guessInputRef = useRef<HTMLInputElement>(null);
    const guessHolderRef = useRef<HTMLInputElement>(null);
    const aotocompleteRef = useRef(null);

    const handleOnSelect = (item: AutocompleteItem) => {
        setGuessFlag(item.flag);
        setGuessName(item.name);
    }

    const handleOnClear = () => {
        setGuessFlag('');
    }

    useEffect(() => {
        if (!guesses.length) {
            handleOnClear();
        }
    }, [guesses]);

    useEffect(() => {
        guessInputRef.current?.focus();
    }, [guessInputRef]);

    const css = useMemo(() => {
        const bg = guessFlag ? `url(https://flagcdn.com/w20/${guessFlag.toLowerCase()}.png)` : 'unset';

        return `.autocomplete-holder .wrapper > div:first-child::before {
            background-image: ${bg};
        }
    `;
    }, [guessFlag]);

    function findCountry(countryName: string, list: Country[]) {
        return list.find((country) => {
            const {NAME, NAME_LONG, ABBREV, ADMIN, BRK_NAME, NAME_SORT} =
                country.properties;

            return (
                NAME.toLowerCase() === countryName ||
                NAME_LONG.toLowerCase() === countryName ||
                ADMIN.toLowerCase() === countryName ||
                ABBREV.toLowerCase() === countryName ||
                ABBREV.replace(/\./g, "").toLowerCase() === countryName ||
                NAME.replace(/-/g, " ").toLowerCase() === countryName ||
                BRK_NAME.toLowerCase() === countryName ||
                NAME_SORT.toLowerCase() === countryName ||
                country.properties[langName].toLowerCase() === countryName
            );
        });
    }

    // Check territories function
    function runChecks() {
        const trimmedName = guessName
            .trim()
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/^st\s/g, "st. ");

        const oldNamePair = alternateNames[locale].find((pair) => {
            return pair.alternative === trimmedName;
        });
        const userGuess = oldNamePair ? oldNamePair.real : trimmedName;
        const alreadyGuessed = findCountry(userGuess, guesses);
        if (alreadyGuessed) {
            setError(localeList[locale]["Game6"]);
            guessInputRef.current?.select();
            return;
        }
        const guessCountry = findCountry(userGuess, countryData);
        if (!guessCountry) {
            setError(localeList[locale]["Game5"]);
            guessInputRef.current?.select();
            return;
        }
        if (practiceMode) {
            const answerCountry = JSON.parse(
                localStorage.getItem("worldlePractice") as string
            ) as Country;
            const answerName = answerCountry.properties.NAME_EN;
            if (guessCountry.properties.NAME_EN === answerName) {
                setWin(true);
            }
        } else if (guessCountry.properties.NAME_EN === answerName) {
            setWin(true);
        }

        return guessCountry;
    }

    function addGuess(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setGuessFlag("");
        setAutoCompleteIndex(autoCompleteIndex + 1);
        let guessCountry = runChecks();

        if (practiceMode) {
            const answerCountry = JSON.parse(
                localStorage.getItem("worldlePractice") as string
            );

            if (guessCountry && answerCountry) {
                guessCountry["proximity"] = polygonDistance(guessCountry, answerCountry);
                guessCountry["direction"] = polygonDirection(guessCountry, answerCountry);
                setGuesses([guessCountry, ...guesses]);
                setGuessName("");
                return;
            }
        }
        if (guessCountry && answerCountry) {
            guessCountry["proximity"] = polygonDistance(guessCountry, answerCountry);
            guessCountry["direction"] = polygonDirection(guessCountry, answerCountry);
            setGuesses([guessCountry, ...guesses]);
            setGuessName("");
        }
    }

    const autocompleteList = useMemo(() => {
        return countryData.map((country, index) => {
            const {
                NAME_EN, ABBREV,
                // NAME_LONG, ADMIN, BRK_NAME, NAME_SORT,
                FLAG
            } =
                country.properties;

            return {
                id: index,
                flag: FLAG,
                name: NAME_EN.toLowerCase(),
                // name_long: NAME_LONG.toLowerCase(),
                // admin: ADMIN.toLowerCase(),
                // abbrev: ABBREV.toLowerCase(),
                abbrev_rx: ABBREV.replace(/\./g, "").toLowerCase(),
                // name_rx: NAME.replace(/-/g, " ").toLowerCase(),
                // brk_name: BRK_NAME.toLowerCase(),
                // name_sort: NAME_SORT.toLowerCase(),
                // country: country.properties[langName].toLowerCase(),
            } as AutocompleteItem;
        })
    }, []);

    useEffect(() => {
        const el = aotocompleteRef.current;
        const observer = new IntersectionObserver(
            ([e]) => e.target.classList.toggle('__pinned', getScrollTop() > 0 && e.intersectionRatio < 1)
            ,
            {threshold: [1]},
        );

        if (el) {
            observer.observe(el);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    console.log('###RENDER### Guesser', autocompleteList);

    return (
        <div ref={aotocompleteRef} className="autocomplete-wrapper">
            <style>{css}</style>
            <form className="autocomplete-form" onSubmit={addGuess}>
                <div ref={guessHolderRef} className={"autocomplete-holder" + (win ? ' __disabled' : '')}>
                    <ReactSearchAutocomplete
                        key={autoCompleteIndex}
                        items={autocompleteList}
                        showItemsOnFocus={true}
                        showIcon={false}
                        showClear={true}
                        maxResults={10}
                        formatResult={(item: AutocompleteItem) => {
                            const {name, flag} = item;

                            return <div className="result-item">
                                <span className="result-item__icon"><img
                                    src={`https://flagcdn.com/w20/${flag.toLowerCase()}.png`}
                                    alt={name}
                                /></span>
                                <span className="result-item__text">{name}</span>
                            </div>
                        }}
                        fuseOptions={
                            {
                                includeScore: false,
                                includeMatches: false,
                                ignoreLocation: false,
                                threshold: 0,
                                location: 0,
                                distance: 10,
                                minMatchCharLength: 1,
                                keys: [
                                    "name",
                                    'abbrev_rx',
                                ]
                            }
                        }
                        placeholder={localeList[locale]["Game1"]}
                        // onSearch={handleOnSearch}
                        // onHover={handleOnHover}
                        onSelect={handleOnSelect}
                        onClear={handleOnClear}
                        // onFocus={handleOnFocus}
                        // autoFocus
                        // formatResult={formatResult}
                    />
                    <input
                        className="hidden"
                        type="text"
                        name="guesser"
                        id="guesser"
                        defaultValue={guessName}
                        ref={guessInputRef}
                        disabled={win}
                    />
                </div>
                <button className="btn btn-darkblue" type="submit" disabled={win}>
                    <FormattedMessage id="Game2"/>
                </button>
            </form>
            <Message
                win={win}
                error={error}
                guesses={guesses.length}
                practiceMode={practiceMode}
            />
        </div>
    );
}
