const API_URL = `https://htmlacademy-es-9.appspot.com/big-trip`;

const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

const apiSettings = {
  endPoint: API_URL,
  authorization: `htmlacademy2019`,
};

const types = [
  {
    transfer: [
      {
        id: `bus`,
        iconSrc: `./img/icons/bus.png`,
        title: `Bus to`,
      },
      {
        id: `drive`,
        iconSrc: `./img/icons/drive.png`,
        title: `Drive to`,
      },
      {
        id: `flight`,
        iconSrc: `./img/icons/flight.png`,
        title: `Flight to`,
      },
      {
        id: `ship`,
        iconSrc: `./img/icons/ship.png`,
        title: `Ship to`,
      },
      {
        id: `taxi`,
        iconSrc: `./img/icons/taxi.png`,
        title: `Taxi to`,
      },
      {
        id: `train`,
        iconSrc: `./img/icons/train.png`,
        title: `Train to`,
      },
      {
        id: `transport`,
        iconSrc: `./img/icons/transport.png`,
        title: `Transport to`,
      }
    ],
    activity: [
      {
        id: `check-in`,
        iconSrc: `./img/icons/check-in.png`,
        title: `Check in`,
      },
      {
        id: `sightseeing`,
        iconSrc: `./img/icons/sightseeing.png`,
        title: `Sightseeing at`,
      },
      {
        id: `restaurant`,
        iconSrc: `./img/icons/restaurant.png`,
        title: `Eat at`,
      }
    ],
  }
];

export {
  types,
  Mode,
  apiSettings};
