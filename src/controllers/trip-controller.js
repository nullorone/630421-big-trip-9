import Info from "../components/info";
import {createElement, renderComponent} from "../utils/util";
import Day from "../components/day";
import Event from "../components/event";
import EventEdit from "../components/eventEdit";

export default class TripController {
  constructor(events, uniqueDays) {
    // this._container = container;
    this._events = events;
    this._uniqueDays = uniqueDays;
  }

  _renderEvent(eventsList, eventMock) {
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
  }

  _renderEvents(eventsList, eventsDay) {
    eventsDay.forEach((event) => this._renderEvent(eventsList, event));
  }

  _renderDays() {
    const uniqueDaysCopy = this._uniqueDays.slice();
    const tripDays = document.querySelector(`.trip-days`);
    uniqueDaysCopy.forEach((uniqueDay, index) => {
      const day = new Day(uniqueDay.shift(), index + 1);
      renderComponent(tripDays, day.getElement(), `beforeend`);
      const eventsList = day.getElement().querySelector(`.trip-events__list`);
      this._renderEvents(eventsList, uniqueDay.pop());
    });
  }

  getSumCostTrip() {
    const sumCost = document.querySelector(`.trip-info__cost-value`);
    sumCost.textContent = this._events.map(({price}) => price).reduce((previousPrice, currentPrice) => previousPrice + currentPrice);
  }

  init() {
    const tripEvents = document.querySelector(`.trip-events > h2`);
    const tripInfo = document.querySelector(`.trip-info`);
    const noEventsMarkup = `<p class="trip-events__msg">Click New Event to create your first point</p>`;

    if (this._events.length) {
      const info = new Info(this._events);

      renderComponent(tripInfo, info.getElement(), `afterbegin`);
      this._renderDays();
      this.getSumCostTrip();
    } else {
      renderComponent(tripEvents, createElement(noEventsMarkup));
    }
  }
}

