import {English} from "../i18n/messages/en-CA";

type FormattedMessageProps = {
    id: string;
    values?: (string[]) | { answer?: (string | JSX.Element) };
}

export const FormattedMessage = ({id, values}: FormattedMessageProps) => {
    let ret = '';

    if (Object.keys(English).indexOf(id) > -1) {
        // console.log('English', English[id]);

        let index = Object.keys(English).findIndex(f => f === id)

        if (index > -1) {
            ret = Object.values(English)[index]
        }
    }

    return <span dangerouslySetInnerHTML={{__html: ret}}/>
};
