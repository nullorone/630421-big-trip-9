import {getTripInfoMarkup} from './components/tripInfo';
import {getTripMenuMarkup} from './components/menu';
import {getTripFilterMarkup} from "./components/filter";
import {renderComponent, getSortEventList} from "./utils/util";
import {getSortMarkup} from "./components/sort";
import {getTripDaysListMarkup} from "./components/tripDays";
import {getMockEvent} from "./data";

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
  renderComponent(tripInfo, getTripInfoMarkup(getSortEvents()), `afterbegin`);
  renderComponent(tripControls, getTripMenuMarkup());
  renderComponent(tripFilters, getTripFilterMarkup());
  renderComponent(tripEvents, getSortMarkup() + getTripDaysListMarkup(getSortEvents()));
};

renderLayout();

const sumCost = document.querySelector(`.trip-info__cost-value`);
sumCost.textContent = events.map(({price}) => price).reduce((previousPrice, currentPrice) => previousPrice + currentPrice);
