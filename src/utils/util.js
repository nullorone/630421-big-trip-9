import moment from "moment";

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

const getDurationTime = (timeStart, timeFinish) => {
  const diffTime = Math.abs(timeFinish - timeStart);
  const days = moment.utc(timeFinish).diff(moment.utc(timeStart), `days`);
  const hours = moment.utc(diffTime).format(`H[H]`);
  const minutes = moment.utc(diffTime).format(`mm[M]`);

  return {
    days: days !== 0 ? `${days}D` : ``,
    hours: hours !== `0H` ? hours : ``,
    minutes: minutes !== `00M` ? minutes : ``,
  };
};

// Случайное булево значение
const getRandomBoolean = () => {
  return Boolean(Math.round(Math.random()));
};

const getDayTime = () => Date.now() - getRandomNumber(0, DAY_IN_WEEK) * HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND;

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
  getDurationTime,
};

