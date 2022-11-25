type Props = {
    name: string;
    toggle: boolean;
    setToggle: React.Dispatch<React.SetStateAction<boolean>>;
    on: string;
    off: string;
    top?: string;
    bottom?: string;
    customClass?: string;
};

export default function Switch({name, toggle, setToggle, on, off, top, bottom, customClass = ''}: Props) {
    function keyPressToggle(
        e: React.KeyboardEvent<HTMLLabelElement>,
        toggle: boolean,
        setToggle: React.Dispatch<React.SetStateAction<boolean>>
    ) {
        const keys = ["Enter", " ", "Return"];
        if (keys.includes(e.key)) {
            setToggle(!toggle);
        }
    }

    return (
        <div className="toggle-holder">
            <div className="toggle-wrapper">
                <label
                    htmlFor={name}
                    key={name}
                    className={"toggle-label" + (toggle ? " __checked" : "") + customClass}
                    onKeyPress={(e) => keyPressToggle(e, toggle, setToggle)}
                    tabIndex={0}
                >
                    <span dangerouslySetInnerHTML={{__html: (toggle ? off : on)}} className="toggle-text"/>
                    <input
                        id={name}
                        type="checkbox"
                        className="hidden"
                        checked={toggle}
                        onChange={() => setToggle(!toggle)}
                        tabIndex={-1}
                        aria-hidden="true"
                    />
                </label>
                <span className="toggle-wrapper__text toggle-wrapper__top">{top}</span>
                <span className="toggle-wrapper__text toggle-wrapper__bottom">{bottom}</span>
            </div>
        </div>
    );
}
