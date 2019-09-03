import {createElement} from "../utils/util";

export default class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  _generateFilters() {
    return this._filters.map(({title, isActive}) => {
      return `
        <div class="trip-filters__filter">
          <input id="filter-${title.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${title.toLowerCase()}" ${isActive ? `checked` : ``}>
          <label class="trip-filters__filter-label" for="filter-${title.toLowerCase()}">${title}</label>
        </div>`.trim();
    }).join(``);
  }

  getTemplate() {
    return `
      <form class="trip-filters" action="#" method="get">
        ${this._generateFilters()}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`.trim();
  }
}
