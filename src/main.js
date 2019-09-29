import {filters, getMockEvent, menuTitles, apiData} from "./data";
import TripController from "./controllers/trip-controller";
import {getSortEventList, renderComponent} from "./utils/util";
import Menu from "./components/menu";
import Filter from "./components/filter";
import Stats from "./components/stats";
import Api from "./api";
import ModelEvent from "./model/model-event";

const EVENT_COUNT = 7;

const stats = new Stats();

const tripEventsContainer = document.querySelector(`.trip-events`);
const tripControls = document.querySelector(`.trip-controls > h2:first-child`);
const tripFilters = document.querySelector(`.trip-controls > h2:last-child`);
const addEventButton = document.querySelector(`.trip-main__event-add-btn`);

const eventsMock = new Array(EVENT_COUNT).fill(``).map(getMockEvent);

let apiEvents = null;
const tripController = new TripController();

const getSortEvents = (events) => {
  return events.slice().sort(getSortEventList);
};

const intervalLoader = setInterval(() => {
  if (!apiEvents) {
    console.log(`Ничего нет`);
  }
}, 100);

const _onTripTabsClick = (evt) => {
  const target = evt.target;
  const isActiveTarget = target.className.includes(`trip-tabs__btn--active`);
  switch (true) {
    case (target.innerText === `Stats` && !isActiveTarget):
      target.classList.add(`trip-tabs__btn--active`);
      target.previousElementSibling.classList.remove(`trip-tabs__btn--active`);
      stats.getElement().classList.remove(`visually-hidden`);
      tripController.hide();
      break;
    case (target.innerText === `Table` && !isActiveTarget):
      target.classList.add(`trip-tabs__btn--active`);
      target.nextElementSibling.classList.remove(`trip-tabs__btn--active`);
      stats.getElement().classList.add(`visually-hidden`);
      tripController.show();
      break;
  }
};

const onAddEventButtonClick = (evt) => {
  evt.preventDefault();
  tripController.createEvent();
};

const renderLayout = () => {
  const menu = new Menu(menuTitles);
  const filter = new Filter(filters);

  renderComponent(tripControls, menu.getElement());
  renderComponent(tripFilters, filter.getElement());
  renderComponent(tripEventsContainer, stats.getElement(), `afterend`);
  menu.getElement().addEventListener(`click`, _onTripTabsClick, true);
  stats.getElement().classList.add(`visually-hidden`);
};

renderLayout();

new Api(apiData)
  .getPoints()
  .then(ModelEvent.parseEvents)
  .then((events) => {
    apiEvents = events;
    tripController.init(getSortEvents(events));
  });

addEventButton.addEventListener(`click`, onAddEventButtonClick);

