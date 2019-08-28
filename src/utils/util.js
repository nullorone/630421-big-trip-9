const DAY_IN_WEEK = 7;
const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const SECONDS_IN_MINUTE = 60;
const MILLISECONDS_IN_SECOND = 1000;

// Рендерим компонент
const renderComponent = (elementContainer, markup, where = `afterend`) => {
  return elementContainer.insertAdjacentHTML(where, markup);
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
    randomIndex = getRandomValueOfProps(i + 1);
    [tempElement, cloneArray[randomIndex]] = [cloneArray[randomIndex], cloneArray[i]];
    cloneArray[i] = tempElement;
  }
  return cloneArray;
};

// Случайное булево значение
const getRandomBoolean = () => {
  return Boolean(Math.round(Math.random()));
};

const getDayTime = () => Date.now() + 1 + getRandomValueOfProps(DAY_IN_WEEK) * HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND;

const getRandomImage = () => `http://picsum.photos/300/150?r=${Math.random()}`;

const getSortEventList = (a, b) => a.time.timeStartEvent - b.time.timeStartEvent;

export {
  renderComponent,
  getShuffleArray,
  getRandomBoolean,
  getRandomNumber,
  getDayTime,
  getRandomImage,
  getSortEventList,
};

