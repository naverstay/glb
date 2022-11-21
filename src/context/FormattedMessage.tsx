import {English} from "../i18n/messages/en-CA";

type FormattedMessageProps = {
    id: string;
    values?: (string[]) | { answer?: (string | JSX.Element) };
}

export const FormattedMessage = ({id, values}: FormattedMessageProps) => {
    let ret = '';
    let done: string[] = [];
    let retElement: (string | JSX.Element)[] = [];

    const rx = /{.+}/ig;

    if (Object.keys(English).indexOf(id) > -1) {

        let index = Object.keys(English).findIndex(f => f === id)

        if (index > -1) {
            ret = Object.values(English)[index]
        }

        if (rx.test(ret) && values) {
            const match = ret.match(rx)

            if (match?.length) {
                const split = ret.split(rx);

                if (split?.length) {
                    for (let i = 0; i < split.length; i++) {
                        const splitElement = split[i];
                        retElement.push(splitElement);

                        Object.keys(values).forEach((k, ki) => {
                            const key = k.replace(/{}/g, '')
                            if (ret.indexOf(splitElement) > -1 && done.indexOf(key) === -1) {
                                done.push(key);
                                // @ts-ignore
                                retElement.push(values[key]);
                            }
                        })
                    }
                }

            }
        }
    }

    if (retElement.length) {
        return <>{retElement}</>
    }

    return <span dangerouslySetInnerHTML={{__html: ret}}/>
};
