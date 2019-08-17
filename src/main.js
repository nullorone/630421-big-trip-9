import {getTripInfoMarkup} from './components/tripInfo';
import {getTripMenuMarkup} from './components/menu';
import {getTripFilterMarkup} from "./components/filter";
import {getCombineMainMarkup} from "./components/proxyMain";
import {renderComponent} from "./utils/util";

const tripInfo = document.querySelector(`.trip-info`);
const tripControls = document.querySelector(`.trip-controls > h2:first-child`);
const tripFilters = document.querySelector(`.trip-controls > h2:last-child`);
const tripEvents = document.querySelector(`.trip-events > h2`);

const renderLayout = () => {
  renderComponent(tripInfo, getTripInfoMarkup(), `afterbegin`);
  renderComponent(tripControls, getTripMenuMarkup());
  renderComponent(tripFilters, getTripFilterMarkup());
  renderComponent(tripEvents, getCombineMainMarkup());
};

renderLayout();
