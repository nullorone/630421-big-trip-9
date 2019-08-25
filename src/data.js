import {getShuffleArray, getRandomValueOfProps, getDayTime, getRandomImage, getRandomBoolean} from "./utils/util";

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

const DescriptionItem = {
  BEGIN: 0,
  END: 3,
};

const IMAGE_AMOUNT = 4;
const OFFER_AMOUNT = 2;
const TIME_RANGE = 10000000;

const offers = [
  {
    id: `luggage`,
    title: `Add luggage`,
    price: getRandomValueOfProps(100),
    isChecked: getRandomBoolean(),
  },
  {
    id: `comfort`,
    title: `Switch to comfort class`,
    price: getRandomValueOfProps(100),
    isChecked: getRandomBoolean(),
  },
  {
    id: `meal`,
    title: `Add meal`,
    price: getRandomValueOfProps(100),
    isChecked: getRandomBoolean(),
  },
  {
    id: `seats`,
    title: `Choose seats`,
    price: getRandomValueOfProps(100),
    isChecked: getRandomBoolean(),
  },
  {
    id: `train`,
    title: `Travel by train`,
    price: getRandomValueOfProps(100),
    isChecked: getRandomBoolean(),
  },
  {
    id: `tickets`,
    title: `Book tickets`,
    price: getRandomValueOfProps(100),
    isChecked: getRandomBoolean(),
  },
  {
    id: `lunch`,
    title: `Lunch in city`,
    price: getRandomValueOfProps(100),
    isChecked: getRandomBoolean(),
  },
  {
    id: `breakfast`,
    title: `Add breakfast`,
    price: getRandomValueOfProps(100),
    isChecked: getRandomBoolean(),
  },
  {
    id: `car`,
    title: `Rent a car`,
    price: getRandomValueOfProps(100),
    isChecked: getRandomBoolean(),
  },
  {
    id: `uber`,
    title: `Order Uber`,
    price: getRandomValueOfProps(100),
    isChecked: getRandomBoolean(),
  }
];

const types = [
  {
    transfer: [
      {
        iconName: `bus`,
        title: `Bus to`,
      },
      {
        iconName: `drive`,
        title: `Drive to`,
      },
      {
        iconName: `flight`,
        title: `Flight to`,
      },
      {
        iconName: `ship`,
        title: `Ship to`,
      },
      {
        iconName: `taxi`,
        title: `Taxi to`,
      },
      {
        iconName: `train`,
        title: `Train to`,
      },
      {
        iconName: `transport`,
        title: `Transport to`,
      }
    ],
    activity: [
      {
        iconName: `check-in`,
        title: `Check in`,
      },
      {
        iconName: `sightseeing`,
        title: `Sightseeing at`,
      },
      {
        iconName: `restaurant`,
        title: `Eat at`,
      }
    ],
  }
];

const getRandomOffer = () => {
  return offers[getRandomValueOfProps(offers.length - 1)];
};

const getOffers = () => {
  return new Array(getRandomValueOfProps(OFFER_AMOUNT)).fill(``).map(getRandomOffer);
};

const getTime = () => {
  const timeStartEvent = getDayTime() + getRandomValueOfProps(TIME_RANGE);
  const timeFinishEvent = timeStartEvent + getRandomValueOfProps(TIME_RANGE);
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

// Создаем моки точки маршрута
const getMockEvent = () => ({
  types: new Set(types),
  cities: [`Auckland`, `Hamilton`, `Wellington`, `Christchurch`, `Tauranga`],
  img: new Array(IMAGE_AMOUNT).fill(``).map(getRandomImage),
  description: getShuffleArray(DESCRIPTION_TEXTS).slice(DescriptionItem.BEGIN, getRandomValueOfProps(DescriptionItem.END)),
  time: getTime(),
  price: getRandomValueOfProps(200),
  offers: new Set(getOffers()),
});


export {getMockEvent};
