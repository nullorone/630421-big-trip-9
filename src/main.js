import {renderComponent, getSortEventList, createElement} from "./utils/util";
import {getMockEvent, menuTitles, filters} from "./data";
import Menu from "./components/menu";
import Filter from "./components/filter";
import Info from "./components/info";
import Sort from "./components/sort";
import Day from "./components/day";
import Days from "./components/days";
import Event from "./components/event";
import EventEdit from "./components/eventEdit";

const EVENT_COUNT = 7;

const tripInfo = document.querySelector(`.trip-info`);
const tripControls = document.querySelector(`.trip-controls > h2:first-child`);
const tripFilters = document.querySelector(`.trip-controls > h2:last-child`);
const tripEvents = document.querySelector(`.trip-events > h2`);

const events = new Array(EVENT_COUNT).fill(``).map(getMockEvent);

const getSortEvents = (eventsMock) => eventsMock.slice().sort(getSortEventList);

const getUniqueDays = (eventsMock) => {
  const tripDays = eventsMock.map(({time: {timeStartEvent}}) => new Date(timeStartEvent).toDateString());
  return Array.from(new Set(tripDays)).map((time) => {
    const filteredEvents = eventsMock.filter((event) => new Date(event.time.timeStartEvent).toDateString() === time);
    return [time, filteredEvents];
  });
};

const renderEvent = (eventsList, eventMock) => {
  const event = new Event(eventMock);
  const eventEdit = new EventEdit(eventMock);

  const onEventEditEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      eventsList.replaceChild(event.getElement(), eventEdit.getElement());
      document.removeEventListener(`keydown`, onEventEditEscKeyDown);
    }
  };

  const onEventRollupButtonClick = (evt) => {
    evt.preventDefault();
    eventsList.replaceChild(eventEdit.getElement(), event.getElement());
    document.addEventListener(`keydown`, onEventEditEscKeyDown);
    event.getElement().removeEventListener(`click`, onEventRollupButtonClick);
  };

  const onEventEditRollupButtonClick = (evt) => {
    evt.preventDefault();
    eventsList.replaceChild(event.getElement(), eventEdit.getElement());
    document.removeEventListener(`keydown`, onEventEditEscKeyDown);
    eventEdit.getElement().removeEventListener(`click`, onEventEditRollupButtonClick);
  };

  const onEventEditSubmit = onEventEditRollupButtonClick;

  event.getElement()
    .querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, onEventRollupButtonClick);

  eventEdit.getElement()
    .querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, onEventEditRollupButtonClick);

  eventEdit.getElement()
    .querySelector(`form`)
    .addEventListener(`submit`, onEventEditSubmit);

  renderComponent(eventsList, event.getElement(), `beforeend`);
};

const renderEvents = (eventsList, eventsDay) => {
  eventsDay.forEach((event) => renderEvent(eventsList, event));
};

const renderDays = (uniqueDays) => {
  const tripDays = document.querySelector(`.trip-days`);
  uniqueDays.forEach((uniqueDay, index) => {
    const day = new Day(uniqueDay.shift(), index + 1);
    renderComponent(tripDays, day.getElement(), `beforeend`);
    const eventsList = day.getElement().querySelector(`.trip-events__list`);
    renderEvents(eventsList, uniqueDay.pop());
  });
};

const getSumCostTrip = (eventsMock) => {
  const sumCost = document.querySelector(`.trip-info__cost-value`);
  sumCost.textContent = eventsMock.map(({price}) => price).reduce((previousPrice, currentPrice) => previousPrice + currentPrice);
};

const renderLayout = (...components) => {
  const [menu, days, info, filter, sort] = components;
  renderComponent(tripInfo, info.getElement(), `afterbegin`);
  renderComponent(tripControls, menu.getElement());
  renderComponent(tripFilters, filter.getElement());
  renderComponent(tripEvents, days.getElement());
  renderComponent(tripEvents, sort.getElement());
};

const init = (eventsMock) => {
  const noEventsMarkup = `<p class="trip-events__msg">Click New Event to create your first point</p>`;
  if (eventsMock.length) {
    const menu = new Menu(menuTitles);
    const days = new Days();
    const info = new Info(getSortEvents(eventsMock));
    const filter = new Filter(filters);
    const sort = new Sort();
    renderLayout(menu, days, info, filter, sort);
    renderDays(getUniqueDays(getSortEvents(eventsMock)));
    getSumCostTrip(eventsMock);
  } else {
    renderComponent(tripEvents, createElement(noEventsMarkup));
  }
};

init(events);


