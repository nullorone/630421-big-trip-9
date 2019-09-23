import {getMockEvent, menuTitles} from "./data";
import TripController from "./controllers/trip-controller";
import {getSortEventList, renderComponent} from "./utils/util";
import Menu from "./components/menu";

const EVENT_COUNT = 7;

const tripControls = document.querySelector(`.trip-controls > h2:first-child`);
const addEventButton = document.querySelector(`.trip-main__event-add-btn`);

const events = new Array(EVENT_COUNT).fill(``).map(getMockEvent);

const getSortEvents = () => {
  return events.slice().sort(getSortEventList);
};

const tripController = new TripController(getSortEvents());

const onAddEventButtonClick = (evt) => {
  evt.preventDefault();
  tripController.createEvent();
};

const renderLayout = () => {
  const menu = new Menu(menuTitles);
  renderComponent(tripControls, menu.getElement());
};

renderLayout();

tripController.init();

addEventButton.addEventListener(`click`, onAddEventButtonClick);

