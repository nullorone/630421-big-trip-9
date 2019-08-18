// Рендерим компонент
const renderComponent = (elementContainer, markup, where = `afterend`) => {
  return elementContainer.insertAdjacentHTML(where, markup);
};

// Случайное значение от 0 до передаваемого
const getRandomValueOfProps = (number) => {
  return Math.floor(Math.random() * number);
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

export {
  renderComponent,
  getShuffleArray,
  getRandomBoolean
};

