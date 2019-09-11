import {filters, getMockEvent, menuTitles} from "./data";
import TripController from "./controllers/trip-controller";
import {getSortEventList, renderComponent} from "./utils/util";
import Menu from "./components/menu";
import Filter from "./components/filter";

const EVENT_COUNT = 7;

const tripControls = document.querySelector(`.trip-controls > h2:first-child`);
const tripFilters = document.querySelector(`.trip-controls > h2:last-child`);

const events = new Array(EVENT_COUNT).fill(``).map(getMockEvent);

const getSortEvents = () => {
  return events.slice().sort(getSortEventList);
};

const renderLayout = () => {
  const menu = new Menu(menuTitles);
  const filter = new Filter(filters);

  renderComponent(tripControls, menu.getElement());
  renderComponent(tripFilters, filter.getElement());
};

renderLayout();

const tripController = new TripController(getSortEvents());
tripController.init();
