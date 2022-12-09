import {Direction} from "../util/distance";

export type Country = {
    type: string;
    proximity: number;
    direction: Direction;
    properties: {
        scalerank: number;
        SOVEREIGNT: string;
        ADMIN: string;
        TYPE: string;
        NAME: string;
        NAME_LONG: string;
        BRK_NAME: string;
        ABBREV: string;
        POSTAL: string;
        FORMAL_EN: string | null;
        NAME_SORT: string;
        NAME_ALT: string | null;
        FLAG: string;
        NAME_LEN: number;
        LONG_LEN: number;
        ABBREV_LEN: number;
        NAME_EN: string;
    };
    bbox: number[];
    geometry:
        | {
        type: "Polygon";
        coordinates: number[][][];
    }
        | {
        type: "MultiPolygon";
        coordinates: number[][][][];
    };
};

type LanguageName = "NAME_EN";
