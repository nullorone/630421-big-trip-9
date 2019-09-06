import Info from "../components/info";
import {createElement, renderComponent} from "../utils/util";
import Day from "../components/day";
import Event from "../components/event";
import EventEdit from "../components/eventEdit";
import Sort from "../components/sort";

export default class TripController {
  constructor(events) {
    this._events = events.slice();
    this._sort = new Sort();
  }

  // Получаем объект с ключом - день:number и значением - евенты:[]
  getSortedDays() {
    return this._events.reduce((acc, value) => {

      const date = Date.parse(new Date(value.time.timeStartEvent).toDateString());
      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(value);

      return acc;
    }, {});
  }

  // Получаем двумерный массив с евентами
  getUniqueEventsList() {
    let eventsResult = [];
    for (let [, value] of Object.entries(this.getSortedDays())) {
      eventsResult.push(value);
    }

    return eventsResult;
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

      renderComponent(tripEvents, this._sort.getElement());
      renderComponent(tripInfo, info.getElement(), `afterbegin`);
      this._renderDays();
      this.getSumCostTrip();
    } else {
      renderComponent(tripEvents, createElement(noEventsMarkup));
    }
  }

  _renderEvent(eventsContainer, eventMock) {
    const event = new Event(eventMock);
    const eventEdit = new EventEdit(eventMock);

    const onEventEditEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        eventsContainer.replaceChild(event.getElement(), eventEdit.getElement());
        document.removeEventListener(`keydown`, onEventEditEscKeyDown);
      }
    };

    const onEventRollupButtonClick = (evt) => {
      evt.preventDefault();
      eventsContainer.replaceChild(eventEdit.getElement(), event.getElement());
      document.addEventListener(`keydown`, onEventEditEscKeyDown);
      event.getElement().removeEventListener(`click`, onEventRollupButtonClick);
    };

    const onEventEditRollupButtonClick = (evt) => {
      evt.preventDefault();
      eventsContainer.replaceChild(event.getElement(), eventEdit.getElement());
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

    renderComponent(eventsContainer, event.getElement(), `beforeend`);
  }

  _renderEvents(eventsContainer, eventsDay) {
    eventsDay.forEach((event) => this._renderEvent(eventsContainer, event));
  }

  _renderDays() {
    const tripDays = document.querySelector(`.trip-days`);

    this.getUniqueEventsList().forEach((uniqueDay, index) => {
      const day = new Day(uniqueDay[0], index + 1);
      renderComponent(tripDays, day.getElement(), `beforeend`);

      const eventsContainer = day.getElement().querySelector(`.trip-events__list`);
      this._renderEvents(eventsContainer, uniqueDay);
    });
  }
}

