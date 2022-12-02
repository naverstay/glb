import * as geometry from "spherical-geometry-js";
import {Country} from "../lib/country";
import polylabel from "polylabel";
// @ts-ignore
import * as geolib from "geolib";
import {GeolibInputCoordinates} from "geolib/es/types";

export type Direction =
    | "S"
    | "W"
    | "NNE"
    | "NE"
    | "ENE"
    | "E"
    | "ESE"
    | "SE"
    | "SSE"
    | "SSW"
    | "SW"
    | "WSW"
    | "WNW"
    | "NW"
    | "NNW"
    | "N";

export const DIRECTION_ARROWS: Record<Direction, string> = {
    N: "⬆️",
    NNE: "↗️",
    NE: "↗️",
    ENE: "↗️",
    E: "➡️",
    ESE: "↘️",
    SE: "↘️",
    SSE: "↘️",
    S: "⬇️",
    SSW: "↙️",
    SW: "↙️",
    WSW: "↙️",
    W: "⬅️",
    WNW: "↖️",
    NW: "↖️",
    NNW: "↖️",
};

function pointToCoordinates(point: Array<number>) {
    // In the data, coordinates are [E/W (lng), N/S (lat)]
    // In the function, coordinates are [N/S (lat), E/W (lng)]
    // For both, West and South are negative
    const [lng, lat] = point;
    return new geometry.LatLng(lat, lng);
}

export function polygonPoints(country: Country) {
    const {geometry} = country;
    switch (geometry.type) {
        case "Polygon":
            return geometry.coordinates[0];
        case "MultiPolygon":
            let points: number[][] = [];
            for (const polygon of geometry.coordinates) {
                points = [...points, ...polygon[0]];
            }
            return points;
        default:
            throw new Error("Country data error");
    }
}

function calcProximity(points1: number[][], points2: number[][]) {
    // Find min distance between 2 sets of points
    const EARTH_CIRCUMFERENCE = 40_075_000;
    let distance = EARTH_CIRCUMFERENCE / 2;
    for (let i = 0; i < points1.length; i++) {
        const point1 = points1[i];
        const coord1 = pointToCoordinates(point1);
        for (let j = 0; j < points2.length; j++) {
            const point2 = points2[j];
            const coord2 = pointToCoordinates(point2);
            const pointDistance = geometry.computeDistanceBetween(coord1, coord2);
            distance = Math.min(distance, pointDistance);
        }
    }
    return distance;
}

export function polygonDistance(country1: Country, country2: Country) {
    const name1 = country1.properties.NAME;
    const name2 = country2.properties.NAME;
    if (name1 === "South Africa" && name2 === "Lesotho") return 0;
    if (name1 === "Lesotho" && name2 === "South Africa") return 0;
    if (name1 === "Italy" && name2 === "Vatican") return 0;
    if (name1 === "Vatican" && name2 === "Italy") return 0;
    if (name1 === "Italy" && name2 === "San Marino") return 0;
    if (name1 === "San Marino" && name2 === "Italy") return 0;
    const points1 = polygonPoints(country1);
    const points2 = polygonPoints(country2);
    return name1 === name2 ? 0 : calcProximity(points1, points2);
}

export function polygonDirection(country1: Country, country2: Country): Direction {
    const coord1 = country1.geometry.type === 'MultiPolygon' ? country1.geometry.coordinates.flat() : country1.geometry.coordinates;
    const coord2 = country2.geometry.type === 'MultiPolygon' ? country2.geometry.coordinates.flat() : country2.geometry.coordinates;

    const poly1 = polylabel(coord1, 1.0);
    const poly2 = polylabel(coord2, 1.0);

    const center1 = pointToCoordinates([poly1[0], poly1[1]]);
    const center2 = pointToCoordinates([poly2[0], poly2[1]]);

    return geolib.getCompassDirection(center1, center2, (origin: GeolibInputCoordinates, dest: GeolibInputCoordinates) =>
        Math.round(geolib.getRhumbLineBearing(origin, dest) / 45) * 45
    )
}
