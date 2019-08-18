import {getMockFilter} from "../data";

// Разметка фильтров
const getTripFilterMarkup = () => `
  <form class="trip-filters" action="#" method="get">
  ${getMockFilter().map(({filter, checked}) => `<div class="trip-filters__filter">
      <input id="filter-${filter.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.toLowerCase()}" ${checked ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${filter.toLowerCase()}">${filter}</label>
    </div>`).join(``)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`;

export {getTripFilterMarkup};

