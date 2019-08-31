import {renderComponent, getSortEventList, unrenderComponent} from "./utils/util";
import {getMockEvent, menuTitles, filters} from "./data";
import Menu from "./components/menu";
import Filter from "./components/filter";
import Info from "./components/info";
import Sort from "./components/sort";
import Days from "./components/days";

const EVENT_COUNT = 7;

const events = new Array(EVENT_COUNT).fill(``).map(getMockEvent);

const getSortEvents = () => {
  const eventsCopy = events.slice();
  return eventsCopy.sort(getSortEventList);
};

const tripInfo = document.querySelector(`.trip-info`);
const tripControls = document.querySelector(`.trip-controls > h2:first-child`);
const tripFilters = document.querySelector(`.trip-controls > h2:last-child`);
const tripEvents = document.querySelector(`.trip-events > h2`);

const menu = new Menu(menuTitles);
const days = new Days(getSortEvents());
const info = new Info(getSortEvents());
const filter = new Filter(filters);
const sort = new Sort();

const renderLayout = () => {
  renderComponent(tripInfo, info.getElement(), `afterbegin`);
  renderComponent(tripControls, menu.getElement());
  renderComponent(tripFilters, filter.getElement());
  renderComponent(tripEvents, days.getElement());
  renderComponent(tripEvents, sort.getElement());
};

renderLayout();

const sumCost = document.querySelector(`.trip-info__cost-value`);
sumCost.textContent = events.map(({price}) => price).reduce((previousPrice, currentPrice) => previousPrice + currentPrice);
