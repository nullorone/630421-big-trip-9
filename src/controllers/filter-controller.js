import Filter from "../components/filter";
import {filters} from "../data";
import {renderComponent} from "../utils/util";

export default class FilterController {
  constructor(onFilterChange) {
    this._filters = filters;
    this._filterComponent = new Filter(this._filters);
    this._filterContainer = document.querySelector(`.trip-controls > h2:last-child`);
    this._onFilterChange = onFilterChange;

    this._renderFilters();
  }

  init(events) {
    this._filterComponent.getElement().addEventListener(`change`, (evt) => {
      const target = evt.target;
      if (!target.className.includes(`trip-filters__filter-input`)) {
        return;
      }

      switch (true) {
        case (target.checked && target.value === `future`):
          const futureEvents = events.slice().filter((event) => event[0].time.timeStartEvent > Date.now());
          this._onFilterChange(futureEvents);
          break;
        case (target.checked && target.value === `past`):
          const pastEvents = events.slice().filter((event) => event[0].time.timeStartEvent < Date.now());
          this._onFilterChange(pastEvents);
          break;
        default:
          this._onFilterChange(events);
          break;
      }

    }, true);
  }

  _renderFilters() {
    renderComponent(this._filterContainer, this._filterComponent.getElement());
  }
}

