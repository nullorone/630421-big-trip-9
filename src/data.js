import {getRandomNumber, getDayTime, getRandomImage, getRandomBoolean} from "./utils/util";

const DESCRIPTION_TEXTS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const IMAGE_AMOUNT = 4;
const OFFER_AMOUNT = 2;
const TIME_RANGE = 10000000;

const CITIES = [`Auckland`, `Hamilton`, `Wellington`, `Christchurch`, `Tauranga`];

const offers = [
  {
    id: `luggage`,
    title: `Add luggage`,
    price: getRandomNumber(0, 100),
    isChecked: getRandomBoolean(),
  },
  {
    id: `comfort`,
    title: `Switch to comfort class`,
    price: getRandomNumber(0, 100),
    isChecked: getRandomBoolean(),
  },
  {
    id: `meal`,
    title: `Add meal`,
    price: getRandomNumber(0, 100),
    isChecked: getRandomBoolean(),
  },
  {
    id: `seats`,
    title: `Choose seats`,
    price: getRandomNumber(0, 100),
    isChecked: getRandomBoolean(),
  },
  {
    id: `train`,
    title: `Travel by train`,
    price: getRandomNumber(0, 100),
    isChecked: getRandomBoolean(),
  },
  {
    id: `tickets`,
    title: `Book tickets`,
    price: getRandomNumber(0, 100),
    isChecked: getRandomBoolean(),
  },
  {
    id: `lunch`,
    title: `Lunch in city`,
    price: getRandomNumber(0, 100),
    isChecked: getRandomBoolean(),
  },
  {
    id: `breakfast`,
    title: `Add breakfast`,
    price: getRandomNumber(0, 100),
    isChecked: getRandomBoolean(),
  },
  {
    id: `car`,
    title: `Rent a car`,
    price: getRandomNumber(0, 100),
    isChecked: getRandomBoolean(),
  },
  {
    id: `uber`,
    title: `Order Uber`,
    price: getRandomNumber(0, 100),
    isChecked: getRandomBoolean(),
  }
];

const types = [
  {
    transfer: [
      {
        id: `bus-to`,
        iconName: `bus`,
        title: `Bus to`,
      },
      {
        id: `drive-to`,
        iconName: `drive`,
        title: `Drive to`,
      },
      {
        id: `flight-to`,
        iconName: `flight`,
        title: `Flight to`,
      },
      {
        id: `ship-to`,
        iconName: `ship`,
        title: `Ship to`,
      },
      {
        id: `taxi-to`,
        iconName: `taxi`,
        title: `Taxi to`,
      },
      {
        id: `train-to`,
        iconName: `train`,
        title: `Train to`,
      },
      {
        id: `transport-to`,
        iconName: `transport`,
        title: `Transport to`,
      }
    ],
    activity: [
      {
        id: `check-in`,
        iconName: `check-in`,
        title: `Check in`,
      },
      {
        id: `sightseeing-at`,
        iconName: `sightseeing`,
        title: `Sightseeing at`,
      },
      {
        id: `eat-at`,
        iconName: `restaurant`,
        title: `Eat at`,
      }
    ],
  }
];

const menuTitles = [
  {
    title: `Table`,
    isActive: true,
  },
  {
    title: `Stats`,
    isActive: false,
  }
];

// Создаем моки для фильтров
const filters = [
  {
    title: `Everything`,
    isActive: true,
  },
  {
    title: `Future`,
    isActive: false,
  },
  {
    title: `Past`,
    isActive: false,
  }
];

const getRandomOffer = () => {
  return offers[getRandomNumber(0, offers.length - 1)];
};

const getOffers = () => {
  return new Array(getRandomNumber(0, OFFER_AMOUNT)).fill(``).map(getRandomOffer);
};

const getTime = () => {
  const timeStartEvent = getDayTime() + getRandomNumber(0, TIME_RANGE);
  const timeFinishEvent = timeStartEvent + getRandomNumber(0, TIME_RANGE);
  const diffTime = Math.abs(timeFinishEvent - timeStartEvent);

  let minutes = Math.floor(diffTime / 1000 / 60) % 60;
  let hours = Math.floor(diffTime / 1000 / 60 / 60) % 24;
  let days = Math.floor((diffTime / 1000 / 60 / 60) / 24);

  minutes = minutes ? `${minutes}M` : ``;
  hours = hours ? `${hours}H` : ``;
  days = days ? `${days}D` : ``;

  return {
    timeStartEvent,
    timeFinishEvent,
    duration: {
      days,
      hours,
      minutes,
    }
  };
};

const getRandomDescription = () => {
  const randomDescriptionLength = getRandomNumber(1, 4);
  let description = [];
  for (let i = 0; i < randomDescriptionLength; i++) {
    description.push(DESCRIPTION_TEXTS[getRandomNumber(0, DESCRIPTION_TEXTS.length)]);
  }
  return description.join(` `);
};

const getRandomType = () => {
  const [{transfer, activity}] = new Set(types);
  return [...transfer, ...activity][getRandomNumber(0, [...transfer, ...activity].length - 1)];
};

const getRandomCity = () => {
  return CITIES[getRandomNumber(0, CITIES.length - 1)];
};

// Создаем моки точки маршрута
const getMockEvent = () => ({
  type: getRandomType(),
  city: getRandomCity(),
  img: new Array(IMAGE_AMOUNT).fill(``).map(getRandomImage),
  description: getRandomDescription(),
  time: getTime(),
  price: getRandomNumber(0, 200),
  offers: new Set(getOffers()),
});


export {getMockEvent, types, CITIES, menuTitles, filters};
