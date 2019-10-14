import {apiSettings} from "./data";
import TripController from "./controllers/trip-controller";
import {createElement, getSortEventList, renderComponent, unrenderComponent} from "./utils/util";
import Menu from "./components/menu";
import Stats from "./components/stats";
import Api from "./api";
import ModelEvent from "./model/model-event";
import Provider from "./provider";
import Store from "./store";

const EVENTS_STORE_KEY = `events-store-key`;

const stats = new Stats();

const tripEventsContainer = document.querySelector(`.trip-events`);
const tripControls = document.querySelector(`.trip-controls > h2:first-child`);
const addEventButton = document.querySelector(`.trip-main__event-add-btn`);
const startingMessage = `<p class="trip-events__msg">Loading...</p>`;

const menuTitles = [
  {
    title: `Table`,
    isActive: true,
  },
  {
    title: `Stats`,
    isActive: false,
  }
];

const tripController = new TripController();
const api = new Api(apiSettings);
const store = new Store({keyStorage: EVENTS_STORE_KEY, storage: window.localStorage});
const provider = new Provider({api, store});

const getSortEvents = (events) => {
  return events.slice().sort(getSortEventList);
};

const onAddEventButtonClick = (evt) => {
  evt.preventDefault();
  evt.target.disabled = true;
  tripController.createEvent();
};

const renderLayout = () => {
  const menu = new Menu(menuTitles);

  renderComponent(tripControls, menu.getElement());
  renderComponent(tripEventsContainer, stats.getElement(), `afterend`);
  stats.getElement().classList.add(`visually-hidden`);
  renderComponent(tripEventsContainer, createElement(startingMessage));
};

const onSyncWindowOnline = () => {
  provider.syncPoints();
  document.title = document.title.split(`[OFFLINE]`)[0];
};

const onSyncWindowOffline = () => {
  document.title = `[OFFLINE]`;
  // window.removeEventListener(`online`, onSyncWindowOnline);
};

console.log(`Мы сейчас online: ${window.navigator.onLine}`);

window.addEventListener(`online`, onSyncWindowOnline);

window.addEventListener(`offline`, onSyncWindowOffline);

renderLayout();

provider
  .getPoints()
  .then(ModelEvent.parseEvents)
  .then((events) => {
    unrenderComponent(document.querySelector(`.trip-events__msg`));
    tripController.init(getSortEvents(events));
  });

addEventButton.addEventListener(`click`, onAddEventButtonClick);

export {EVENTS_STORE_KEY};

