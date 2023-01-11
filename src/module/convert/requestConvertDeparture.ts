export const requestConvertDeparture = (departureAddress: string, departureName: string) => {
  const departures = departureAddress.split(" ");

  if (departures.length < 3) {
    return null;
  } else if (departures.length == 3) {
    return {
      region: departures[0],
      city: departures[1],
      town: departures[2],
      name: departureName,
    };
  } else if (departures.length == 4) {
    return {
      region: departures[0],
      city: departures[1],
      town: departures[2],
      detail: departures[3],
      name: departureName,
    };
  } else {
    //departures length 가 4이상인경우
    return {
      region: departures[0],
      city: departures[1],
      town: departures[2],
      detail: departures.slice(3, departures.length).join(" "),
      name: departureName,
    };
  }
};
