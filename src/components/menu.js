import Abstract from "./abstract";

export default class Menu extends Abstract {
  constructor(menuItems) {
    super();
    this._menuItems = menuItems;
  }

  getTemplate() {
    return `
        <nav class="trip-controls__trip-tabs  trip-tabs">
        ${this._menuItems.map(({title, isActive}) => `<a class="trip-tabs__btn ${isActive ? `trip-tabs__btn--active` : ``}" href="#">${title}</a>`).join(``)}
        </nav>`.trim();
  }
}

