import {filters, getMockEvent, menuTitles} from "./data";
import TripController from "./controllers/trip-controller";
import {getSortEventList, renderComponent} from "./utils/util";
import Menu from "./components/menu";
import Days from "./components/days";
import Filter from "./components/filter";
import Sort from "./components/sort";

const EVENT_COUNT = 7;

const tripControls = document.querySelector(`.trip-controls > h2:first-child`);
const tripFilters = document.querySelector(`.trip-controls > h2:last-child`);
const tripEvents = document.querySelector(`.trip-events > h2`);

const events = new Array(EVENT_COUNT).fill(``).map(getMockEvent);

const getSortEvents = () => {
  return events.slice().sort(getSortEventList);
};

const getUniqueDays = () => {
  const sortedEvents = getSortEvents();
  const tripDays = sortedEvents.map(({time: {timeStartEvent}}) => new Date(timeStartEvent).toDateString());

  return Array.from(new Set(tripDays)).map((time) => {
    const filteredEvents = sortedEvents.filter((event) => new Date(event.time.timeStartEvent).toDateString() === time);
    return [time, filteredEvents];
  });
};
const renderLayout = () => {
  const menu = new Menu(menuTitles);
  const filter = new Filter(filters);
  const days = new Days();
  const sort = new Sort();

  renderComponent(tripControls, menu.getElement());
  renderComponent(tripFilters, filter.getElement());
  renderComponent(tripEvents, days.getElement());
  renderComponent(tripEvents, sort.getElement());
};

renderLayout();

const tripController = new TripController(getSortEvents(), getUniqueDays());
tripController.init();




// const unsortedDays = eventsDataArray.reduce((acc, it) =>{
//   const dt = getEventDayDate(it.eventTime.start);
//   if (!acc[dt]) {
//     acc[dt] = [];
//   }
//   acc[dt].push(it);
//   return acc;
// }, {});
