export const requestConvertDeparture = (departureAddress: string, departureName: string) => {
  const departures = departureAddress.split(" ");

  if (departures.length == 4) {
    return {
      region: departures[0],
      city: departures[1],
      town: departures[2],
      detail: departures[3],
      name: departureName,
    };
  } else if (departures.length == 3) {
    return {
      region: departures[0],
      city: departures[1],
      town: departures[2],
      name: departureName,
    };
  } else return null;
};
