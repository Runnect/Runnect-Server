"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestConvertDeparture = void 0;
const requestConvertDeparture = (departureAddress, departureName) => {
    const departures = departureAddress.split(" ");
    if (departures.length == 4) {
        return {
            region: departures[0],
            city: departures[1],
            town: departures[2],
            detail: departures[3],
            name: departureName,
        };
    }
    else if (departures.length == 3) {
        return {
            region: departures[0],
            city: departures[1],
            town: departures[2],
            name: departureName,
        };
    }
    else
        return null;
};
exports.requestConvertDeparture = requestConvertDeparture;
//# sourceMappingURL=requestConvertDeparture.js.map