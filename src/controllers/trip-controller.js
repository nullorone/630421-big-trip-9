import Info from "../components/info";
import {createElement, renderComponent} from "../utils/util";
import Day from "../components/day";
import Event from "../components/event";
import EventEdit from "../components/eventEdit";
import Sort from "../components/sort";
import Days from "../components/days";

export default class TripController {
  constructor(events) {
    this._events = events.slice();
    this._sort = new Sort();
    this._days = new Days();
    this._uniqueEvets = this.getUniqueEventsList();
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

      renderComponent(tripEvents, this._days.getElement());
      renderComponent(tripEvents, this._sort.getElement());
      renderComponent(tripInfo, info.getElement(), `afterbegin`);
      this._sort.getElement().addEventListener(`click`, this._onSortButtonClick.bind(this), true);
      this._renderDays();
      this.getSumCostTrip();
    } else {
      renderComponent(tripEvents, createElement(noEventsMarkup));
    }
  }

  _onSortButtonClick(evt) {
    evt.preventDefault();
    const target = evt.target;

    if (target.tagName !== `LABEL`) {
      return;
    }

    const day = new Day().getElement();

    target.previousElementSibling.checked = true;
    this._days.getElement().innerHTML = ``;

    switch (target.dataset.type) {
      case (`time`):
        const getDurationEvent = (event) => Math.abs(event.time.timeFinishEvent - event.time.timeStartEvent);
        const sortedByDurationEvents = this._events.slice().sort((a, b) => getDurationEvent(b) - getDurationEvent(a));
        renderComponent(this._days.getElement(), day, `beforeend`);
        this._renderEvents(day.querySelector(`.trip-events__list`), sortedByDurationEvents);
        break;
      case (`price`):
        const sortedByPriceEvents = this._events.slice().sort((a, b) => b.price - a.price);
        renderComponent(this._days.getElement(), day, `beforeend`);
        this._renderEvents(day.querySelector(`.trip-events__list`), sortedByPriceEvents);
        break;
      default:
        this._renderDays();
        break;
    }
  }

  _renderEvent(eventsContainer, eventMock) {

  }

  _renderEvents(eventsContainer, eventsDay) {
    eventsDay.forEach((event) => this._renderEvent(eventsContainer, event));
  }

  _renderDays() {
    this._uniqueEvets.forEach((uniqueDay, index) => {
      const day = new Day(uniqueDay[0], index + 1);
      renderComponent(this._days.getElement(), day.getElement(), `beforeend`);

      const eventsContainer = day.getElement().querySelector(`.trip-events__list`);
      this._renderEvents(eventsContainer, uniqueDay);
    });
  }
}

