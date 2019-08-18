import {getRandomBoolean, getShuffleArray, getRandomValueOfProps} from "./utils/util";

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


const DAY_IN_WEEK = 7;
const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const SECONDS_IN_MINUTE = 60;
const MILLISECONDS_IN_SECOND = 1000;

const getDayTime = () => Date.now() + 1 + getRandomValueOfProps(DAY_IN_WEEK) * HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND;

const getRandomImage = () => `http://picsum.photos/300/150?r=${Math.random()}`;

// Создаем моки точки маршрута
const getMockEvent = () => ({
  type: new Set([`Bus`, `Check-in`, `Drive`, `Flight`, `Restaurant`, `Ship`, `Sightseeing`, `Taxi`, `Train`, `Transport`, `Trip`]),
  city: [`Auckland`, `Hamilton`, `Tauranga`],
  img: new Array(IMAGE_AMOUNT).fill(``).map(getRandomImage),
  description: getShuffleArray(DESCRIPTION_TEXTS).slice(DescriptionItem.BEGIN, getRandomValueOfProps(DescriptionItem.END)),
  days: new Array(3).fill(new Date(getDayTime()).toDateString().slice(4, -5)),
  time: new Date(getDayTime()).toTimeString().slice(0, 5),
  price: getRandomValueOfProps(200),
});

// Создаем моки для меню
const getMockMenu = () => {
  return [
    {
      title: `Table`,
      active: getRandomBoolean(),
    },
    {
      title: `Stats`,
      active: getRandomBoolean(),
    },
  ];
};

// Создаем моки для фильтров
const getMockFilter = () => {
  return [
    {
      filter: `Everything`,
      checked: getRandomBoolean(),
    },
    {
      filter: `Future`,
      checked: getRandomBoolean(),
    },
    {
      filter: `Past`,
      checked: getRandomBoolean(),
    },
  ];
};


export {getMockMenu, getMockFilter, getMockEvent};
