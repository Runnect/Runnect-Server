export const requestConvertDeparture = (departureAddress: string, departuerName: string) => {
    const departures = departureAddress.split(' ');
    const departureObject = {
        region: departures[0],
        city: departures[1],
        town: departures[2],
        detail: departures[3],
        name: departuerName
    };
    return departureObject;
};