export const requestConvertDeparture = (departureAddress: string, departuerName: string) => {
    const departures = departureAddress.split(' ');
    if (departures.length != 4) return null;
    const departureObject = {
        region: departures[0],
        city: departures[1],
        town: departures[2],
        detail: departures[3],
        name: departuerName
    };
    return departureObject;
};