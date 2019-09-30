import {menuTitles, apiData} from "./data";
import TripController from "./controllers/trip-controller";
import {getSortEventList, renderComponent} from "./utils/util";
import Menu from "./components/menu";
import Stats from "./components/stats";
import Api from "./api";
import ModelEvent from "./model/model-event";


const stats = new Stats();

const tripEventsContainer = document.querySelector(`.trip-events`);
const tripControls = document.querySelector(`.trip-controls > h2:first-child`);
const addEventButton = document.querySelector(`.trip-main__event-add-btn`);

const tripController = new TripController();

const getSortEvents = (events) => {
  return events.slice().sort(getSortEventList);
};

const onAddEventButtonClick = (evt) => {
  evt.preventDefault();
  tripController.createEvent();
};

const renderLayout = () => {
  const menu = new Menu(menuTitles);

  renderComponent(tripControls, menu.getElement());
  renderComponent(tripEventsContainer, stats.getElement(), `afterend`);
  stats.getElement().classList.add(`visually-hidden`);
};

renderLayout();

new Api(apiData)
  .getPoints()
  .then(ModelEvent.parseEvents)
  .then((events) => {
    tripController.init(getSortEvents(events));
  });

addEventButton.addEventListener(`click`, onAddEventButtonClick);

