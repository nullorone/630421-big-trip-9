import {getRandomBoolean} from "../utils/util";

const generateFilter = (title, active = getRandomBoolean()) => {
  return {
    title,
    active,
  };
};

// Создаем моки для фильтров
const getMockFilter = () => {
  return [
    generateFilter(`Everything`),
    generateFilter(`Future`),
    generateFilter(`Past`)
  ];
};

// Разметка фильтров
const getTripFilterMarkup = () => `
  <form class="trip-filters" action="#" method="get">
  ${getMockFilter().map(({title, active}) => `<div class="trip-filters__filter">
      <input id="filter-${title.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${title.toLowerCase()}" ${active ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${title.toLowerCase()}">${title}</label>
    </div>`).join(``)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`;

export {getTripFilterMarkup};

