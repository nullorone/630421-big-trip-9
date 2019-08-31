import {renderComponent, getSortEventList} from "./utils/util";
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

const renderLayout = () => {
  renderComponent(tripInfo, new Info(getSortEvents()).getElement(), `afterbegin`);
  renderComponent(tripControls, new Menu(menuTitles).getElement());
  renderComponent(tripFilters, new Filter(filters).getElement());
  renderComponent(tripEvents, new Days(getSortEvents()).getElement());
  renderComponent(tripEvents, new Sort().getElement());
};

renderLayout();

const sumCost = document.querySelector(`.trip-info__cost-value`);
sumCost.textContent = events.map(({price}) => price).reduce((previousPrice, currentPrice) => previousPrice + currentPrice);
