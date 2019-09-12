const DAY_IN_WEEK = 7;
const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const SECONDS_IN_MINUTE = 60;
const MILLISECONDS_IN_SECOND = 1000;

// Рендерим компонент
const renderComponent = (elementContainer, element, where = `afterend`) => {
  return elementContainer.insertAdjacentElement(where, element);
};

// Анрендер компонента
const unrenderComponent = (element) => {
  if (element) {
    element.remove();
  }
};

// Случайное число
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Перемешиваем элементы в массиве
const getShuffleArray = (array) => {
  let cloneArray = array.slice();
  let randomIndex;
  let tempElement;
  for (let i = 0; i < cloneArray.length; i++) {
    randomIndex = getRandomNumber(0, i + 1);
    [tempElement, cloneArray[randomIndex]] = [cloneArray[randomIndex], cloneArray[i]];
    cloneArray[i] = tempElement;
  }
  return cloneArray;
};

const convertTimeData = (time) => {
  const times = time.split(` `);
  const date = times[0].split(`/`).reverse().join(`-`);
  const newTime = `${date} ${times[1]}`;
  return Date.parse(newTime);
};

const getDurationTime = (timeStart, timeFinish) => {
  const diffTime = Math.abs(timeFinish - timeStart);

  let minutes = Math.floor(diffTime / 1000 / 60) % 60;
  let hours = Math.floor(diffTime / 1000 / 60 / 60) % 24;
  let days = Math.floor((diffTime / 1000 / 60 / 60) / 24);

  minutes = minutes ? `${minutes}M` : ``;
  hours = hours ? `${hours}H` : ``;
  days = days ? `${days}D` : ``;

  return {
    days,
    hours,
    minutes,
  };
};

// Случайное булево значение
const getRandomBoolean = () => {
  return Boolean(Math.round(Math.random()));
};

const getDayTime = () => Date.now() + 1 + getRandomNumber(0, DAY_IN_WEEK) * HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND;

const getRandomImage = () => `http://picsum.photos/300/150?r=${Math.random()}`;

const getSortEventList = (a, b) => Date.parse(new Date(a.time.timeStartEvent).toDateString()) - Date.parse(new Date(b.time.timeStartEvent).toDateString());

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstElementChild;
};

export {
  renderComponent,
  unrenderComponent,
  getShuffleArray,
  getRandomBoolean,
  getRandomNumber,
  getDayTime,
  getRandomImage,
  getSortEventList,
  createElement,
  convertTimeData,
  getDurationTime,
};

