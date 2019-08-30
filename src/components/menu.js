import {createElement} from "../utils/util";

export default class Menu {
  constructor(menuItems) {
    this._menuItems = menuItems;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  getTemplate() {
    return `
        <nav class="trip-controls__trip-tabs  trip-tabs">
        ${this._menuItems.map(({title, isActive}) => `<a class="trip-tabs__btn ${isActive ? `trip-tabs__btn--active` : ``}" href="#">${title}</a>`).join(``)}
        </nav>`.trim();
  }
}

