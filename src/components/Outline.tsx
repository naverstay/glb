import {Country} from "../lib/country";
import {polygonDirection, polygonDistance} from "../util/distance";
import {getColour} from "../util/colour";
import {useContext} from "react";
import {ThemeContext} from "../context/ThemeContext";
import {FormattedMessage} from "react-intl";
import {COUNTRY_PATH_BRAZIL, COUNTRY_PATH_CANADA, COUNTRY_PATH_COLOMBIA, COUNTRY_PATH_MEXICO} from "../data/constants";

const countryData: Country[] = require("../data/country_data.json").features;

type Props = {
    countryName: string;
    width: number;
    index: number;
};

export default function Outline({countryName, width, index}: Props) {
    const {nightMode, highContrast, prideMode = false} = useContext(ThemeContext).theme;
    const paths = [COUNTRY_PATH_CANADA, COUNTRY_PATH_MEXICO, COUNTRY_PATH_COLOMBIA, COUNTRY_PATH_BRAZIL]
    const country = countryData.find((p) => p.properties.NAME === countryName);

    if (!country) {
        throw new Error(countryName + " Country in Help screen not found in Country Data");
    }

    const countryCopy: Country = {...country};


    const sampleAnswerName = "Brazil";
    const sampleAnswer = countryData.find(
        (p) => p.properties.NAME === sampleAnswerName
    );

    if (!sampleAnswer) {
        throw new Error("Country in Help screen not found in Country Data");
    }

    countryCopy["proximity"] = polygonDistance(countryCopy, sampleAnswer);
    countryCopy["direction"] = polygonDirection(countryCopy, sampleAnswer);

    const colour = getColour(
        countryCopy,
        sampleAnswer,
        nightMode,
        highContrast,
        prideMode
    );

    return (
        <figure className={`popup-country`}>
            <figcaption className="popup-country__text">
                <FormattedMessage id={countryName}/>
            </figcaption>
            <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width={width}
                height={width * 0.75}
                viewBox="0 0 1024 1024"
                preserveAspectRatio="xMidYMid meet"
            >
                <g id={countryName}>
                    <path transform="translate(0,1024) scale(0.1,-0.1)" fill={colour} d={paths[index]} stroke="black"/>
                </g>
            </svg>
        </figure>
    );
}
