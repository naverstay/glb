import {useContext, useEffect, useState} from "react";
import {ThemeContext} from "../context/ThemeContext";
import Fade from "../transitions/Fade";
import Outline from "../components/Outline";
import {FormattedMessage} from "react-intl";
import {getPath} from "../util/svg";

type Props = {
    closeCallback: React.Dispatch<React.SetStateAction<string>>;
};

export default function Help({closeCallback}: Props) {
    // Theme
    const {nightMode} = useContext(ThemeContext).theme;

    const countrySize = 150;
    const [outlines, setOutlines] = useState<string[]>([]);

    useEffect(() => {
        const outlineTimer = setTimeout(() => {
            setOutlines(["Canada", "Mexico", "Colombia", "Brazil"]);
        }, 500);

        return () => {
            setOutlines([]);
            clearTimeout(outlineTimer);
        }
    }, [])

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
                    <FormattedMessage id="helpTitle"/>
                </h2>
            </div>

            <div className="popup-body">
                <p>
                    <FormattedMessage
                        id="help1"
                        values={{
                            // @ts-ignore
                            b: (chunks: string) => (
                                <b className={nightMode ? "text-purple-400" : "text-red-800"}>
                                    {chunks}
                                </b>
                            ),
                        }}
                    />
                </p>
                <p>
                    <FormattedMessage id="help2" values={{
                        // @ts-ignore
                        b: (chunks: string) => <b>{chunks}</b>
                    }}
                    />
                </p>
                <div className="popup-countries">
                    {outlines.map((country, idx) => {
                        return (
                            <Fade key={idx} show={true} background="country-block" delay={((idx / 2) + .25) + 's'}>
                                <Outline key={idx} index={idx} countryName={country} width={countrySize}/>
                            </Fade>
                        );
                    })}
                </div>
                <p className="text-center fw-b">
                    <FormattedMessage id="help3"/>
                </p>
            </div>
        </div>
    );
}
