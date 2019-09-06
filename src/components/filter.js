import Abstract from "./abstract";

export default class Filter extends Abstract {
  constructor(filters) {
    super();
    this._filters = filters;
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
