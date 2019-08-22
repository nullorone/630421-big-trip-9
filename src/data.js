import {getRandomBoolean, getShuffleArray, getRandomValueOfProps, getDayTime, getRandomImage} from "./utils/util";

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

// Создаем моки точки маршрута
const getMockEvent = () => ({
  type: new Set([`Bus`, `Check-in`, `Drive`, `Flight`, `Restaurant`, `Ship`, `Sightseeing`, `Taxi`, `Train`, `Transport`, `Trip`]),
  city: [`Auckland`, `Hamilton`, `Tauranga`],
  img: new Array(IMAGE_AMOUNT).fill(``).map(getRandomImage),
  description: getShuffleArray(DESCRIPTION_TEXTS).slice(DescriptionItem.BEGIN, getRandomValueOfProps(DescriptionItem.END)),
  days: new Array(3).fill(new Date(getDayTime())),
  time: new Array(3).fill(new Date(getDayTime())),
  price: getRandomValueOfProps(200),
});




export {getMockEvent};
