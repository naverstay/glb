import React, { useEffect, useRef, useState} from "react";

type Props = {
    show: boolean;
    children: any;
    background?: string;
    delay?: string;
    closeCallback?: React.Dispatch<React.SetStateAction<string>>;
    // preexist?: boolean;
};

export default function Fade({
                                 show,
                                 children,
                                 background,
                                 delay = '',
                                 closeCallback,
                             }: // preexist = false,
                                 Props) {
    const [appear, setAppear] = useState(false);
    const [exist, setExist] = useState(false);
    const popupRef = useRef(null);

    useEffect(() => {
        if (show) {
            setExist(true);
            setTimeout(() => setAppear(true), 150);
        }
        if (!show) {
            setAppear(false);
            setTimeout(() => setExist(false), 150);
        }
    }, [show]);

    return exist ? (
        <div
            ref={popupRef}
            style={{
                transition: "all 250ms linear " + delay,
                opacity: appear ? "1" : "0",
            }}
            onClick={(e) => {
                if (typeof closeCallback === 'function' && e.target === popupRef?.current) {
                    closeCallback('')
                }
            }}
            className={background}
        >
            {children}
        </div>
    ) : null;
}
